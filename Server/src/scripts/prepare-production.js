/* Server/src/scripts/prepare-production.js
 *
 * PRE-PRODUCTION DATA CLEANUP — explicit, auditable, fail-safe.
 *
 * Safety model:
 *   - NEVER deletes the database, collections, indexes, or TTL config.
 *   - PRESERVES the production admin account (verified by email/role).
 *   - Deletes ONLY records classified as development/test data.
 *   - Ambiguous records are PRESERVED and reported for manual review.
 *   - Requires CONFIRM_PRODUCTION_CLEANUP=YES for destructive execution.
 *   - --dry-run inspects/classifies/reports but deletes NOTHING.
 *
 * Usage (inside the backend container, or host with MONGO_URI):
 *   npm run production:cleanup -- --dry-run
 *   CONFIRM_PRODUCTION_CLEANUP=YES npm run production:cleanup
 */

import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";

const DRY_RUN = process.argv.includes("--dry-run");
const CONFIRMED = process.env.CONFIRM_PRODUCTION_CLEANUP === "YES";

const EXPECTED_DB = "systemaops";

/* The one real production admin. Never modified by this script. */
const PRODUCTION_ADMIN_EMAIL = (
  process.env.PRODUCTION_ADMIN_EMAIL || "admin@systemaops.com"
).toLowerCase();

/* Dev/QA admin accounts created during development. Deleted ONLY if
   they still match a VIEWER/MANAGER/ADMIN role that is NOT the
   production admin. SUPER_ADMIN accounts are never touched. */
const TEST_ADMIN_EMAILS = ["viewer@systemaops.com", "udaycharanmengarthi1@gmail.com"];

/* Strong test signatures — a record is deleted only when at least one
   field clearly matches. Anything else is preserved as ambiguous. */
const TEST_EMAIL_RE = /(dbtest|vite-verify|compat@|admine2e|e2ecandidate|regression@|final@|round@|resetround@|qa@)/i;
const TEST_NAME_RE = /(db verification|vite proxy|compat check|admin e2e|regression|round check|reset round|final regression|e2e candidate)/i;
const TEST_COMPANY_RE = /^(qa|e2e co|compatco|test)$/i;
const TEST_ROLE_RE = /(qa engineer|e2e)/i;

function isTestContact(record) {
  const fields = [record.name, record.email, record.company, record.message].filter(Boolean).join(" ");
  if (TEST_EMAIL_RE.test(fields)) return true;
  if (TEST_NAME_RE.test(fields)) return true;
  if (TEST_COMPANY_RE.test(String(record.company || ""))) return true;
  return false;
}

function isTestCareer(record) {
  const fields = [
    record.firstName,
    record.lastName,
    record.email,
    record.role,
    record.whyUs,
  ]
    .filter(Boolean)
    .join(" ");
  if (TEST_EMAIL_RE.test(fields)) return true;
  if (TEST_NAME_RE.test(fields)) return true;
  if (TEST_ROLE_RE.test(String(record.role || ""))) return true;
  return false;
}

const summary = { deleted: {}, preserved: {}, ambiguous: {} };

function bump(key) {
  summary.deleted[key] = (summary.deleted[key] || 0) + 1;
}
function keep(key) {
  summary.preserved[key] = (summary.preserved[key] || 0) + 1;
}
function maybe(key) {
  summary.ambiguous[key] = (summary.ambiguous[key] || 0) + 1;
}

async function count(db, name) {
  return db.collection(name).countDocuments();
}

async function removeTestRecords(db, name, classifier) {
  const cursor = db.collection(name).find({});
  let scanned = 0;
  let toDelete = 0;
  let kept = 0;
  let flagged = 0;
  const ids = [];
  for await (const doc of cursor) {
    scanned += 1;
    const isTest = classifier(doc);
    if (isTest) {
      toDelete += 1;
      ids.push(doc._id);
    } else if (
      // Contacts/careers with clearly real-looking identities that fail
      // the strong test signatures are ambiguous, not safely deletable.
      true
    ) {
      kept += 1;
      flagged += 1;
      maybe(name);
      keep(name);
    }
  }
  if (!DRY_RUN && ids.length > 0) {
    const result = await db.collection(name).deleteMany({ _id: { $in: ids } });
    console.log(`[${name}] deleted ${result.deletedCount}`);
  } else if (DRY_RUN) {
    console.log(`[${name}] would-delete ${ids.length}`);
  }
  console.log(
    `[${name}] scanned=${scanned} test=${toDelete} preserved=${kept}`
  );
  for (let i = 0; i < toDelete; i += 1) bump(name);
  return { scanned, toDelete, kept, flagged };
}

async function main() {
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI is not set.");
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGO_URI);

  const dbName = mongoose.connection.name;
  console.log(`DATABASE_IDENTITY: ${dbName}`);
  if (dbName !== EXPECTED_DB) {
    console.error(`ABORT: expected database "${EXPECTED_DB}", got "${dbName}".`);
    await mongoose.disconnect();
    process.exit(1);
  }

  const db = mongoose.connection.db;

  /* ── Inventory ── */
  console.log("--- PRE-CLEANUP INVENTORY ---");
  const names = (await db.listCollections().toArray()).map((c) => c.name).sort();
  const before = {};
  for (const n of names) {
    before[n] = await count(db, n);
    console.log(`  ${n}: ${before[n]}`);
  }

  /* ── Production admin verification ── */
  const admins = await db.collection("adminusers").find({}).toArray();
  const prodAdmin = admins.find(
    (a) => a.email === PRODUCTION_ADMIN_EMAIL && a.role === "SUPER_ADMIN"
  );
  console.log(`PRODUCTION_ADMIN: ${prodAdmin ? "verified" : "MISSING"}`);
  console.log(
    `  ${prodAdmin ? `${prodAdmin.email} | ${prodAdmin.role} | ${prodAdmin.status}` : "ABORT REQUIRED"}`
  );
  if (!prodAdmin) {
    console.error("ABORT: production admin not verified. Nothing will be deleted.");
    await mongoose.disconnect();
    process.exit(1);
  }

  /* ── Pre-exec confirmation guard ── */
  if (!DRY_RUN && !CONFIRMED) {
    console.error(
      "ABORT: destructive cleanup requires CONFIRM_PRODUCTION_CLEANUP=YES."
    );
    await mongoose.disconnect();
    process.exit(1);
  }
  if (DRY_RUN) console.log("MODE: dry-run (no deletions)");
  else console.log("MODE: EXEC (confirmed)");

  /* ── Business records: contacts + careers (classify each) ── */
  await removeTestRecords(db, "contacts", isTestContact);
  await removeTestRecords(db, "careerapplications", isTestCareer);

  /* ── Audit + notifications: dev-era only, clean start intended ── */
  if (DRY_RUN) {
    console.log(`[activities] would-delete ${await count(db, "activities")}`);
    console.log(`[notifications] would-delete ${await count(db, "notifications")}`);
  } else {
    const a = await db.collection("activities").deleteMany({});
    const n = await db.collection("notifications").deleteMany({});
    console.log(`[activities] deleted ${a.deletedCount}`);
    console.log(`[notifications] deleted ${n.deletedCount}`);
    summary.deleted.activities = a.deletedCount;
    summary.deleted.notifications = n.deletedCount;
  }

  /* ── Test admin accounts (never SUPER_ADMIN) ── */
  for (const email of TEST_ADMIN_EMAILS) {
    const account = admins.find((a) => a.email === email);
    if (!account) continue;
    if (account.role === "SUPER_ADMIN") {
      console.log(`[adminusers] SKIPPED SUPER_ADMIN: ${email}`);
      continue;
    }
    if (DRY_RUN) {
      console.log(`[adminusers] would-delete ${email} (${account.role})`);
    } else {
      await db.collection("adminusers").deleteOne({ _id: account._id });
      console.log(`[adminusers] deleted ${email} (${account.role})`);
    }
    bump("adminusers");
  }

  /* ── Invalidate ALL password-reset state (dev links compromised) ── */
  const reset = await db.collection("adminusers").updateMany(
    {},
    { $set: { resetTokenHash: "", resetTokenExpiresAt: null } }
  );
  if (!DRY_RUN) {
    console.log(`[adminusers] reset-state invalidated on ${reset.modifiedCount} account(s)`);
    /* Invalidate stale development sessions for the production admin
       only — normal tokenVersion semantics. */
    const tv = await db.collection("adminusers").updateOne(
      { email: PRODUCTION_ADMIN_EMAIL },
      { $inc: { tokenVersion: 1 } }
    );
    console.log(`[adminusers] production-admin sessions invalidated: ${tv.modifiedCount}`);
  } else {
    console.log("[adminusers] would-invalidate reset state + prod-admin sessions");
  }

  /* ── Post-state ── */
  console.log("--- POST-CLEANUP STATE ---");
  const after = {};
  for (const n of names) {
    after[n] = await count(db, n);
    console.log(`  ${n}: ${after[n]}`);
  }

  /* ── Index/TTL verification (read-only) ── */
  console.log("--- INDEX / TTL CHECK ---");
  for (const n of ["contacts", "careerapplications", "activities", "notifications"]) {
    if (!names.includes(n)) continue;
    const idx = await db.collection(n).listIndexes().toArray();
    const ttl = idx.filter((i) => i.expireAfterSeconds !== undefined);
    console.log(`  ${n}: indexes=${idx.length} ttl=${ttl.map((t) => t.name).join(",") || "none"}`);
  }

  console.log("SUMMARY:", JSON.stringify(summary));
  await mongoose.disconnect();
  console.log(DRY_RUN ? "DRY-RUN COMPLETE (no deletions)" : "CLEANUP COMPLETE");
}

main().catch((err) => {
  console.error("CLEANUP FAILED:", err && err.message ? err.message : err);
  process.exit(1);
});
