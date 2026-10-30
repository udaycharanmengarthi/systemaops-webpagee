/* Regression guard for the navbar Book a Call control.
 *
 * The icon is the existing astroid.svg rendered through the shared
 * MetallicPaint component at a compact navbar size. The pill itself is the
 * shared SpecularButton. These checks keep the gold configuration, the
 * original asset, the fallback, the specular contract, and both routes from
 * drifting.
 */
import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const read = (relative) => fs.readFileSync(path.join(root, relative), "utf8");

const astroidMark = read("src/components/layout/AstroidMark.jsx");
const metallicPaint = read("src/components/layout/MetallicPaint.jsx");
const metallicPaintCss = read("src/components/layout/MetallicPaint.css");
const specularButton = read("src/components/ui/SpecularButton.jsx");
const specularButtonCss = read("src/components/ui/SpecularButton.css");
const navbar = read("src/components/layout/Navbar.jsx");
const navbarCss = read("src/components/layout/Navbar.css");
const astroidSvg = read("src/assets/astroid.svg");

test("AstroidMark uses the shared MetallicPaint and the approved gold values", () => {
  assert.match(astroidMark, /import MetallicPaint from "\.\/MetallicPaint"/);
  assert.match(astroidMark, /import logo from "\.\.\/\.\.\/assets\/astroid\.svg"/);
  assert.match(astroidMark, /imageSrc=\{logo\}/);
  assert.match(astroidMark, /color="#f2c46b"/);
  assert.match(astroidMark, /dispersion=\{0\.15\}/);
  assert.match(astroidMark, /scale=\{1\}/);
  assert.ok(!astroidMark.includes("MATERIAL_OUTSIDE"), "the old custom shader is gone");
});

test("AstroidMark keeps a CSS fallback for browsers without WebGL", () => {
  assert.match(astroidMark, /astroid-mark__fallback/);
  assert.match(astroidMark, /--astroid-image/);
  assert.match(astroidMark, /"astroid-mark"/);
  assert.match(
    metallicPaintCss,
    /\.astroid-mark:has\(\.metallic-paint\[data-paint-ready="true"\]\) > \.astroid-mark__fallback/
  );
  assert.ok(
    metallicPaintCss.includes("@media (prefers-reduced-motion: reduce)"),
    "the fallback shimmer respects reduced motion"
  );
});

test("MetallicPaint initialises WebGL2 and releases every GPU resource", () => {
  assert.match(metallicPaint, /getContext\('webgl2'/);
  assert.ok(metallicPaint.includes("if (!gl) return undefined"));
  assert.ok(metallicPaint.includes("gl.deleteTexture(texture)"));
  assert.ok(metallicPaint.includes("gl.deleteBuffer(buffer)"));
  assert.ok(metallicPaint.includes("gl.deleteVertexArray(vao)"));
  assert.ok(metallicPaint.includes("gl.deleteProgram(program)"));
});

test("both Book a Call CTAs use SpecularButton, render the mark, and keep the route", () => {
  assert.match(navbar, /import SpecularButton from "\.\.\/ui\/SpecularButton"/);
  assert.equal((navbar.match(/<SpecularButton/g) || []).length, 2);
  assert.equal((navbar.match(/<AstroidMark/g) || []).length, 2);
  assert.equal((navbar.match(/navigate\("\/book-a-call"\)/g) || []).length, 2);
  assert.ok(!navbar.includes("astroid-outline"), "the old outline overlay is not used");
});

test("both Book a Call CTAs pass the approved specular configuration", () => {
  assert.match(navbar, /radius:\s*24/);
  assert.match(navbar, /lineColor:\s*isLightTheme \? "#E8B95E" : "#ffffff"/);
  assert.match(navbar, /baseColor:\s*isLightTheme \? "#C99A42" : "#525252"/);
  assert.match(navbar, /intensity:\s*1/);
  assert.match(navbar, /idleIntensity:\s*isLightTheme \? 0\.25 : 0\.35/);
  assert.match(navbar, /shineSize:\s*10/);
  assert.match(navbar, /shineFade:\s*34/);
  assert.match(navbar, /thickness:\s*1\.2/);
  assert.match(navbar, /glow:\s*isLightTheme \? 0\.7 : 1/);
  assert.match(navbar, /followMouse:\s*true/);
  assert.match(navbar, /proximity:\s*250/);
  assert.match(navbar, /isLightTheme \? "#0b1720" : "#ffffff"/);
});

test("SpecularButton initialises WebGL2 and releases every GPU resource", () => {
  assert.match(specularButton, /getContext\('webgl2'/);
  assert.ok(specularButton.includes("if (!button || !canvas || !gl) return undefined"));
  assert.ok(specularButton.includes("if (!program) return undefined"));
  assert.ok(specularButton.includes("gl.deleteBuffer(buffer)"));
  assert.ok(specularButton.includes("gl.deleteVertexArray(vao)"));
  assert.ok(specularButton.includes("gl.deleteProgram(program)"));
  assert.ok(specularButton.includes("cancelAnimationFrame(raf)"));
  assert.ok(
    !specularButton.includes("loseContext()"),
    "StrictMode's effect remount would otherwise leave the second mount with a lost context"
  );
  assert.ok(specularButton.includes("addEventListener('webglcontextlost', onContextLost)"));
  assert.ok(specularButton.includes("canvas.style.opacity = '0'"));
  assert.ok(specularButton.includes("resizeObserver.disconnect()"));
  assert.ok(specularButton.includes("intersection.disconnect()"));
});

test("SpecularButton keeps its accessible canvas/label layering", () => {
  assert.match(specularButton, /className="specular-button__light"\s+aria-hidden="true"/);
  assert.match(specularButton, /className="specular-button__label"/);
  assert.match(specularButton, /className={`specular-button specular-button--\$\{size\}/);
  assert.match(specularButtonCss, /\.specular-button__light\s*\{[^}]*pointer-events:\s*none/s);
  assert.match(specularButtonCss, /\.specular-button__light\s*\{[^}]*max-width:\s*none/s);
  assert.match(specularButtonCss, /\.specular-button__label\s*\{[^}]*z-index:\s*2/s);
  assert.match(specularButtonCss, /\.specular-button__light\s*\{[^}]*z-index:\s*1/s);
  assert.ok(
    specularButtonCss.includes("@media (prefers-reduced-motion: reduce)"),
    "the press transition respects reduced motion"
  );
});

test("the navbar renders the mark at a compact 24px size", () => {
  assert.match(navbarCss, /\.nb-cta-mark-shell\s*\{[^}]*width:\s*24px/s);
  assert.match(navbarCss, /\.nb-cta-mark-shell\s*\{[^}]*height:\s*24px/s);
  assert.match(navbarCss, /\.nb-cta-mark\s*\{[^}]*width:\s*24px/s);
});

test("the Book a Call pill keeps compact navbar geometry and specular treatment", () => {
  assert.match(navbarCss, /\.nb-book-cta\s*\{[^}]*height:\s*48px/s);
  assert.match(navbarCss, /\.nb-book-cta\s*\{[^}]*padding:\s*0 20px !important/s);
  assert.match(navbarCss, /\.nb-book-cta\s*\{[^}]*border-radius:\s*999px/s);
  assert.match(navbarCss, /\.nb-mobile-cta-group \.nb-book-cta--mobile\s*\{[^}]*width:\s*100%/s);
  assert.match(
    navbarCss,
    /\.nb-book-cta \.nb-cta-label\s*\{[^}]*color:\s*#ffffff !important/s
  );
  assert.match(
    navbarCss,
    /\.nb-book-cta \.nb-cta-arrow\s*\{[^}]*color:\s*#ffffff !important/s
  );
  assert.match(
    navbarCss,
    /\.nb-wrapper \.nb-bar \.nb-cta-group \.navbar-book-call\s*\{[^}]*background:\s*color-mix\(/s
  );
  assert.ok(
    !/\.nb-wrapper \.nb-bar \.nb-cta-group \.navbar-book-call\s*\{[^}]*#292929/s.test(navbarCss),
    "the old static border is no longer drawn over the specular edge"
  );
  assert.ok(
    !/\.nb-wrapper \.nb-bar \.nb-cta-group \.navbar-book-call\s*\{[^}]*background:\s*transparent !important/s.test(navbarCss),
    "the specular glass body is not forced transparent"
  );
});

test("the original astroid asset is preserved", () => {
  assert.match(astroidSvg, /<stop stop-color="#087F8C"\/>/);
  assert.match(astroidSvg, /<stop offset="\.35" stop-color="#00B8B0"\/>/);
  assert.match(astroidSvg, /M32 2C37\.8 22\.2/);
  assert.ok(!astroidSvg.includes("#f2c46b"), "the gold belongs to the renderer, not the asset");
});
