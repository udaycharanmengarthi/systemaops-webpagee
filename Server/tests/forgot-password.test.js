/* Forgot-password / reset-password end-to-end suite.
 *
 * Boots the REAL Express app in-process against the compose MongoDB and
 * points the REAL mail service at a local fake Resend endpoint
 * (RESEND_BASE_URL), so the success and provider-failure paths are
 * genuinely exercised with no network access and no secrets.
 *
 * Run inside the backend container (see support/testServer.js).
 */
import assert from "node:assert/strict";
import test from "node:test";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";

import { startFakeProvider } from "./support/fakeResend.js";
import { post, startTestServer, testEmail } from "./support/testServer.js";
import AdminUser from "../src/models/AdminUser.js";

/* Shared handle: test.before() resolves to void in this Node version,
   so the started server is published to a module-level slot. */
const ctx = { api: null, created: [] };

test.before(async () => {
  ctx.api = await startTestServer();
});

/* Warm-up accounts created by this run — removed on exit. */
async function seedUser({ tag, role = "SUPER_ADMIN", status = "active" }) {
  const email = testEmail(tag);
  const passwordHash = await bcrypt.hash("qa-password-1234", 4);
  const doc = await AdminUser.create({
    email,
    name: `QA ${tag}`,
    role,
    status,
    passwordHash,
  });
  ctx.created.push(doc._id);
  return doc;
}

/* Single teardown: clean up FIRST (while the connection is alive),
   then stop the server and disconnect. */
test.after(async () => {
  try {
    if (ctx.created.length > 0) {
      const result = await AdminUser.deleteMany({ _id: { $in: ctx.created } });
      ctx.created = [];
      console.log(`[tests] removed ${result.deletedCount} test account(s)`);
    }
  } catch (error) {
    console.error(`[tests] cleanup failed: ${error.message}`);
  }
  if (ctx.api) await ctx.api.stop();
});

/* Directly plant a reset token the way the controller does, so the
   reset endpoint can be tested without an email round-trip. */
async function plantToken(user, { ttlMs = 30 * 60 * 1000 } = {}) {
  const raw = crypto.randomBytes(32).toString("hex");
  await AdminUser.updateOne(
    { _id: user._id },
    {
      $set: {
        resetTokenHash: crypto.createHash("sha256").update(raw).digest("hex"),
        resetTokenExpiresAt: new Date(Date.now() + ttlMs),
      },
    }
  );
  return raw;
}

/* Mail provider fixture: swaps the three env vars the real mail service
   reads, and restores them afterwards. */
async function withMailProvider(provider, fn) {
  const saved = {
    key: process.env.RESEND_API_KEY,
    sender: process.env.SENDER_EMAIL,
    base: process.env.RESEND_BASE_URL,
  };
  process.env.RESEND_API_KEY = "qa-fake-key";
  process.env.SENDER_EMAIL = "onboarding@systemaops.test";
  process.env.RESEND_BASE_URL = provider.baseUrl;
  try {
    return await fn(provider);
  } finally {
    await provider.close();
    process.env.RESEND_API_KEY = saved.key;
    process.env.SENDER_EMAIL = saved.sender;
    process.env.RESEND_BASE_URL = saved.base;
  }
}

test("VERIFY: the real mail service delivers through RESEND_BASE_URL", async () => {
  const provider = await startFakeProvider();
  await withMailProvider(provider, async (provider) => {
    const { sendAdminEmail } = await import("../src/services/mail.service.js");
    const result = await sendAdminEmail({
      to: "qa@systemaops.test",
      subject: "probe",
      html: "<p>probe</p>",
    });
    assert.equal(result.sent, true);
    assert.equal(provider.received.length, 1);
  });
});

test("1. registered eligible ADMIN gets a token, an email, and a working reset", async () => {
  await withMailProvider(await startFakeProvider(), async (provider) => {
    const admin = await seedUser({ tag: "admin" });
    const res = await post(ctx.api.baseUrl, "/api/admin/auth/forgot-password", {
      email: admin.email,
    });

    assert.equal(res.status, 200, JSON.stringify(res.payload));
    assert.equal(res.payload.success, true);
    assert.match(res.payload.data.message, /Reset instructions sent/i);

    const stored = await AdminUser.findById(admin._id).select(
      "+resetTokenHash resetTokenExpiresAt"
    );
    assert.equal(
      stored.resetTokenHash.length,
      64,
      "token is stored as a 64-char SHA-256 hash"
    );
    assert.ok(stored.resetTokenExpiresAt.getTime() > Date.now());

    /* Exactly one email, carrying the RAW token that hashes to what the
       database holds. */
    assert.equal(provider.received.length, 1, "exactly one email delivered");
    const mail = provider.received[0].body;
    assert.equal(mail.to, admin.email);
    const link = /token=([A-Fa-f0-9]{64})/.exec(String(mail.text || mail.html));
    assert.ok(link, "reset link carries a raw token");
    const rawFromLink = link[1];
    assert.notEqual(rawFromLink, stored.resetTokenHash);
    assert.equal(
      crypto.createHash("sha256").update(rawFromLink).digest("hex"),
      stored.resetTokenHash,
      "the emailed raw token hashes to the stored hash"
    );

    /* 12. the full journey: reset, consume, invalidate sessions */
    const reset = await post(ctx.api.baseUrl, "/api/admin/auth/reset-password", {
      email: admin.email,
      token: rawFromLink,
      password: "qa-new-password-123",
    });
    assert.equal(reset.status, 200, JSON.stringify(reset.payload));

    const after = await AdminUser.findById(admin._id).select(
      "+resetTokenHash tokenVersion"
    );
    assert.equal(after.resetTokenHash, "", "token consumed");
    assert.ok(!after.resetTokenExpiresAt, "expiry cleared with the token");
    assert.ok(
      after.tokenVersion >= admin.tokenVersion + 1,
      "existing sessions invalidated"
    );

    /* 10. replaying the consumed token is rejected */
    const reuse = await post(ctx.api.baseUrl, "/api/admin/auth/reset-password", {
      email: admin.email,
      token: rawFromLink,
      password: "another-password-123",
    });
    assert.equal(reuse.status, 400);
    assert.equal(reuse.payload.error.code, "INVALID_RESET");

    /* The new password really is the active one. */
    const login = await post(ctx.api.baseUrl, "/api/admin/auth/login", {
      email: admin.email,
      password: "qa-new-password-123",
    });
    assert.equal(login.payload.success, true, "login with the new password");
  });
});

test("2. registered eligible EMPLOYEE (VIEWER) gets a token and email", async () => {
  await withMailProvider(await startFakeProvider(), async (provider) => {
    const employee = await seedUser({ tag: "employee", role: "VIEWER" });
    const res = await post(ctx.api.baseUrl, "/api/admin/auth/forgot-password", {
      email: employee.email,
    });
    assert.equal(res.status, 200, JSON.stringify(res.payload));
    assert.equal(provider.received.length, 1);
    assert.equal(provider.received[0].body.to, employee.email);
  });
});

test("3. email absent from the database gets NO token, NO email", async () => {
  await withMailProvider(await startFakeProvider(), async (provider) => {
    const unknown = testEmail("unknown");
    const res = await post(ctx.api.baseUrl, "/api/admin/auth/forgot-password", {
      email: unknown.toUpperCase(), // normalisation check
    });

    assert.equal(res.status, 404, JSON.stringify(res.payload));
    assert.equal(res.payload.success, false);
    assert.equal(res.payload.error.code, "EMAIL_NOT_FOUND");
    assert.equal(
      res.payload.error.message,
      "Email not found. Please enter your registered admin or employee email address."
    );
    assert.equal(provider.received.length, 0, "no email may be sent");

    const leaked = await AdminUser.findOne({
      email: unknown.toLowerCase(),
    }).select("_id");
    assert.equal(leaked, null, "no account may be created");
  });
});

test("4. suspended account is ineligible: NO token, NO email", async () => {
  await withMailProvider(await startFakeProvider(), async (provider) => {
    const suspended = await seedUser({ tag: "suspended", status: "suspended" });
    const res = await post(ctx.api.baseUrl, "/api/admin/auth/forgot-password", {
      email: suspended.email,
    });
    assert.equal(res.status, 404);
    assert.equal(res.payload.error.code, "EMAIL_NOT_FOUND");
    assert.equal(provider.received.length, 0, "no email may be sent");

    const stored = await AdminUser.findById(suspended._id).select("+resetTokenHash");
    assert.equal(stored.resetTokenHash, "", "no token may be issued");
  });
});

test("5. invalid email format is rejected before any database work", async () => {
  await withMailProvider(await startFakeProvider(), async (provider) => {
    for (const bad of ["not-an-email", "", "a@b", "   ", "x@y.", "a b@c.com"]) {
      const res = await post(ctx.api.baseUrl, "/api/admin/auth/forgot-password", {
        email: bad,
      });
      assert.equal(res.status, 400, `expected 400 for ${JSON.stringify(bad)}`);
      assert.equal(res.payload.error.code, "INVALID_EMAIL");
      assert.equal(res.payload.error.message, "Please enter a valid email address.");
    }
    assert.equal(provider.received.length, 0, "no email may be sent");
  });
});

test("6. email provider failure does NOT claim an email was sent", async () => {
  const provider = await startFakeProvider({ status: 500 });
  await withMailProvider(provider, async (provider) => {
    const admin = await seedUser({ tag: "mailfail" });
    const res = await post(ctx.api.baseUrl, "/api/admin/auth/forgot-password", {
      email: admin.email,
    });

    assert.equal(res.status, 503, JSON.stringify(res.payload));
    assert.equal(res.payload.error.code, "EMAIL_SEND_FAILED");
    assert.equal(
      res.payload.error.message,
      "We couldn't send the reset email right now. Please try again in a moment."
    );
    assert.equal(provider.received.length, 1, "delivery was attempted once");

    /* The orphan token must not be left behind. */
    const stored = await AdminUser.findById(admin._id).select("+resetTokenHash");
    assert.equal(stored.resetTokenHash, "", "failed delivery rolls the token back");
  });
});

test("6b. unconfigured email service is also reported as a failure", async () => {
  const admin = await seedUser({ tag: "mailunconf" });
  const res = await post(ctx.api.baseUrl, "/api/admin/auth/forgot-password", {
    email: admin.email,
  });
  assert.equal(res.status, 503);
  assert.equal(res.payload.error.code, "EMAIL_SEND_FAILED");
  const stored = await AdminUser.findById(admin._id).select("+resetTokenHash");
  assert.equal(stored.resetTokenHash, "", "no orphan token");
});

test("7. database lookup failure returns a safe 500 without leaking internals", async () => {
  const original = AdminUser.findOne;
  /* Synchronous throw: it lands inside the controller's try/catch on the
     same tick, so no dangling rejected promise can surface as a late
     unhandledRejection during teardown. */
  AdminUser.findOne = () => {
    throw new Error("simulated mongo outage: connection lost");
  };
  try {
    const res = await post(ctx.api.baseUrl, "/api/admin/auth/forgot-password", {
      email: testEmail("dboffline"),
    });
    assert.equal(res.status, 500);
    assert.equal(res.payload.error.code, "SERVER_ERROR");
    assert.equal(res.payload.error.message, "Server error");
    assert.ok(
      !JSON.stringify(res.payload).includes("simulated mongo outage"),
      "no internal detail leaks"
    );
  } finally {
    AdminUser.findOne = original;
  }
});

test("8. route is rate limited with a structured response", async () => {
  const email = testEmail("ratelimit");
  let res = null;
  for (let i = 0; i < 6; i += 1) {
    res = await post(
      ctx.api.baseUrl,
      "/api/admin/auth/forgot-password",
      { email },
      { "X-Forwarded-For": "198.51.100.7" }
    );
  }
  assert.equal(res.status, 429, "6th request within the window must be limited");
  assert.equal(res.payload.error.code, "RATE_LIMITED");
});

test("9. expired reset token is rejected", async () => {
  const user = await seedUser({ tag: "expired" });
  const raw = await plantToken(user, { ttlMs: -1000 });
  const res = await post(ctx.api.baseUrl, "/api/admin/auth/reset-password", {
    email: user.email,
    token: raw,
    password: "qa-new-password-123",
  });
  assert.equal(res.status, 400);
  assert.equal(res.payload.error.code, "INVALID_RESET");
});

test("10b. concurrent submissions of the same token: exactly one wins", async () => {
  const user = await seedUser({ tag: "concurrent" });
  const raw = await plantToken(user);

  const [a, b] = await Promise.all([
    post(ctx.api.baseUrl, "/api/admin/auth/reset-password", {
      email: user.email,
      token: raw,
      password: "qa-new-password-123",
    }),
    post(ctx.api.baseUrl, "/api/admin/auth/reset-password", {
      email: user.email,
      token: raw,
      password: "qa-new-password-123",
    }),
  ]);
  assert.deepEqual(
    [a.status, b.status].sort(),
    [200, 400],
    `expected one success and one reject, got ${a.status}/${b.status}`
  );
});

test("11. reset keeps the password policy and bcrypt hashing", async () => {
  const user = await seedUser({ tag: "policy" });
  const raw = await plantToken(user);

  const short = await post(ctx.api.baseUrl, "/api/admin/auth/reset-password", {
    email: user.email,
    token: raw,
    password: "short",
  });
  assert.equal(short.status, 400);
  assert.equal(short.payload.error.code, "INVALID_PASSWORD");
  assert.equal(short.payload.error.message, "Password must be 12-128 characters");

  const tooLong = await post(ctx.api.baseUrl, "/api/admin/auth/reset-password", {
    email: user.email,
    token: raw,
    password: "x".repeat(129),
  });
  assert.equal(tooLong.status, 400);
  assert.equal(tooLong.payload.error.code, "INVALID_PASSWORD");

  const ok = await post(ctx.api.baseUrl, "/api/admin/auth/reset-password", {
    email: user.email,
    token: raw,
    password: "qa-new-password-123",
  });
  assert.equal(ok.status, 200);

  const stored = await AdminUser.findById(user._id).select("+passwordHash");
  assert.ok(stored.passwordHash.startsWith("$2"), "stored value is a bcrypt hash");
  assert.notEqual(stored.passwordHash, "qa-new-password-123");
  assert.equal(await bcrypt.compare("qa-new-password-123", stored.passwordHash), true);
});
