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

// Consultation payments (Stripe Checkout).
// The UNIQUE session index is the idempotency backbone: duplicate or
// concurrent webhook deliveries collapse onto one row.
// Also declared in src/models/StripePayment.js (Mongoose auto-creates
// schema indexes on backend boot); declared here so fresh volumes are
// correct before the first app boot.
ensureCollection("stripe_payments", {
  $jsonSchema: {
    bsonType: "object",
    required: ["stripe_session_id", "email_status", "email_attempts"],
    properties: {
      stripe_session_id: { bsonType: "string", maxLength: 255 },
      payment_intent_id: { bsonType: ["string", "null"] },
      consultation_id: { bsonType: ["objectId", "null"] },
      price_id: { bsonType: ["string", "null"], maxLength: 255 },
      quantity: { bsonType: ["int", "long", "double", "null"] },
      payment_status: {
        bsonType: ["string", "null"],
        enum: ["paid", "failed", null],
      },
      amount_total: { bsonType: ["int", "long", "double", "null"] },
      currency: { bsonType: ["string", "null"], maxLength: 8 },
      customer_email: { bsonType: ["string", "null"], maxLength: 254 },
      customer_name: { bsonType: ["string", "null"], maxLength: 120 },
      email_status: {
        bsonType: "string",
        enum: ["pending", "sending", "sent", "failed"],
      },
      email_attempts: { bsonType: "int", minimum: 0 },
      email_lease_expires_at: { bsonType: ["date", "null"] },
      email_sent_at: { bsonType: ["date", "null"] },
      last_error: { bsonType: ["string", "null"], maxLength: 200 },
      last_event_id: { bsonType: ["string", "null"], maxLength: 255 },
    },
  },
});
db.stripe_payments.createIndex({ stripe_session_id: 1 }, { unique: true });
db.stripe_payments.createIndex({ consultation_id: 1, createdAt: -1 });
db.stripe_payments.createIndex({ email_status: 1, updatedAt: -1 });
db.stripe_payments.createIndex({ payment_status: 1, createdAt: -1 });

// Verified webhook event ledger. UNIQUE event_id is the duplicate-delivery
// collapse point; the payment/email state machines remain independently
// idempotent. No TTL: financial audit retention is not defined yet.
ensureCollection("stripe_webhook_events", {
  $jsonSchema: {
    bsonType: "object",
    required: ["event_id", "event_type", "status", "attempts"],
    properties: {
      event_id: { bsonType: "string", maxLength: 255 },
      event_type: { bsonType: "string", maxLength: 120 },
      stripe_session_id: { bsonType: ["string", "null"], maxLength: 255 },
      status: {
        bsonType: "string",
        enum: ["processing", "processed", "ignored", "failed"],
      },
      claim_id: { bsonType: ["string", "null"], maxLength: 64 },
      attempts: { bsonType: "int", minimum: 0 },
      lease_expires_at: { bsonType: ["date", "null"] },
      last_error: { bsonType: ["string", "null"], maxLength: 200 },
    },
  },
});
db.stripe_webhook_events.createIndex({ event_id: 1 }, { unique: true });
db.stripe_webhook_events.createIndex({ status: 1, updatedAt: -1 });

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

// Book-a-call consultation enquiries.
// Mirrors the contacts retention policy and privacy fields; there is NO
// phone field here (the book-a-call form deliberately has none).
ensureCollection("consultations", {
  $jsonSchema: {
    bsonType: "object",
    required: ["name", "email", "areaOfInterest", "message", "privacyAccepted"],
    properties: {
      name: { bsonType: "string", maxLength: 120 },
      email: {
        bsonType: "string",
        pattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
      },
      company: { bsonType: "string", maxLength: 160 },
      areaOfInterest: { bsonType: "string", maxLength: 40 },
      message: { bsonType: "string", maxLength: 4000 },
      privacyAccepted: { bsonType: "boolean" },
      privacyVersion: { bsonType: "string", maxLength: 32 },
      privacyAcceptedAt: { bsonType: "date" },
      expiresAt: { bsonType: "date" },
      paymentStatus: {
        bsonType: ["string", "null"],
        enum: ["pending", "paid", "failed", null],
      },
      stripeSessionId: { bsonType: ["string", "null"], maxLength: 255 },
      paymentPriceId: { bsonType: ["string", "null"], maxLength: 255 },
      paymentAmountMinor: { bsonType: ["int", "long", "double", "null"] },
      paymentCurrency: { bsonType: ["string", "null"], maxLength: 8 },
      paymentQuantity: { bsonType: ["int", "long", "double", "null"] },
      paymentStartedAt: { bsonType: ["date", "null"] },
      checkoutNonce: { bsonType: ["string", "null"], maxLength: 64 },
      checkoutLockUntil: { bsonType: ["date", "null"] },
      checkoutLockToken: { bsonType: ["string", "null"], maxLength: 64 },
      paidAt: { bsonType: ["date", "null"] },
    },
  },
});
db.consultations.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
db.consultations.createIndex({ createdAt: -1 });
db.consultations.createIndex({ areaOfInterest: 1, createdAt: -1 });
db.consultations.createIndex({ stripeSessionId: 1 });

print("MongoDB schema initialization complete.");
