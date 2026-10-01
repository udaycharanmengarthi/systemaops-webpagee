// MongoDB init script - runs on container first startup
// Sets up users, collections, and TTL indexes for the systemaops database

db = db.getSiblingDB("systemaops");

// Create TTL indexes for 1-year calendar-year retention policy
db.contacts.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
db.careerapplications.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Apply schema validation for contacts collection
db.runCommand({
  collMod: "contacts",
  validator: {
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
        company: { bsonType: "string", maxLength: 160, enum: [""] },
        message: { bsonType: "string", maxLength: 5000 },
        privacyAccepted: { bsonType: "boolean" },
        privacyVersion: { bsonType: "string", maxLength: 32 },
        privacyAcceptedAt: { bsonType: "date" },
        expiresAt: { bsonType: "date" },
      },
    },
  },
  validationLevel: "strict",
  validationAction: "error",
});

// Apply schema validation for careerapplications collection
db.runCommand({
  collMod: "careerapplications",
  validator: {
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
        portfolio: { bsonType: "string", maxLength: 500, enum: [""] },
        whyUs: { bsonType: "string", maxLength: 2000 },
        resumeUrl: { bsonType: "string", maxLength: 1000 },
        status: {
          bsonType: "string",
          enum: ["Pending", "Reviewed", "Shortlisted", "Rejected"],
        },
        privacyAccepted: { bsonType: "boolean" },
        privacyVersion: { bsonType: "string", maxLength: 32 },
        privacyAcceptedAt: { bsonType: "date" },
        expiresAt: { bsonType: "date" },
      },
    },
  },
  validationLevel: "strict",
  validationAction: "error",
});

print("MongoDB schema initialization complete.");