/* Render harness for the consultation page.
 *
 * Kept as .jsx so esbuild can compile it, and deliberately NOT named
 * "*.test.js" so the project's node:test glob does not run it as a
 * suite. Nothing here is shipped - it exists only so the render tests
 * can mount the real page, in the real providers, per language.
 */
import { MemoryRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { renderToStaticMarkup } from "react-dom/server";

import { LanguageProvider } from "../../src/i18n/LanguageContext";
import BookACall from "../../src/pages/BookACall";

/**
 * Render /book-a-call exactly as the app does, in `language`.
 *
 * LanguageProvider picks its language from localStorage on first render,
 * so writing the key first is how the language is "switched" here.
 *
 * @returns {{ markup: string, title: string }}
 */
export function renderConsultation(language, route = "/book-a-call") {
  window.localStorage.setItem("systemaops-language", language);

  const helmetContext = {};

  const markup = renderToStaticMarkup(
    <HelmetProvider context={helmetContext}>
      <LanguageProvider>
        <MemoryRouter initialEntries={[route]}>
          <BookACall />
        </MemoryRouter>
      </LanguageProvider>
    </HelmetProvider>
  );

  const title = helmetContext.helmet?.title?.toString() ?? "";

  /* On React 19 the helmet dispatcher renders a real <title> element into
   * the markup, which is a truer assertion than reaching into helmet
   * internals: it proves the title the browser would receive. */
  const rendered = markup.match(/<title[^>]*>([^<]*)<\/title>/i);

  const meta = markup.match(
    /<meta[^>]*name="description"[^>]*content="([^"]*)"/i
  );

  return {
    markup,
    title: rendered ? rendered[1] : title,
    description: meta ? meta[1] : "",
  };
}