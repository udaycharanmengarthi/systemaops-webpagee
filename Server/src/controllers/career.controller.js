// src/controllers/career.controller.js
import validator from "validator";
import CareerApplication from "../models/CareerApplication.js";
import { sendFounderEmail } from "../services/mail.service.js";

const PRIVACY_VERSION = "2026-01-01";
const MAX_RESUME_URL_BYTES = 2000;

function sanitizeString(value, max = 2000) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function isAllowedUrl(value) {
  if (!value) return false;
  if (Buffer.byteLength(value, "utf8") > MAX_RESUME_URL_BYTES) return false;
  if (!validator.isURL(value, { require_protocol: true, protocols: ["http", "https"] })) return false;
  return true;
}

export const submitCareerApplication = async (req, res) => {
  try {
    let {
      firstName,
      lastName,
      email,
      phone,
      role,
      linkedin,
      portfolio,
      whyUs,
      resumeUrl,
      privacyAccepted,
      privacyVersion,
    } = req.body;

    firstName = sanitizeString(firstName, 80);
    lastName = sanitizeString(lastName, 80);
    email = sanitizeString(email, 254).toLowerCase();
    phone = sanitizeString(phone, 32);
    role = sanitizeString(role, 120);
    linkedin = sanitizeString(linkedin, 500);
    portfolio = sanitizeString(portfolio, 500);
    whyUs = sanitizeString(whyUs, 2000);
    resumeUrl = sanitizeString(resumeUrl, 1000);

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !role || !linkedin || !resumeUrl) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing (firstName, lastName, email, phone, role, linkedin, resumeUrl)",
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

    const digitsOnly = phone.replace(/\D/g, "");
    if (digitsOnly.length < 7 || digitsOnly.length > 15) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid phone number",
      });
    }

    if (!isAllowedUrl(linkedin) || !isAllowedUrl(resumeUrl)) {
      return res.status(400).json({
        success: false,
        message: "LinkedIn and resume must be valid https URLs",
      });
    }

    if (portfolio && !isAllowedUrl(portfolio)) {
      return res.status(400).json({
        success: false,
        message: "Portfolio must be a valid https URL",
      });
    }

    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);

    // Save to MongoDB
    const application = await CareerApplication.create({
      firstName,
      lastName,
      email,
      phone,
      role,
      linkedin,
      portfolio: portfolio || "",
      whyUs: whyUs || "",
      resumeUrl,
      privacyAccepted: true,
      privacyVersion: typeof privacyVersion === "string" ? privacyVersion.slice(0, 32) : PRIVACY_VERSION,
      privacyAcceptedAt: new Date(),
      expiresAt,
    });

    // Notify founder via email (escaped, never blocks success)
    try {
      await sendFounderEmail({
        subject: `New Career Application - ${escapeHtml(role).slice(0, 120)}`,
        html: `
          <h2>New Career Application</h2>
          <p><strong>Name:</strong> ${escapeHtml(firstName)} ${escapeHtml(lastName)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
          <p><strong>Role:</strong> ${escapeHtml(role)}</p>
          <p><strong>LinkedIn:</strong> ${escapeHtml(linkedin)}</p>
          <p><strong>Portfolio:</strong> ${escapeHtml(portfolio || "Not provided")}</p>
          <p><strong>Resume:</strong> ${escapeHtml(resumeUrl)}</p>
          <p><strong>Why SystemaOps?</strong></p>
          <p>${escapeHtml(whyUs || "No message provided")}</p>
        `,
      });
    } catch {
      // Email failure is logged in the service; submission still succeeds.
    }

    return res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      data: { id: application._id },
    });

  } catch (error) {
    console.error("Career Application Error");
    return res.status(500).json({
      success: false,
      message: "Failed to submit application",
    });
  }
};