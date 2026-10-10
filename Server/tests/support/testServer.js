/* Test support: boots the real Express app in-process on an ephemeral
   port, against the real (compose) MongoDB, with a per-request fake
   client IP so the admin rate limiters stay isolated per test.

   NOTE: this repo's MongoDB has no published host port, so the suite is
   meant to run inside the backend container:

     docker compose run --rm -v "$(pwd)/Server/tests:/app/tests:ro" \
       backend node --test tests/

   (node:test ships with Node 20/24 — no dev dependencies required.) */
import mongoose from "mongoose";

/* Must be set BEFORE src/app.js is imported: trust proxy makes req.ip
   come from X-Forwarded-For, and express-rate-limit buckets per IP. */
process.env.TRUST_PROXY = "1";

let cachedApp = null;

async function loadApp() {
  if (!cachedApp) {
    cachedApp = (await import("../../src/app.js")).default;
  }
  return cachedApp;
}

export async function startTestServer() {
  if (!mongoose.connection.readyState) {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 8000,
    });
  }
  const app = await loadApp();
  const server = await new Promise((resolve) => {
    const s = app.listen(0, "127.0.0.1", () => resolve(s));
  });
  const { port } = server.address();
  return {
    baseUrl: `http://127.0.0.1:${port}`,
    async stop() {
      await new Promise((r) => server.close(r));
      await mongoose.disconnect();
    },
  };
}

let counter = 0;
export function clientHeaders() {
  counter += 1;
  /* 203.0.113.0/24 is TEST-NET-3: documentation range, never routed. */
  return { "X-Forwarded-For": `203.0.113.${(counter % 250) + 1}` };
}

export async function post(baseUrl, path, body, headers = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...clientHeaders(), ...headers },
    body: JSON.stringify(body),
  });
  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }
  return { status: response.status, payload };
}

/* Distinct, clearly-marked test accounts. Deleted by the caller. */
export function testEmail(tag) {
  return `pw-reset-qa-${tag}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@systemaops.test`;
}
