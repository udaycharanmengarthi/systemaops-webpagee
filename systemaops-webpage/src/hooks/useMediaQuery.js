import { useCallback, useSyncExternalStore } from "react";

/**
 * Subscribe to a CSS media query from React.
 *
 * Used to MOUNT expensive, decorative UI only where it actually belongs,
 * so it is not merely hidden with CSS. Hiding with `display: none` still
 * renders the DOM and still runs CSS/SMIL animations; unmounting does not.
 *
 * Deliberately dependency-free (the project has no viewport library) and
 * SSR-safe: the server snapshot is `false`, while the client reads the real
 * value synchronously on the first render so nothing flashes in later.
 *
 * @param {string} query e.g. "(min-width: 768px)"
 * @returns {boolean} whether the query currently matches
 */
export default function useMediaQuery(query) {
  const subscribe = useCallback(
    (onChange) => {
      /* matchMedia is absent in very old browsers and in some test
         environments; degrade to "never matches" rather than throwing. */
      if (
        typeof window === "undefined" ||
        typeof window.matchMedia !== "function"
      ) {
        return () => {};
      }

      const mq = window.matchMedia(query);

      if (typeof mq.addEventListener === "function") {
        mq.addEventListener("change", onChange);
      } else if (typeof mq.addListener === "function") {
        /* Safari < 14 */
        mq.addListener(onChange);
      }

      /* Removing the listener is what actually stops the subscription when
         the component unmounts (e.g. leaving the mobile breakpoint). */
      return () => {
        if (typeof mq.removeEventListener === "function") {
          mq.removeEventListener("change", onChange);
        } else if (typeof mq.removeListener === "function") {
          mq.removeListener(onChange);
        }
      };
    },
    [query]
  );

  const getSnapshot = useCallback(() => {
    if (
      typeof window === "undefined" ||
      typeof window.matchMedia !== "function"
    ) {
      return false;
    }

    return window.matchMedia(query).matches;
  }, [query]);

  const getServerSnapshot = useCallback(() => false, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}