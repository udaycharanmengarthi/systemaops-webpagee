/* Test support: a fake Resend HTTP endpoint.
   The resend SDK honours RESEND_BASE_URL, so the REAL mail service can
   be exercised without any network access or secrets. */
import http from "node:http";

export function startFakeProvider({ status = 200 } = {}) {
  const received = [];
  const server = http.createServer((req, res) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      received.push({
        to: req.headers.authorization ? "bearer" : null,
        body: (() => {
          try {
            return JSON.parse(body || "{}");
          } catch {
            return {};
          }
        })(),
      });
      res.writeHead(status, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ id: "fake-email-id" }));
    });
  });
  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      resolve({
        baseUrl: `http://127.0.0.1:${port}`,
        received,
        close: () => new Promise((r) => server.close(r)),
      });
    });
  });
}
