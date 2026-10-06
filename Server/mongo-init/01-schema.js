// MongoDB init script — runs ONCE on first startup of an EMPTY volume
// (files in /docker-entrypoint-initdb.d are ignored on later starts).
// Sets up TTL indexes (1-year retention) + schema validators for the
// systemaops database. Safe to re-run logic via the backfill script:
//   npm run migrate:retention
//
// NOTE: init scripts run BEFORE any app data exists, so collections
// must be CREATED here (collMod alone fails on missing collections).

db = db.getSiblingDB("systemaops");

function ensureCollection(name, validator) {
  const names = db.getCollectionNames();
  if (!names.includes(name)) {
    db.createCollection(name, {
      validator: validator,
      validationLevel: "strict",
      validationAction: "error",
    });
  } else {
    db.runCommand({
      collMod: name,
      validator: validator,
      validationLevel: "strict",
      validationAction: "error",
    });
  }
}

// Create TTL indexes for 1-year calendar-year retention policy.
// expireAfterSeconds: 0 => documents expire exactly at `expiresAt`.
db.contacts.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
db.careerapplications.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
db.activities.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
db.notifications.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Operational query indexes (also declared in Mongoose schemas, which
// auto-create on backend boot — this covers fresh volumes explicitly).
db.contacts.createIndex({ status: 1, createdAt: -1 });
db.contacts.createIndex({ assigneeId: 1, status: 1 });
db.contacts.createIndex({ followUpAt: 1 });
db.careerapplications.createIndex({ status: 1, createdAt: -1 });
db.careerapplications.createIndex({ role: 1, status: 1 });
db.careerapplications.createIndex({ followUpAt: 1 });
db.activities.createIndex({ entityType: 1, entityId: 1, createdAt: -1 });
db.activities.createIndex({ createdAt: -1 });
db.notifications.createIndex({ userId: 1, read: 1, createdAt: -1 });
db.adminusers.createIndex({ email: 1 }, { unique: true });

// Contacts validator mirrors src/models/Contact.js.
// `company` is optional (may be "") but must never be ONLY "" —
// so NO enum constraint here (an earlier revision wrongly used
// enum: [""], which would reject every real submission).
ensureCollection("contacts", {
  $jsonSchema: {
    bsonType: "object",
    required: ["name", "email", "phone", "message", "privacyAccepted"],
    properties: {
      name: { bsonType: "string", maxLength: 120 },
      email: {
        bsonType: "string",
        pattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
      },
      phone: { bsonType: "string", maxLength: 32 },
      company: { bsonType: "string", maxLength: 160 },
      message: { bsonType: "string", maxLength: 5000 },
      privacyAccepted: { bsonType: "boolean" },
      privacyVersion: { bsonType: "string", maxLength: 32 },
      privacyAcceptedAt: { bsonType: "date" },
      expiresAt: { bsonType: "date" },
    },
  },
});

// Career applications validator mirrors
// src/models/CareerApplication.js (same enum fix for `portfolio`).
ensureCollection("careerapplications", {
  $jsonSchema: {
    bsonType: "object",
    required: [
      "firstName",
      "lastName",
      "email",
      "phone",
      "role",
      "linkedin",
      "resumeUrl",
      "privacyAccepted",
    ],
    properties: {
      firstName: { bsonType: "string", maxLength: 80 },
      lastName: { bsonType: "string", maxLength: 80 },
      email: {
        bsonType: "string",
        pattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
      },
      phone: { bsonType: "string", maxLength: 32 },
      role: { bsonType: "string", maxLength: 120 },
      linkedin: { bsonType: "string", maxLength: 500 },
      portfolio: { bsonType: "string", maxLength: 500 },
      whyUs: { bsonType: "string", maxLength: 2000 },
      resumeUrl: { bsonType: "string", maxLength: 1000 },
      // Operational workflow statuses (mirrors src/config/workflow.js).
      // Legacy values (Pending/Reviewed/...) are migrated forward by
      // `npm run migrate:ops` on existing volumes.
      status: {
        bsonType: "string",
        enum: [
          "NEW",
          "REVIEWING",
          "SHORTLISTED",
          "INTERVIEW",
          "OFFER",
          "HIRED",
          "REJECTED",
        ],
      },
      privacyAccepted: { bsonType: "boolean" },
      privacyVersion: { bsonType: "string", maxLength: 32 },
      privacyAcceptedAt: { bsonType: "date" },
      expiresAt: { bsonType: "date" },
    },
  },
});

print("MongoDB schema initialization complete.");
