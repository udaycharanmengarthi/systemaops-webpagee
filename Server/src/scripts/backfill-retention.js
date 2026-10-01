/* Server/src/scripts/backfill-retention.js
 *
 * Ensures every contact enquiry and job application carries a
 * correct `expiresAt` (= createdAt + 1 calendar year) and that the
 * TTL indexes exist.
 *
 * Usage:
 *   npm run migrate:retention              fill MISSING expiresAt only (legacy safe default)
 *   npm run migrate:retention -- --dry-run report counts, perform NO writes
 *   npm run migrate:retention -- --repair  also repair invalid expiresAt values
 *
 * Repair policy (repair mode only):
 * - missing expiresAt            -> set from createdAt
 * - wrong type                   -> set from createdAt
 * - expiresAt <= createdAt       -> set from createdAt (impossible under policy)
 * - expiresAt > createdAt + 367d -> set from createdAt (violates 1-year policy;
 *                                   367d ceiling allows the Feb 29 -> Mar 1 leap edge)
 * - missing/unusable createdAt  -> fall back to now (same as new records)
 *
 * This script NEVER deletes documents. A valid existing expiresAt is
 * never overwritten outside --repair mode.
 */

import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import Contact from "../models/Contact.js";
import CareerApplication from "../models/CareerApplication.js";
import {
  RETENTION_MAX_DAYS,
  expiresAtFor,
  isValidDate,
} from "../utils/retention.js";

const DRY_RUN = process.argv.includes("--dry-run");
const REPAIR = process.argv.includes("--repair");

const DAY_MS = 24 * 60 * 60 * 1000;

function classify(raw) {
  const created = raw.createdAt instanceof Date ? raw.createdAt : new Date(raw.createdAt);
  if (!isValidDate(created)) return "no-created";
  const exp = raw.expiresAt;
  if (exp === undefined || exp === null) return "missing";
  if (!(exp instanceof Date) || !isValidDate(exp)) return "invalid-type";
  if (exp.getTime() <= created.getTime()) return "too-early";
  if (exp.getTime() - created.getTime() > RETENTION_MAX_DAYS * DAY_MS) {
    return "too-late";
  }
  return "ok";
}

function emptyCounts() {
  return { ok: 0, missing: 0, "invalid-type": 0, "too-early": 0, "too-late": 0, "no-created": 0, repaired: 0 };
}

async function auditCollection(model, label) {
  // Raw read: bypasses Mongoose casting so wrong types are visible.
  const cursor = model.collection.find(
    {},
    { projection: { createdAt: 1, expiresAt: 1 } }
  );
  const counts = emptyCounts();
  const toRepair = [];
  for await (const raw of cursor) {
    const kind = classify(raw);
    counts[kind] += 1;
    if (kind === "no-created") {
      // No usable createdAt to anchor the policy; only --repair
      // touches these (falls back to now, same as new records).
      if (REPAIR) toRepair.push(raw);
    } else if (kind !== "ok") {
      toRepair.push(raw);
    }
  }
  return { label, counts, toRepair };
}

async function repairDocs(model, docs) {
  let repaired = 0;
  for (const raw of docs) {
    let base = raw.createdAt;
    if (!isValidDate(base instanceof Date ? base : new Date(base))) {
      base = new Date();
    }
    await model.updateOne(
      { _id: raw._id },
      { $set: { expiresAt: expiresAtFor(base) } }
    );
    repaired += 1;
  }
  return repaired;
}

async function ensureTTLIndex(model, label) {
  const indexes = await model.collection.listIndexes().toArray();
  const same = indexes.find((i) => i.name === "expiresAt_1");
  if (same && same.expireAfterSeconds === 0) {
    return "already-ok";
  }
  const onKey = indexes.find(
    (i) => i.key && i.key.expiresAt === 1 && i.name !== "expiresAt_1"
      && (i.expireAfterSeconds === undefined || i.expireAfterSeconds !== 0)
  );
  if (same || onKey) {
    const found = same || onKey;
    console.error(
      `[${label}] CONFLICT: an index on expiresAt already exists with ` +
      `different options (name=${found.name}, ` +
      `expireAfterSeconds=${found.expireAfterSeconds}). Refusing to ` +
      `overwrite it automatically. To resolve: inspect it with ` +
      `db.${model.collection.name}.getIndexes(), and — only after ` +
      `confirming no production data depends on it — drop it with ` +
      `db.${model.collection.name}.dropIndex(${JSON.stringify(found.name)}), ` +
      `then rerun this script.`
    );
    process.exitCode = 1;
    return "conflict";
  }
  if (DRY_RUN) return "would-create";
  try {
    await model.collection.createIndex(
      { expiresAt: 1 },
      { expireAfterSeconds: 0 }
    );
    return "created";
  } catch (e) {
    console.error(
      `[${label}] Could not ensure TTL index: ${e && e.message ? e.message : e}. ` +
      `If another expiresAt index exists with different options, drop it ` +
      `only after review, then rerun.`
    );
    process.exitCode = 1;
    return "conflict";
  }
}

function printCounts(label, counts) {
  console.log(
    `[${label}] ok=${counts.ok} missing=${counts.missing} ` +
    `invalid-type=${counts["invalid-type"]} too-early=${counts["too-early"]} ` +
    `too-late=${counts["too-late"]} no-created=${counts["no-created"]}`
  );
}

async function main() {
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI is not set");
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGO_URI);

  const models = [
    [Contact, "contacts"],
    [CareerApplication, "careerapplications"],
  ];

  for (const [model, label] of models) {
    const { counts, toRepair } = await auditCollection(model, label);
    printCounts(label, counts);

    if (DRY_RUN) {
      console.log(`[${label}] dry-run: no writes performed (${toRepair.length} would be repaired with --repair).`);
      const idx = await ensureTTLIndex(model, label);
      console.log(`[${label}] dry-run: TTL index status=${idx}.`);
      continue;
    }

    if (REPAIR) {
      const n = await repairDocs(model, toRepair);
      console.log(`[${label}] repair: updated ${n} document(s).`);
    } else if (toRepair.length > 0) {
      // Legacy safe default: fill only MISSING values.
      const missingOnly = toRepair.filter(
        (raw) => raw.expiresAt === undefined || raw.expiresAt === null
      );
      const n = await repairDocs(model, missingOnly);
      console.log(
        `[${label}] backfill: set expiresAt on ${n} document(s) ` +
        `(${toRepair.length - n} non-missing issue(s) left for --repair).`
      );
    } else {
      console.log(`[${label}] backfill: nothing to do.`);
    }

    const idx = await ensureTTLIndex(model, label);
    console.log(`[${label}] TTL index status=${idx}.`);
  }

  if (DRY_RUN) console.log("Dry-run complete: no writes performed.");
  else if (REPAIR) console.log("Repair complete.");
  else console.log("Backfill complete.");

  await mongoose.disconnect();
}

main().catch(() => {
  console.error("Backfill failed");
  process.exit(1);
});
