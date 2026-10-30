/* Local Docker entrypoint guard.
 *
 * The frontend image is a static SPA (`serve -s`) and cannot proxy /api.
 * When it was published directly on :3000, every API request returned the
 * SPA index.html and the consultation form showed a generic server error.
 *
 * The local-only override must make :3000 the bundled proxy (which routes
 * /api to the backend), while the static preview moves to :3002.
 */
import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "..", "..");
const override = fs.readFileSync(
  path.join(repoRoot, "docker-compose.override.yml"),
  "utf8"
);

test("local Docker :3000 is the API-capable proxy, not the static SPA", () => {
  assert.match(
    override,
    /proxy:\s*[\s\S]*?ports:\s*!override[\s\S]*?"3000:80"/,
    "the proxy (which routes /api) must own :3000 locally"
  );
  assert.match(
    override,
    /frontend:\s*[\s\S]*?ports:\s*!override[\s\S]*?"3002:3000"/,
    "the static frontend preview must not occupy :3000"
  );
});

test("local Docker has a working Stripe return-origin default", () => {
  assert.match(
    override,
    /FRONTEND_URL:\s*\$\{FRONTEND_URL:-http:\/\/localhost:3000\}/,
    "FRONTEND_URL must default to the local proxy origin when unset"
  );
});
