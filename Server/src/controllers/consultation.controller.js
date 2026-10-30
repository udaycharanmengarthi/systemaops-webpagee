// src/controllers/consultation.controller.js
//
// Book-a-call enquiry (/book-a-call).
//
// Reuses the existing stack end to end: Consultation model (same
// retention/privacy conventions as Contact), the activity log, the admin
// notification and the founder email. No second contact system.
//
// This endpoint NEVER touches payment state. Payment is confirmed only by
// the signature-verified Stripe webhook.

import validator from "validator";
import Consultation from "../models/Consultation.js";
import { AREAS_OF_INTEREST } from "../config/workflow.js";
import { expiresAtFor } from "../utils/retention.js";
import { sendFounderEmail } from "../services/mail.service.js";
import {
  notifyAdmins,
  recordActivity,
} from "../services/activity.service.js";

const PRIVACY_VERSION = "2026-01-01";

function sanitizeString(value, max = 4000) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

export const submitConsultation = async (req, res) => {
  try {
    let {
      name,
      email,
      company,
      areaOfInterest,
      message,
      privacyAccepted,
      privacyVersion,
    } = req.body || {};

    name = sanitizeString(name, 120);
    email = sanitizeString(email, 254).toLowerCase();
    company = sanitizeString(company, 160);
    areaOfInterest = sanitizeString(areaOfInterest, 40);
    message = sanitizeString(message, 4000);

    if (!name || !email || !areaOfInterest || !message) {
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

    /* Unknown interest areas are rejected rather than silently stored,
       so the collection stays consistent with config/workflow.js. */
    if (!AREAS_OF_INTEREST.includes(areaOfInterest)) {
      return res.status(400).json({
        success: false,
        message: "Please choose an area of interest",
      });
    }

    if (privacyAccepted !== true) {
      return res.status(400).json({
        success: false,
        message: "Privacy acknowledgement is required",
      });
    }

    const submittedAt = new Date();

    const consultation = await Consultation.create({
      name,
      email,
      company,
      areaOfInterest,
      message,
      privacyAccepted: true,
      privacyVersion:
        typeof privacyVersion === "string"
          ? privacyVersion.slice(0, 32)
          : PRIVACY_VERSION,
      privacyAcceptedAt: submittedAt,
      createdAt: submittedAt,
      expiresAt: expiresAtFor(submittedAt),
    });

    /* Audit + admin notification (best-effort; never blocks success). */
    try {
      await recordActivity({
        req,
        action: "CONSULTATION_CREATED",
        entityType: "consultation",
        entityId: consultation._id,
        entityLabel: `${name} — ${company || email}`,
      });
      await notifyAdmins({
        type: "NEW_CONSULTATION",
        title: `New consultation enquiry: ${name}`,
        body: `${areaOfInterest} · ${company || email}`,
        entityType: "consultation",
        entityId: consultation._id,
      });
    } catch {
      // Audit failure must never fail a public submission.
    }

    /* Founder email (never blocks success, never leaks details). */
    try {
      await sendFounderEmail({
        name,
        email,
        phone: "",
        company,
        message: `Area of interest: ${areaOfInterest}\n\n${message}`,
        subject: "New Book-a-Call Consultation Enquiry",
      });
    } catch {
      // Email failure is logged in the service; submission still succeeds.
    }

    return res.status(201).json({
      success: true,
      message: "Consultation request submitted successfully",
      data: { id: consultation._id },
    });
  } catch {
    console.error("Consultation submit error");

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
