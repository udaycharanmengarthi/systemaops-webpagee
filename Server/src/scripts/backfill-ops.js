/* Server/src/scripts/backfill-ops.js
 *
 * Backfills operational fields (status/priority/assignee/tags/notes/
 * followUp/lastActivityAt) on pre-workflow documents. Additive only:
 * existing values are NEVER overwritten; only missing fields are set.
 *
 * Legacy career statuses are mapped forward:
 *   Pending->NEW, Reviewed->REVIEWING, Shortlisted->SHORTLISTED,
 *   Rejected->REJECTED, anything else->NEW.
 *
 * Usage:
 *   npm run migrate:ops              apply to missing fields only
 *   npm run migrate:ops -- --dry-run report counts, perform NO writes
 *
 * Never deletes documents. Also syncs operational indexes.
 */

import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import Contact from "../models/Contact.js";
import CareerApplication from "../models/CareerApplication.js";
import {
  CONTACT_STATUSES,
  LEGACY_CAREER_STATUS_MAP,
} from "../config/workflow.js";

const DRY_RUN = process.argv.includes("--dry-run");

const OPS_DEFAULTS = {
  priority: "MEDIUM",
  assigneeId: null,
  assigneeName: "",
  assignedAt: null,
  tags: [],
  followUpAt: null,
  followUpNote: "",
  followUpDone: false,
  lastActivityAt: null,
};

async function backfillCollection(model, label, statusFor) {
  const cursor = model.collection.find({});
  let scanned = 0;
  let updated = 0;
  for await (const raw of cursor) {
    scanned += 1;
    const set = {};
    for (const [key, value] of Object.entries(OPS_DEFAULTS)) {
      if (raw[key] === undefined || raw[key] === null) {
        // tags: also normalize non-array legacy values to [].
        if (key === "tags" && raw[key] !== undefined && raw[key] !== null) continue;
        set[key] = value;
      }
    }
    if (!Array.isArray(raw.tags)) set.tags = [];
    if (!Array.isArray(raw.notes)) set.notes = [];
    const mapped = statusFor(raw.status);
    if (mapped !== raw.status) set.status = mapped;
    if (Object.keys(set).length === 0) continue;
    if (!DRY_RUN) {
      await model.updateOne({ _id: raw._id }, { $set: set });
    }
    updated += 1;
  }
  console.log(
    `[${label}] scanned=${scanned} ${DRY_RUN ? "would-update" : "updated"}=${updated}`
  );
}

async function main() {
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI is not set.");
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGO_URI);

  await backfillCollection(Contact, "contacts", (status) =>
    CONTACT_STATUSES.includes(status) ? status : "NEW"
  );
  await backfillCollection(
    CareerApplication,
    "careerapplications",
    (status) => LEGACY_CAREER_STATUS_MAP[status] || "NEW"
  );

  if (!DRY_RUN) {
    // Ensures text/compound ops indexes exist; keeps TTL indexes.
    await Contact.syncIndexes();
    await CareerApplication.syncIndexes();
    console.log("Indexes synced.");
  } else {
    console.log("Dry-run complete: no writes performed.");
  }

  await mongoose.disconnect();
}

main().catch(() => {
  console.error("Ops backfill failed.");
  process.exit(1);
});
