/* Responsive layout contracts.
 *
 * Guards two regressions:
 *
 *  1. NAVBAR. Between 769px and 1023px the bar used to keep every desktop
 *     control (logo + 5 links + language selector + theme toggle + two
 *     CTAs) in a single row and merely shrink it, which collided and
 *     clipped. Tablet must collapse to the existing drawer instead.
 *
 *  2. HERO DIAGRAM. It is decorative and animation-heavy (SMIL plus a CSS
 *     float per node). It must be MOUNTED only from the tablet breakpoint
 *     up, and absent from the DOM on mobile. Merely hiding it with
 *     display:none still renders it and still runs its animations.
 */
import assert from "node:assert/strict";
import test from "node:test";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");

const read = (...parts) =>
  fs.readFileSync(path.join(root, ...parts), "utf8");

const heroJsx = read("src/components/sections/Home/Hero.jsx");
const heroCss = read("src/components/sections/Home/Hero.css");
const navbarCss = read("src/components/layout/Navbar.css");
const hookSource = read("src/hooks/useMediaQuery.js");

const squash = (value) => value.replace(/\s+/g, " ");

const tabletStart = navbarCss.indexOf(
  "@media (max-width: 1199px) and (min-width: 769px)"
);
const tabletEnd = navbarCss.indexOf("@media (max-width: 768px)", tabletStart);
const tabletBlock = squash(
  tabletStart === -1 ? "" : navbarCss.slice(tabletStart, tabletEnd)
);

test("tablet navbar collapses its desktop row instead of compressing it", () => {
  assert.notEqual(tabletStart, -1, "tablet navbar media query is missing");

  assert.match(
    tabletBlock,
    /\.nb-links, \.nb-cta, \.nb-bar > \.language-switcher \{ display: none;/,
    "tablet must hide the desktop links, CTAs and inline language selector"
  );

  assert.match(
    tabletBlock,
    /\.nb-hamburger \{ display: flex;/,
    "tablet must expose the hamburger so the drawer is reachable"
  );
});

test("the full nav row only appears where it actually fits", () => {
  /* The row needs ~960px of content plus pill padding, and the pill
     narrows as the page scrolls. Below 1200px it collided and clipped
     (the logo overlapped "Home" at 1024px), so the drawer takes over. */
  assert.ok(
    !navbarCss.includes("@media (max-width: 1023px) and (min-width: 769px)"),
    "the old 1023px tablet range left 1024px on the overflowing desktop row"
  );

  assert.match(
    navbarCss,
    /@media \(max-width: 1279px\) and \(min-width: 1200px\)/,
    "a compact band must give the full row slack between 1200 and 1279px"
  );
});

test("the navbar never shrinks below the width its content needs", () => {
  const navbarJsx = read("src/components/layout/Navbar.jsx");

  assert.match(
    navbarJsx,
    /92 - p \* 2/,
    "the scroll shrink must stay gentle so the nav row still fits"
  );

  assert.match(
    navbarJsx,
    /1360 - p \* 80/,
    "the scroll shrink must stay gentle so the nav row still fits"
  );
});

test("tablet navbar no longer depends on shrunken desktop controls", () => {
  assert.ok(
    !/\.nb-link \{ font-size: 14px; \}/.test(tabletBlock),
    "tablet must not keep shrunken .nb-link typography as its fit strategy"
  );

  assert.ok(
    !/\.nb-bar \.language-switcher__current \{ display: none; \}/.test(
      tabletBlock
    ),
    "tablet no longer needs an icon-only desktop language selector"
  );
});

test("hero diagram is mounted only from the tablet breakpoint up", () => {
  assert.match(
    heroJsx,
    /const SHOW_ANIMATION_QUERY = "\(min-width: 768px\)";/,
    "the mount breakpoint must be 768px"
  );

  assert.match(
    heroJsx,
    /const showAnimation = useMediaQuery\(SHOW_ANIMATION_QUERY\);/,
    "the hero must derive mounting from the media query"
  );

  const guard = heroJsx.indexOf("{showAnimation && (");
  const diagram = heroJsx.indexOf('className="hero-right"');

  assert.notEqual(guard, -1, "the diagram is not behind a mount guard");
  assert.notEqual(diagram, -1, "the hero diagram markup is missing");
  assert.ok(
    guard < diagram,
    "the mount guard must wrap the diagram, not follow it"
  );
});

test("mobile hero relies on unmounting, not on display:none", () => {
  assert.match(
    heroJsx,
    /const reduceMotion = useMediaQuery\("\(prefers-reduced-motion: reduce\)"\);/,
    "reduced motion must be honoured for SMIL animations CSS cannot stop"
  );

  assert.match(
    heroJsx,
    /\{!reduceMotion && CONNECTIONS\.map/,
    "travelling dots must be omitted when reduced motion is requested"
  );

  assert.ok(
    !heroJsx.includes("desktop-only"),
    "the hero must not fall back to the old CSS hiding class"
  );

  assert.ok(
    !heroCss.includes(".desktop-only"),
    "the desktop-only hiding rule must be gone from the hero stylesheet"
  );
});

test("hero node sizes scale proportionally with the scene", () => {
  assert.match(
    heroJsx,
    /"--w": `\$\{\(node\.size \/ SCENE_SIZE\) \* 100\}%`/,
    "node boxes must be a percentage of the scene"
  );

  assert.match(
    heroJsx,
    /"--s": `\$\{\(node\.iconSize \/ node\.size\) \* 100\}%`/,
    "node glyphs must be a percentage of the node box"
  );

  const css = squash(heroCss);

  assert.match(
    css,
    /\.n8n-node \{ width: var\(--w, 13\.6%\); height: var\(--w, 13\.6%\); \}/,
    "node boxes must consume the proportional width variable"
  );

  assert.match(
    css,
    /\.n8n-node__body svg \{ width: var\(--s, 41%\); height: var\(--s, 41%\); \}/,
    "node glyphs must consume the proportional glyph variable"
  );
});

test("the media query hook subscribes, unsubscribes and is SSR-safe", () => {
  assert.match(hookSource, /useSyncExternalStore/, "hook must use React's store");
  assert.match(
    hookSource,
    /removeEventListener/,
    "hook must unsubscribe on unmount"
  );
  assert.match(
    hookSource,
    /getServerSnapshot/,
    "hook must provide a server snapshot"
  );
});

test("the production bundle keeps the tablet collapse and mount guard", () => {
  const distAssets = path.join(root, "dist", "assets");

  if (!fs.existsSync(distAssets)) {
    console.log("[tests] no dist/assets -- run `npm run build` first");
    return;
  }

  const names = fs.readdirSync(distAssets);
  const css = names
    .filter((name) => name.endsWith(".css"))
    .map((name) => fs.readFileSync(path.join(distAssets, name), "utf8"))
    .join("\n");
  const js = names
    .filter((name) => name.startsWith("index-") && name.endsWith(".js"))
    .map((name) => fs.readFileSync(path.join(distAssets, name), "utf8"))
    .join("\n");

  assert.ok(
    css.includes("@media (max-width:1199px) and (min-width:769px)"),
    "build output is missing the tablet navbar media query"
  );

  assert.ok(
    css.includes(".nb-links,.nb-cta,.nb-bar>.language-switcher{display:none}"),
    "build output still shows the tablet desktop row"
  );

  assert.ok(
    js.includes("(min-width: 768px)"),
    "build output is missing the hero mount breakpoint"
  );
});