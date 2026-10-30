/* Guards the consultation form against HTTP 400 on submit.
 *
 * The bug: the form submitted the short service ids from
 * src/data/services.js ("integration") while the API only accepts the
 * slugs in Server/src/config/workflow.js AREAS_OF_INTEREST
 * ("system-integrations"), so every submission came back 400 and the
 * enquiry was silently lost.
 *
 * This suite asserts the mapping covers every selectable area and that the
 * payload the form builds is always a value the backend accepts. It
 * deliberately re-derives the backend list from the config file rather
 * than trusting a copy, so the two sides cannot drift apart unnoticed.
 */
import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  EMPTY_VALUES,
  toAreaSlug,
  toPayload,
  validateValues,
} from "../src/pages/BookACall/consultation/validation.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..", "..");

const SERVICES = path.join(root, "systemaops-webpage", "src", "data", "services.js");
const BACKEND_CONFIG = path.join(root, "Server", "src", "config", "workflow.js");

/** Every area the UI can submit: the service ids, plus "other". */
const selectableAreas = () => {
  const source = fs.readFileSync(SERVICES, "utf8");
  const ids = [...source.matchAll(/\bid:\s*"([a-z0-9-]+)"/g)].map((m) => m[1]);
  assert.ok(ids.length > 0, "could not read any service ids from services.js");
  return [...ids, "other"];
};

/** The slugs the API accepts, read from the backend config. */
const acceptedAreas = () => {
  const source = fs.readFileSync(BACKEND_CONFIG, "utf8");
  const block = source.slice(
    source.indexOf("AREAS_OF_INTEREST"),
    source.indexOf("]", source.indexOf("AREAS_OF_INTEREST"))
  );

  return [...block.matchAll(/"([a-z0-9-]+)"/g)].map((m) => m[1]);
};

const validForm = (area) => ({
  ...EMPTY_VALUES,
  name: "Test User",
  email: "test@example.com",
  message: "We would like to discuss automation.",
  privacyAccepted: true,
  areaOfInterest: area,
});

test("the backend config still exposes AREAS_OF_INTEREST", () => {
  assert.ok(
    acceptedAreas().length > 0,
    "AREAS_OF_INTEREST was not found in Server/src/config/workflow.js"
  );
});

test("every selectable area maps to a slug the API accepts", () => {
  const accepted = new Set(acceptedAreas());
  const rejected = [];

  for (const area of selectableAreas()) {
    const slug = toAreaSlug(area);

    /* "other" is an identity mapping and is accepted as-is, so the
     * substantive check is that the slug is on the backend's list. */
    if (!accepted.has(slug)) rejected.push(`${area} -> ${slug}`);
  }

  assert.deepEqual(
    rejected,
    [],
    `these areas map to slugs the backend does not accept: ${rejected.join(", ")}`
  );
});

test("the submitted payload uses an accepted slug, not the UI id", () => {
  const accepted = new Set(acceptedAreas());

  for (const area of selectableAreas()) {
    const payload = toPayload(validForm(area));

    assert.ok(
      accepted.has(payload.areaOfInterest),
      `"${area}" submits areaOfInterest="${payload.areaOfInterest}", which the API rejects with 400`
    );
  }
});

test("an unknown area is passed through rather than silently rewritten", () => {
  assert.equal(toAreaSlug("something-new"), "something-new");
});

test("an omitted optional area still produces an accepted API payload", () => {
  const values = {
    ...validForm("ai-automation"),
    areaOfInterest: "",
  };

  assert.deepEqual(validateValues(values, { areas: selectableAreas() }), {});
  assert.equal(toPayload(values).areaOfInterest, "other");
});

test("a complete form submits clean and keeps its other fields intact", () => {
  const area = selectableAreas()[0];
  const values = validForm(area);

  assert.deepEqual(
    validateValues(values, { areas: selectableAreas() }),
    {},
    "a complete form should not produce validation errors"
  );

  const payload = toPayload(values);

  assert.equal(payload.name, "Test User");
  assert.equal(payload.email, "test@example.com");
  assert.equal(payload.privacyAccepted, true);
  assert.equal(payload.areaOfInterest, toAreaSlug(area));
});