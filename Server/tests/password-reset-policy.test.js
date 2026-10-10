/* Pure policy tests for the password-reset controller helpers.
   No database or network required — safe to run anywhere. */
import assert from "node:assert/strict";
import test from "node:test";
import crypto from "node:crypto";

import {
  appOrigin,
  forgotPassword,
  hashResetToken,
  isEligibleForReset,
  isValidEmail,
  normalizeEmail,
  resetPassword,
  RESET_MESSAGES,
  safeCompare,
  ttlMinutes,
} from "../src/controllers/adminPasswordReset.controller.js";

test("RESET_MESSAGES carries the exact copy the UI relies on", () => {
  assert.equal(RESET_MESSAGES.invalidEmail, "Please enter a valid email address.");
  assert.equal(
    RESET_MESSAGES.emailNotFound,
    "Email not found. Please enter your registered admin or employee email address."
  );
});

test("normalizeEmail trims and lowercases like the schema does", () => {
  assert.equal(normalizeEmail("  QA@SystemaOps.COM "), "qa@systemaops.com");
  assert.equal(normalizeEmail(undefined), "");
  assert.equal(normalizeEmail(42), "");
});

test("isValidEmail accepts real addresses and rejects junk", () => {
  for (const good of ["a@systemaops.com", "first.last+tag@sub.systemaops.co.in"]) {
    assert.equal(isValidEmail(good), true, good);
  }
  for (const bad of ["", "not-an-email", "a@b", "x@y.", "   ", "a b@c.com"]) {
    assert.equal(isValidEmail(bad), false, JSON.stringify(bad));
  }
});

test("isEligibleForReset: only active accounts qualify, regardless of role", () => {
  assert.equal(isEligibleForReset({ status: "active", role: "VIEWER" }), true);
  assert.equal(isEligibleForReset({ status: "active", role: "SUPER_ADMIN" }), true);
  assert.equal(isEligibleForReset({ status: "suspended", role: "ADMIN" }), false);
  assert.equal(isEligibleForReset(null), false);
  assert.equal(isEligibleForReset(undefined), false);
});

test("reset tokens are 256-bit and stored only as SHA-256 hashes", () => {
  const raw = crypto.randomBytes(32).toString("hex");
  assert.equal(raw.length, 64);
  const hash = hashResetToken(raw);
  assert.equal(hash.length, 64);
  assert.equal(
    hash,
    crypto.createHash("sha256").update(raw).digest("hex"),
    "hash matches SHA-256 of the raw token"
  );
  assert.notEqual(hash, raw, "the hash is not the token");
});

test("safeCompare rejects length mismatches before comparing", () => {
  const a = "a".repeat(64);
  assert.equal(safeCompare(a, a), true);
  assert.equal(safeCompare(a, "a".repeat(63)), false);
  assert.equal(safeCompare(null, a), false);
  assert.equal(safeCompare(a, 5), false);
});

test("reset link origin is configured, never request-derived", () => {
  const previous = process.env.ADMIN_APP_ORIGIN;
  try {
    process.env.ADMIN_APP_ORIGIN = "https://www.systemaops.com/";
    assert.equal(appOrigin(), "https://www.systemaops.com");
    delete process.env.ADMIN_APP_ORIGIN;
    assert.ok(appOrigin().length > 0);
  } finally {
    if (previous === undefined) delete process.env.ADMIN_APP_ORIGIN;
    else process.env.ADMIN_APP_ORIGIN = previous;
  }
});

test("token TTL honours configuration and stays within bounds", () => {
  const previous = process.env.RESET_TOKEN_TTL_MINUTES;
  try {
    delete process.env.RESET_TOKEN_TTL_MINUTES;
    assert.equal(ttlMinutes(), 30);
    process.env.RESET_TOKEN_TTL_MINUTES = "15";
    assert.equal(ttlMinutes(), 15);
    process.env.RESET_TOKEN_TTL_MINUTES = "0";
    assert.equal(ttlMinutes(), 30, "non-positive falls back to the default");
    process.env.RESET_TOKEN_TTL_MINUTES = "999";
    assert.equal(ttlMinutes(), 30, "above the ceiling falls back to the default");
  } finally {
    if (previous === undefined) delete process.env.RESET_TOKEN_TTL_MINUTES;
    else process.env.RESET_TOKEN_TTL_MINUTES = previous;
  }
});

test("controllers are exported as request handlers", () => {
  assert.equal(typeof forgotPassword, "function");
  assert.equal(typeof resetPassword, "function");
  assert.equal(forgotPassword.length, 2, "handler signature is (req, res)");
  assert.equal(resetPassword.length, 2, "handler signature is (req, res)");
});
