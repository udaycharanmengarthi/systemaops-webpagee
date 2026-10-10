/* Forgot-password UI logic tests (pure module, no DOM required).
   Run with: npm test   (node:test ships with Node 20/24) */
import assert from "node:assert/strict";
import test from "node:test";

import {
  FORGOT_PASSWORD_MESSAGES as MSG,
  isValidEmailFormat,
  messageForForgotPasswordError,
  normalizeEmail,
} from "../src/utils/forgotPassword.js";

test("frontend copy matches the backend contract", () => {
  assert.equal(MSG.emailNotFound, "Email not found. Please enter your registered admin or employee email address.");
  assert.equal(MSG.invalidEmail, "Please enter a valid email address.");
  assert.equal(
    MSG.emailSendFailed,
    "We couldn't send the reset email right now. Please try again in a moment."
  );
});

test("isValidEmailFormat gates submission client-side", () => {
  assert.equal(isValidEmailFormat("admin@systemaops.com"), true);
  assert.equal(isValidEmailFormat("  admin@systemaops.com  "), true);
  assert.equal(isValidEmailFormat("not-an-email"), false);
  assert.equal(isValidEmailFormat(""), false);
  assert.equal(isValidEmailFormat(null), false);
  assert.equal(isValidEmailFormat(`${"a".repeat(250)}@systemaops.com`), false);
});

test("normalizeEmail only trims", () => {
  assert.equal(normalizeEmail("  a@b.com "), "a@b.com");
  assert.equal(normalizeEmail(undefined), "");
});

test("an unknown email is reported as not-found, never as success", () => {
  const message = messageForForgotPasswordError({
    status: 404,
    code: "EMAIL_NOT_FOUND",
  });
  assert.equal(message, MSG.emailNotFound);
});

test("an invalid format is reported as a validation error", () => {
  assert.equal(
    messageForForgotPasswordError({ status: 400, code: "INVALID_EMAIL" }),
    MSG.invalidEmail
  );
});

test("a delivery failure shows a retryable error", () => {
  assert.equal(
    messageForForgotPasswordError({ status: 503, code: "EMAIL_SEND_FAILED" }),
    MSG.emailSendFailed
  );
});

test("rate limiting and network failures get their own copy", () => {
  assert.equal(
    messageForForgotPasswordError({ status: 429, code: "RATE_LIMITED" }),
    MSG.rateLimited
  );
  assert.equal(
    messageForForgotPasswordError({ status: 0, code: "NETWORK_ERROR" }),
    MSG.networkError
  );
});

test("server errors never leak internal detail", () => {
  const message = messageForForgotPasswordError({
    status: 500,
    code: "SERVER_ERROR",
  });
  assert.equal(message, MSG.serverError);
  assert.ok(!message.includes("Mongo") && !message.includes("stack"));
});

test("an ApiError with a non-whitelisted code still maps to safe copy", () => {
  assert.equal(
    messageForForgotPasswordError({ status: 400, code: "WEIRD_CODE", message: "internal detail" }),
    MSG.serverError
  );
  assert.equal(messageForForgotPasswordError(undefined), MSG.serverError);
});
