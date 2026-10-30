/* Consultation API contract and failure classification.
 *
 * The observed failure was a POST to the static frontend preview on :3000.
 * `serve -s` answered with the SPA index.html (HTTP 200 text/html), the
 * service could not parse JSON, and the form correctly refused to show
 * success. These tests pin that behaviour and the real backend contract.
 */
import assert from "node:assert/strict";
import test from "node:test";

import {
  consultationService,
  ConsultationError,
} from "../src/pages/BookACall/consultation/consultationService.js";

const payload = {
  name: "Test User",
  email: "test@example.com",
  company: "",
  areaOfInterest: "ai-automation",
  message: "Consultation service contract test.",
  privacyAccepted: true,
};

const jsonResponse = (status, body) => ({
  status,
  ok: status >= 200 && status < 300,
  json: async () => body,
});

const withFetch = async (impl, fn) => {
  const original = globalThis.fetch;
  globalThis.fetch = impl;
  try {
    return await fn();
  } finally {
    globalThis.fetch = original;
  }
};

test("a 201 JSON response returns the server-generated consultation id", async () => {
  let calledUrl;
  let calledInit;

  const result = await withFetch(
    async (url, init) => {
      calledUrl = url;
      calledInit = init;
      return jsonResponse(201, {
        success: true,
        data: { id: "6ae0a1fc4b454240878ad362" },
      });
    },
    () => consultationService.submit(payload)
  );

  assert.equal(result.id, "6ae0a1fc4b454240878ad362");
  assert.equal(calledUrl, "/api/consultations");
  assert.equal(calledInit.method, "POST");
  assert.equal(calledInit.headers["Content-Type"], "application/json");
  assert.deepEqual(JSON.parse(calledInit.body), payload);
});

test("a static preview's HTML 200 is never treated as a successful submission", async () => {
  await assert.rejects(
    withFetch(
      async () => ({
        status: 200,
        ok: true,
        json: async () => {
          throw new SyntaxError("Unexpected token < in JSON");
        },
      }),
      () => consultationService.submit(payload)
    ),
    (error) => {
      assert.ok(error instanceof ConsultationError);
      assert.equal(error.reason, "server");
      return true;
    }
  );
});

test("HTTP failures keep their actionable reason", async () => {
  for (const [status, reason] of [
    [400, "invalid"],
    [429, "rateLimited"],
    [500, "server"],
    [503, "server"],
  ]) {
    await assert.rejects(
      withFetch(
        async () => jsonResponse(status, { success: false }),
        () => consultationService.submit(payload)
      ),
      (error) => {
        assert.ok(error instanceof ConsultationError);
        assert.equal(error.reason, reason);
        return true;
      },
      `status ${status} should map to ${reason}`
    );
  }
});

test("a transport failure is reported as a network error", async () => {
  await assert.rejects(
    withFetch(
      async () => {
        throw new TypeError("Failed to fetch");
      },
      () => consultationService.submit(payload)
    ),
    (error) => {
      assert.ok(error instanceof ConsultationError);
      assert.equal(error.reason, "network");
      return true;
    }
  );
});
