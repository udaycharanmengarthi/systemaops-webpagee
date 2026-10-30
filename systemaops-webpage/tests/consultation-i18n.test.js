/* Localisation guard for the consultation page.
 *
 * Two real failure modes are covered:
 *
 *  1. LOCALE COMPLETENESS — a key present in EN but missing in NL/DE.
 *     The site would silently fall back to English for that language.
 *
 *  2. UNRESOLVED KEYS — the exact bug this suite was written for: the
 *     `consultation` namespace existed in translations-services.js but
 *     was never registered in LanguageContext.jsx, so t("consultation.x")
 *     resolved to undefined and the helper returned the raw key path.
 *
 * The locale module cannot be imported directly by node:test (its
 * imports are extensionless, which plain Node ESM rejects), so it is
 * bundled first with esbuild — an EXISTING devDependency of this
 * project, not a new one.
 */
import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { build } from "esbuild";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");

const LANGUAGES = ["en", "nl", "de"];
const DEFAULT_LANGUAGE = "en";

const ENTRY = path.join(
  root,
  "src/i18n/translations-services.js"
);
const CONTEXT = path.join(root, "src/i18n/LanguageContext.jsx");

/* Bundle once, import once. */
const loadShared = async () => {
  const outfile = path.join(
    fs.mkdtempSync(path.join(os.tmpdir(), "locales-")),
    "shared.mjs"
  );

  await build({
    entryPoints: [ENTRY],
    bundle: true,
    format: "esm",
    platform: "node",
    outfile,
    logLevel: "silent",
  });

  const mod = await import(pathToFileURL(outfile).href);
  return mod;
};

const { sharedContent, consultationMockCopy } = await loadShared();

/** Flatten a nested object into dot-paths. */
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

/**
 * The runtime tree the app sees in a DEVELOPMENT build: the shipping
 * consultation namespace plus the dev-only mock copy merged in.
 * Production merges only the former, which is asserted separately in
 * mock-journey-safety.test.js.
 */
const shared = Object.fromEntries(
  LANGUAGES.map((lang) => [
    lang,
    {
      ...sharedContent[lang],
      consultation: {
        ...sharedContent[lang].consultation,
        mock: consultationMockCopy[lang],
      },
    },
  ])
);

const consultationTree = (lang) => shared[lang]?.consultation || null;

/* The same resolver the app uses (LanguageContext.jsx resolvePath). */
const resolvePath = (source, keyPath) =>
  keyPath.split(".").reduce((value, key) => value?.[key], source);

/* Mirrors t(): current language -> default language -> raw key. */
const t = (lang, keyPath, replacements = {}) => {
  const resolved =
    resolvePath(shared[lang], keyPath) ??
    resolvePath(shared[DEFAULT_LANGUAGE], keyPath);

  if (resolved === undefined) return keyPath; // unresolved -> raw key
  if (typeof resolved !== "string") return resolved;

  return Object.entries(replacements).reduce(
    (text, [k, v]) => text.replaceAll(`{${k}}`, v),
    resolved
  );
};

/* Keys the page can request. Collected from the component sources so a
   new t("consultation...") call is covered automatically. */
const SOURCE_DIR = path.join(root, "src/pages/BookACall");
const readSourceFiles = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return readSourceFiles(full);
    return /\.(jsx|js)$/.test(entry.name) ? [full] : [];
  });

const sourceFiles = readSourceFiles(SOURCE_DIR);

const collectStaticKeys = () => {
  const keys = new Set();

  for (const file of sourceFiles) {
    const source = fs.readFileSync(file, "utf8");

    /* t("consultation....") and t('consultation....') */
    for (const match of source.matchAll(
      /\bt\(\s*["'`](consultation\.[A-Za-z0-9_.]+)["'`]/g
    )) {
      keys.add(match[1]);
    }

    /* Template keys with a literal prefix, e.g.
       t(`consultation.offer.mode.${offer.mode}`)  */
    for (const match of source.matchAll(
      /\bt\(\s*["'`](consultation\.[A-Za-z0-9_.]*?)\$\{/g
    )) {
      keys.add(`${match[1]}*`);
    }
  }

  return [...keys];
};

const staticKeys = collectStaticKeys();

/* ══════════════════════════════════════════════════════════════════ */

test("the consultation namespace exists in every supported language", () => {
  for (const lang of LANGUAGES) {
    const tree = consultationTree(lang);
    assert.ok(
      tree && typeof tree === "object",
      `${lang} is missing the consultation namespace`
    );
  }
});

test("the namespace is registered in LanguageContext for every language", () => {
  /* The root-cause guard: data exists but is never merged, so t() returns
     the raw key path. The registration is now wrapped in withDevCopy(). */
  const source = fs.readFileSync(CONTEXT, "utf8");

  for (const lang of LANGUAGES) {
    assert.ok(
      source.includes(`sharedContent.${lang}.consultation`),
      `LanguageContext must register the consultation namespace for "${lang}"`
    );
  }

  /* The dev-only demo copy must be merged through the DEV gate. */
  assert.ok(
    source.includes("import.meta.env.DEV"),
    "the mock copy merge must be gated on import.meta.env.DEV"
  );
  for (const lang of LANGUAGES) {
    assert.ok(
      source.includes(`consultationMockCopy.${lang}`),
      `the mock copy for "${lang}" must be wired through withDevCopy`
    );
  }
});

test("every consultation key used by the page exists in EN", () => {
  assert.ok(
    staticKeys.length > 20,
    `expected the page to use many keys, found ${staticKeys.length}`
  );

  /* Keys are written as "consultation.x.y" and resolved against the FULL
     locale tree (which is what t() does), not the subtree. */
  const enFull = shared.en;
  const enFlat = Object.keys(flatten(shared.en));
  const missing = [];

  for (const key of staticKeys) {
    if (key.endsWith("*")) {
      const prefix = key.slice(0, -1);
      if (!enFlat.some((k) => k.startsWith(prefix))) {
        missing.push(`${prefix}*`);
      }
    } else if (resolvePath(enFull, key) === undefined) {
      missing.push(key);
    }
  }

  assert.deepEqual(missing, [], `missing EN keys: ${missing.join(", ")}`);
});

test("EN and NL have identical consultation key sets", () => {
  const en = Object.keys(flatten(consultationTree("en"))).sort();
  const nl = Object.keys(flatten(consultationTree("nl"))).sort();

  assert.deepEqual(
    en.filter((k) => !nl.includes(k)),
    [],
    "keys present in EN but missing in NL"
  );
  assert.deepEqual(
    nl.filter((k) => !en.includes(k)),
    [],
    "keys present in NL but not in EN"
  );
});

test("EN and DE have identical consultation key sets", () => {
  const en = Object.keys(flatten(consultationTree("en"))).sort();
  const de = Object.keys(flatten(consultationTree("de"))).sort();

  assert.deepEqual(
    en.filter((k) => !de.includes(k)),
    [],
    "keys present in EN but missing in DE"
  );
  assert.deepEqual(
    de.filter((k) => !en.includes(k)),
    [],
    "keys present in DE but not in EN"
  );
});

test("no translation value is empty (empty values render as blank copy)", () => {
  for (const lang of LANGUAGES) {
    const flat = flatten(consultationTree(lang));
    const empty = Object.entries(flat)
      .filter(([, value]) => typeof value === "string" && value.trim() === "")
      .map(([key]) => key);

    assert.deepEqual(empty, [], `${lang} has empty strings: ${empty.join(", ")}`);
  }
});

test("every static page key resolves to real copy in EVERY language", () => {
  /* The regression test for the raw-key bug. */
  for (const lang of LANGUAGES) {
    const flat = Object.keys(flatten(shared[lang]));

    for (const key of staticKeys) {
      if (key.endsWith("*")) {
        const prefix = key.slice(0, -1);
        assert.ok(
          flat.some((k) => k.startsWith(prefix)),
          `${lang}: template key ${key} has no matches`
        );
        continue;
      }

      const value = t(lang, key);

      assert.notEqual(
        value,
        key,
        `${lang}: "${key}" resolves to itself (unresolved key rendered raw)`
      );
      assert.ok(
        typeof value === "string" && value.trim().length > 0,
        `${lang}: "${key}" resolved to an empty/non-string value`
      );
    }
  }
});

test("no visible consultation value looks like an unresolved key", () => {
  /* Renders every leaf in every language and asserts nothing leaks a
     dotted key path to the visitor. */
  const keyLike = /^[a-z][a-zA-Z]*(\.[a-zA-Z][a-zA-Z0-9]*)+$/;

  for (const lang of LANGUAGES) {
    const flat = flatten(consultationTree(lang));
    const offenders = Object.entries(flat)
      .filter(
        ([, value]) =>
          typeof value === "string" && keyLike.test(value.trim())
      )
      .map(([key]) => key);

    assert.deepEqual(
      offenders,
      [],
      `${lang} exposes raw key paths: ${offenders.join(", ")}`
    );
  }
});

test("placeholder substitutions render in all languages", () => {
  /* {count} / {max} are used by the character counter and the error
     summary title. */
  const counter = staticKeys.includes("consultation.form.counter");

  for (const lang of LANGUAGES) {
    const value = t(lang, "consultation.form.counter", {
      count: 12,
      max: 1200,
    });
    assert.ok(!value.includes("{count}"), `${lang}: counter left {count}`);
    assert.ok(!value.includes("{max}"), `${lang}: counter left {max}`);
    assert.ok(value.includes("12"), `${lang}: counter did not interpolate`);

    const summary = t(lang, "consultation.form.errorSummaryTitle", {
      count: 2,
    });
    assert.ok(!summary.includes("{count}"), `${lang}: summary left {count}`);
  }

  assert.ok(counter, "the character counter key should be used by the page");
});

test("no consultation copy claims a confirmed payment or a booked call", () => {
  const banned = [
    "payment confirmed",
    "payment is confirmed",
    "successfully paid",
    "we have received your payment",
    "your call is booked",
    "your slot is confirmed",
    "we have booked your call",
  ];

  for (const lang of LANGUAGES) {
    const blob = JSON.stringify(consultationTree(lang)).toLowerCase();
    for (const phrase of banned) {
      assert.ok(
        !blob.includes(phrase),
        `${lang}: consultation copy must not claim "${phrase}"`
      );
    }
  }
});

test("no consultation copy hardcodes a price or currency", () => {
  /* Price/currency are owner decisions and live in configuration.
     Currency CODES need word-boundary matching: Dutch "gebeurt" contains
     the letters "eur", and that is not a currency. */
  const symbols = ["$", "€", "£", "₹"];
  const codePattern = /\b(usd|eur|inr|gbp|dollar|euro)\b/i;

  for (const lang of LANGUAGES) {
    const flat = flatten(consultationTree(lang));

    for (const [key, value] of Object.entries(flat)) {
      if (typeof value !== "string") continue;

      for (const symbol of symbols) {
        assert.ok(
          !value.includes(symbol),
          `${lang}: "${key}" mentions "${symbol}" — price/currency must come from config`
        );
      }

      assert.ok(
        !codePattern.test(value),
        `${lang}: "${key}" mentions a currency code — price/currency must come from config`
      );
      assert.ok(
        !/\bper hour\b|\/hr\b|\bstunde\b/i.test(value),
        `${lang}: "${key}" states a rate — price must come from config`
      );
    }
  }
});

test("the dev-only mock copy is clearly labelled as a demo", () => {
  for (const lang of LANGUAGES) {
    const banner = t(lang, "consultation.mock.banner");
    assert.ok(banner && banner.trim().length > 0, `${lang}: mock banner missing`);
    assert.ok(
      /demo|demo|entwicklungsdemo|ontwikkel/i.test(banner),
      `${lang}: mock banner must say it is a demo (got "${banner}")`
    );
  }
});
