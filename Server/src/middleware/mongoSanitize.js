/* Server/src/middleware/mongoSanitize.js
 *
 * Express 5-compatible MongoDB operator-injection sanitizer.
 *
 * Why this exists instead of `express-mongo-sanitize@2.2.0`:
 * that version reassigns `req.query`, which is getter-only in
 * Express 5, so `app.use(mongoSanitize())` threw a TypeError on
 * EVERY request (HTTP 500 across the whole API).
 *
 * Coverage:
 * - req.body   -> replaced with a sanitized clone (safe: body
 *                 parsing already assigns req.body in Express 5).
 * - req.params -> sanitized in place (never reassigned).
 * - req.query  -> intentionally NOT reassigned (Express 5 makes
 *                 it getter-only, and re-parses it per access, so
 *                 middleware reassignment cannot work). No route in
 *                 this API reads req.query; all input comes from
 *                 req.body, which is fully covered.
 *
 * Policy: keys starting with `$`, keys containing `.`, and
 * prototype-pollution keys (`__proto__`, `constructor`,
 * `prototype`) are dropped. Values are never inspected, so
 * legitimate data (e.g. emails containing dots) passes through
 * untouched. Dropping (rather than renaming) is safe here
 * because downstream validation rejects payloads that lose a
 * required field with HTTP 400.
 */

const OPERATOR_KEY = /^\$/;

function isPlainObject(value) {
  if (value === null || typeof value !== "object") return false;
  if (Array.isArray(value)) return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

function sanitizeValue(value) {
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }
  if (!isPlainObject(value)) {
    return value;
  }
  const clean = {};
  for (const key of Object.keys(value)) {
    if (key === "__proto__" || key === "constructor" || key === "prototype") {
      continue;
    }
    if (OPERATOR_KEY.test(key) || key.includes(".")) {
      continue;
    }
    clean[key] = sanitizeValue(value[key]);
  }
  return clean;
}

function sanitizeInPlace(obj) {
  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i += 1) {
      obj[i] = sanitizeValue(obj[i]);
    }
    return;
  }
  if (!isPlainObject(obj)) return;
  for (const key of Object.keys(obj)) {
    if (
      key === "__proto__" ||
      key === "constructor" ||
      key === "prototype" ||
      OPERATOR_KEY.test(key) ||
      key.includes(".")
    ) {
      delete obj[key];
    } else {
      obj[key] = sanitizeValue(obj[key]);
    }
  }
}

export function mongoSanitizeBody(req, _res, next) {
  try {
    if (req.body !== undefined && req.body !== null) {
      req.body = sanitizeValue(req.body);
    }
    if (req.params !== undefined && req.params !== null) {
      sanitizeInPlace(req.params);
    }
  } catch {
    // Sanitizer must never take the API down: if the payload
    // shape is unexpected, leave it untouched and let the
    // downstream validators reject it with HTTP 400.
  }
  next();
}

export default mongoSanitizeBody;
