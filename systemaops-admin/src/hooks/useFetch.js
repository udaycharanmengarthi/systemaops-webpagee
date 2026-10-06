import { useCallback, useEffect, useRef, useState } from "react";

/* GET helper with loading/error/refresh. `key` re-triggers the fetch.
   Returns { data, meta, loading, error, refresh }. */
export function useFetch(fetcher, key = "") {
  const [data, setData] = useState(null);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nonce, setNonce] = useState(0);
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetcher()
      .then((result) => {
        if (cancelled || !alive.current) return;
        setData(result && result.data !== undefined ? result.data : result);
        setMeta(result && result.meta ? result.meta : null);
      })
      .catch((err) => {
        if (cancelled || !alive.current) return;
        setError(err);
      })
      .finally(() => {
        if (!cancelled && alive.current) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, nonce]);

  const refresh = useCallback(() => setNonce((n) => n + 1), []);
  return { data, meta, loading, error, refresh };
}

/* Debounced value for search inputs (400ms). */
export function useDebouncedValue(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}
