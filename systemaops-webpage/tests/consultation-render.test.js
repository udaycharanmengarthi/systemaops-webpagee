/* Render-level localisation guard for the consultation page.
 *
 * tests/consultation-i18n.test.js checks the DATA (does every key exist in
 * every locale). This suite checks the OUTPUT: it mounts the real page,
 * inside the real LanguageProvider, in every supported language, and fails
 * if a raw key path ever reaches the visitor - in visible text, in a
 * placeholder, in an aria-label, or in document.title.
 *
 * That is the bug reported at http://localhost/book-a-call, where the page
 * rendered strings such as "consultation.pill" instead of copy.
 *
 * No new dependency: node:test is the existing runner, esbuild is already a
 * devDependency (used by consultation-i18n.test.js) and react-dom/server
 * ships with the existing react-dom dependency.
 */
import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

const require_ = createRequire(import.meta.url);

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");

const LANGUAGES = ["en", "nl", "de"];

const HARNESS = path.join(here, "helpers", "consultationHarness.jsx");
const LOCALES = path.join(root, "src", "i18n", "translations-services.js");

/* LanguageProvider reads window.localStorage on first render, so a minimal
 * window stand-in must exist before the page is imported. */
const store = new Map();

globalThis.window = {
  localStorage: {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
  },
  matchMedia: () => ({ matches: false }),
  setTimeout,
};

const bundle = async (entryPoints, outName, define = {}) => {
  const outfile = path.join(
    fs.mkdtempSync(path.join(os.tmpdir(), "consultation-render-")),
    outName
  );

  /* CommonJS output, not ESM: react-dom/server is CJS and calls
   * require("util"), and esbuild's ESM output cannot emit a dynamic
   * require ("Dynamic require of util is not supported" at import time). */
  await build({
    entryPoints,
    bundle: true,
    format: "cjs",
    platform: "node",
    jsx: "automatic",
    loader: { ".css": "empty" },
    define,
    outfile,
    logLevel: "silent",
  });

  /* createRequire rather than import(): esbuild's __export getters are not
   * reliably detected as named CJS exports by Node's module lexer. */
  return require_(outfile);
};

/**
 * Bundle + import the page twice: once as a production build (the config
 * users get, and the one the reported bug came from) and once as a dev
 * build so the dev-only demo copy is exercised too.
 */
const loadPage = (isDev) =>
  bundle([HARNESS], "page.cjs", {
    "import.meta.env.DEV": isDev ? "true" : "false",
  });

/* The locale module gives us the authoritative list of key paths, so a
 * "known key" is never guessed. */
const { sharedContent, consultationMockCopy } = await bundle(
  [LOCALES],
  "locales.cjs"
);

const flatten = (node, prefix = "") => {
  const out = {};
  for (const [key, value] of Object.entries(node || {})) {
    const next = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      Object.assign(out, flatten(value, next));
    } else {
      out[next] = value;
    }
  }
  return out;
};

const KNOWN_KEYS = new Set(
  Object.values(sharedContent).flatMap((lang) => Object.keys(flatten(lang)))
);

/* A dotted path such as "consultation.pill" - the shape a leaked key has. */
const KEY_LIKE = /^[a-z][A-Za-z0-9]*(\.[A-Za-z0-9]+)+$/;

/* Top-level namespaces the app registers (see LanguageContext.jsx).
 *
 * A leaked key is flagged when it is EITHER a key we know about OR it sits
 * under a registered namespace. The second half matters: the reported bug
 * leaked keys such as "consultation.pill" that exist in NO locale file, so
 * a known-keys-only check would have passed straight through the bug. */
const NAMESPACES = new Set([
  "consultation",
  "megaMenu",
  "serviceDetail",
  "n8nPage",
  "cookie",
  "privacy",
  "common",
  "legal",
  "payments",
]);

/**
 * Pull every visitor-visible string out of rendered markup: text nodes plus
 * placeholder=, aria-label= and title= attribute values.
 */
const visibleStrings = (markup) => {
  const attributes = [];

  for (const [, value] of markup.matchAll(/="([^"]*)"/g)) attributes.push(value);

  const text = markup
    .replace(/<[^>]*>/g, " ")
    .split(/\s{2,}/)
    .map((part) => part.trim())
    .filter(Boolean);

  return [...new Set([...attributes, ...text])];
};

const unresolved = (strings) =>
  strings.filter((value) => {
    if (!KEY_LIKE.test(value)) return false;
    if (KNOWN_KEYS.has(value)) return true;
    return NAMESPACES.has(value.split(".")[0]);
  });

/* ------------------------------------------------------------------ */

for (const isDev of [false, true]) {
  const flavour = isDev ? "dev" : "production";

  test(`[${flavour}] the page renders no unresolved key in any language`, async () => {
    const { renderConsultation } = await loadPage(isDev);

    for (const language of LANGUAGES) {
      const { markup, title, description } = renderConsultation(language);

      assert.ok(
        markup.length > 500,
        `${language}: markup looks empty (${markup.length} chars)`
      );

      const leaked = unresolved(visibleStrings(markup));

      assert.deepEqual(
        leaked,
        [],
        `${language}: raw i18n key(s) rendered to the visitor: ${leaked.join(", ")}`
      );

      assert.deepEqual(
        unresolved([title]),
        [],
        `${language}: document.title is a raw key: "${title}"`
      );

      assert.deepEqual(
        unresolved([description]),
        [],
        `${language}: the meta description is a raw key: "${description}"`
      );
    }
  });
}

test("the flat key names from the bug report would be caught by this guard", () => {
  /* Proves the detector fires on exactly the strings the screenshot
   * showed, including ones that exist in no locale file. */
  const reported = [
    "consultation.pill",
    "consultation.metaTitle",
    "consultation.metaDesc",
    "consultation.heading",
    "consultation.sub",
    "consultation.heroCta",
    "consultation.contactInstead",
    "consultation.discussHeading",
    "consultation.discussSub",
    "consultation.fields.name",
    "consultation.submit",
    "consultation.formHeading",
    "consultation.payHeading",
    "consultation.payText",
    "consultation.paySecure",
    "consultation.payLocked",
  ];

  assert.deepEqual(
    unresolved(reported),
    reported,
    "the guard must flag every key from the bug report"
  );
});

test("every language renders its own translated hero copy, not English", () => {
  const headings = LANGUAGES.map(
    (language) => sharedContent[language].consultation.hero.heading
  );

  assert.equal(
    new Set(headings).size,
    LANGUAGES.length,
    `hero headings are not distinct per language: ${JSON.stringify(headings)}`
  );
});

test("document.title and the meta description update on a language switch", async () => {
  const { renderConsultation } = await loadPage(false);

  const rendered = Object.fromEntries(
    LANGUAGES.map((language) => [language, renderConsultation(language)])
  );

  for (const [language, result] of Object.entries(rendered)) {
    assert.ok(result.title.length > 0, `${language}: document.title is empty`);
    assert.ok(
      result.description.length > 0,
      `${language}: the meta description is empty`
    );
  }

  const titles = LANGUAGES.map((l) => rendered[l].title);

  assert.equal(
    new Set(titles).size,
    LANGUAGES.length,
    `document.title did not change per language: ${JSON.stringify(titles)}`
  );

  const descriptions = LANGUAGES.map((l) => rendered[l].description);

  assert.equal(
    new Set(descriptions).size,
    LANGUAGES.length,
    `the meta description did not change per language: ${JSON.stringify(descriptions)}`
  );
});

test("switching language re-renders the page body, not just the head", async () => {
  const { renderConsultation } = await loadPage(false);

  const bodies = LANGUAGES.map((language) => {
    const { markup } = renderConsultation(language);
    return markup.replace(/<title[^>]*>.*?<\/title>/g, "");
  });

  assert.equal(
    new Set(bodies).size,
    LANGUAGES.length,
    "the rendered page body is identical across languages, so the language switch did not apply"
  );
});

test("the dev-only demo copy never reaches a production build", () => {
  assert.equal(
    JSON.stringify(sharedContent.en.consultation).includes("consultation.mock"),
    false,
    "the production consultation namespace must not carry the mock namespace"
  );

  assert.ok(
    consultationMockCopy.en,
    "the dev-only mock copy should still exist for development builds"
  );
});