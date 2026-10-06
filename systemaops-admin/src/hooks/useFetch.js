import { useCallback, useEffect, useRef, useState } from "react";

/* GET helper with loading/error/refresh. `key` re-triggers the fetch.
   Returns { data, meta, loading, refreshing, error, refresh }.
   `loading` is true only for the initial load; `refreshing` covers
   background refetches so pages can keep rendered data mounted with
   a subtle indicator instead of flashing skeletons. */
export function useFetch(fetcher, key = "") {
  const [data, setData] = useState(null);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [nonce, setNonce] = useState(0);
  const alive = useRef(true);
  const hasData = useRef(false);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    setError(null);
    if (hasData.current) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    fetcher()
      .then((result) => {
        if (cancelled || !alive.current) return;
        setData(result && result.data !== undefined ? result.data : result);
        setMeta(result && result.meta ? result.meta : null);
        hasData.current = true;
      })
      .catch((err) => {
        if (cancelled || !alive.current) return;
        setError(err);
      })
      .finally(() => {
        if (!cancelled && alive.current) {
          setLoading(false);
          setRefreshing(false);
        }
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, nonce]);

  const refresh = useCallback(() => setNonce((n) => n + 1), []);
  return { data, meta, loading, refreshing, error, refresh };
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
