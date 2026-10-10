/* Forgot-password UI logic: client-side validation and the mapping from
   backend response / error codes to user-facing copy.

   The backend is the source of truth for its messages; these
   fallbacks must stay in sync with Server RESET_MESSAGES so the page
   still reads correctly if a response body is ever missing. */

export const FORGOT_PASSWORD_MESSAGES = Object.freeze({
  invalidEmail: "Please enter a valid email address.",
  emailNotFound:
    "Email not found. Please enter your registered admin or employee email address.",
  emailSendFailed:
    "We couldn't send the reset email right now. Please try again in a moment.",
  rateLimited: "Too many attempts. Please try again in a few minutes.",
  serverError: "Something went wrong on our side. Please try again.",
  networkError:
    "Unable to reach the server. Check your connection and retry.",
});

/* Mirrors the server-side shape check (schema regex + validator). */
export function isValidEmailFormat(value) {
  if (typeof value !== "string") return false;
  const email = value.trim();
  if (!email || email.length > 254) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function normalizeEmail(value) {
  return typeof value === "string" ? value.trim() : "";
}

/* Maps an ApiError (status + code from the structured envelope) to the
   message the user should see. Never surfaces internal details. */
export function messageForForgotPasswordError(error) {
  if (!error) return FORGOT_PASSWORD_MESSAGES.serverError;

  const code = error.code;
  if (code === "EMAIL_NOT_FOUND") return FORGOT_PASSWORD_MESSAGES.emailNotFound;
  if (code === "INVALID_EMAIL") return FORGOT_PASSWORD_MESSAGES.invalidEmail;
  if (code === "EMAIL_SEND_FAILED") return FORGOT_PASSWORD_MESSAGES.emailSendFailed;
  if (code === "RATE_LIMITED") return FORGOT_PASSWORD_MESSAGES.rateLimited;
  if (code === "NETWORK_ERROR") return FORGOT_PASSWORD_MESSAGES.networkError;

  // Anything else is a server-side failure with a body we do not trust
  // to be user-safe; fall back to the generic copy.
  if (typeof error.status === "number" && error.status >= 500) {
    return FORGOT_PASSWORD_MESSAGES.serverError;
  }
  return FORGOT_PASSWORD_MESSAGES.serverError;
}
