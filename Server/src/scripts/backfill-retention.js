import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import Contact from "../models/Contact.js";
import CareerApplication from "../models/CareerApplication.js";

function expiresFromCreated(createdAt) {
  const d = new Date(createdAt);
  d.setFullYear(d.getFullYear() + 1);
  return d;
}

async function main() {
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI is not set");
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGO_URI);

  const contacts = await Contact.find({ expiresAt: { $exists: false } }).select("_id createdAt");
  let contactFixed = 0;
  for (const doc of contacts) {
    await Contact.updateOne(
      { _id: doc._id },
      { $set: { expiresAt: expiresFromCreated(doc.createdAt || new Date()) } }
    );
    contactFixed += 1;
  }

  const careers = await CareerApplication.find({ expiresAt: { $exists: false } }).select("_id createdAt");
  let careerFixed = 0;
  for (const doc of careers) {
    await CareerApplication.updateOne(
      { _id: doc._id },
      { $set: { expiresAt: expiresFromCreated(doc.createdAt || new Date()) } }
    );
    careerFixed += 1;
  }

  // Ensure TTL indexes exist (single mechanism, no duplicates).
  await Contact.collection.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
  await CareerApplication.collection.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });

  console.log(`Backfill complete: contacts=${contactFixed} careers=${careerFixed}`);
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error("Backfill failed");
  process.exit(1);
});
