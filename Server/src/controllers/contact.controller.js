import validator from "validator";
import Contact from "../models/Contact.js";
import { expiresAtFor } from "../utils/retention.js";
import { sendFounderEmail } from "../services/mail.service.js";
import {
  notifyAdmins,
  recordActivity,
} from "../services/activity.service.js";

const PRIVACY_VERSION = "2026-01-01";

function sanitizeString(value, max = 5000) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

export const submitContact = async (req, res) => {
  try {
    let { name, email, phone, company, message, privacyAccepted, privacyVersion } = req.body;

    name = sanitizeString(name, 120);
    email = sanitizeString(email, 254).toLowerCase();
    phone = sanitizeString(phone, 32);
    company = sanitizeString(company, 160);
    message = sanitizeString(message, 5000);

    // Required fields
    if (!name || !email || !phone || !company || !message) {
      return res.status(400).json({
        success: false,
        message: "All required fields are required",
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    if (privacyAccepted !== true) {
      return res.status(400).json({
        success: false,
        message: "Privacy acknowledgement is required",
      });
    }

    // Phone validation — supports country code e.g. +917418529630
    const digitsOnly = phone.replace(/\D/g, "");
    if (digitsOnly.length < 7 || digitsOnly.length > 15) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid phone number",
      });
    }

    // Fake/spam numbers block
    const invalidNumbers = [
      "0000000000",
      "1111111111",
      "1234567890",
      "9999999999",
      "2222222222",
      "3333333333",
      "4444444444",
      "5555555555",
      "6666666666",
      "7777777777",
      "8888888888",
    ];

    if (invalidNumbers.includes(digitsOnly)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid phone number",
      });
    }

    /* One capture instant drives both timestamps so that
       expiresAt = createdAt + 1 calendar year, exactly. */
    const submittedAt = new Date();

    // Save to DB
    const contact = await Contact.create({
      name,
      email,
      phone,
      company,
      message,
      privacyAccepted: true,
      privacyVersion: typeof privacyVersion === "string" ? privacyVersion.slice(0, 32) : PRIVACY_VERSION,
      privacyAcceptedAt: submittedAt,
      createdAt: submittedAt,
      expiresAt: expiresAtFor(submittedAt),
    });

    // Audit + admin notification (best-effort; never blocks success).
    try {
      await recordActivity({
        req,
        action: "CONTACT_CREATED",
        entityType: "contact",
        entityId: contact._id,
        entityLabel: `${name} — ${company || email}`,
      });
      await notifyAdmins({
        type: "NEW_CONTACT",
        title: `New contact: ${name}`,
        body: `${company || email}`,
        entityType: "contact",
        entityId: contact._id,
      });
    } catch {
      // Audit failure must never fail a public submission.
    }

    // Send founder email (never blocks success, never leaks details)
    try {
      await sendFounderEmail({
        name,
        email,
        phone,
        company,
        message,
        subject: "New Website Contact Lead",
      });
    } catch {
      // Email failure is logged in the service; submission still succeeds.
    }

    return res.status(201).json({
      success: true,
      message: "Contact submitted successfully",
      data: { id: contact._id },
    });
  } catch (error) {
    console.error("Contact submit error");

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
