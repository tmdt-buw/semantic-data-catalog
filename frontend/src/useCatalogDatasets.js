import { useCallback, useEffect, useRef, useState } from "react";
import { cleanupCatalogSeriesLinks, loadAggregatedDatasets } from "./solidCatalog";

export default function useCatalogDatasets(session, webId, isLoggedIn) {
  const context = `${isLoggedIn}:${webId || ""}`;
  const [result, setResult] = useState(null);
  const [attempt, setAttempt] = useState(0);
  const activeRun = useRef(null);
  const cleanup = useRef(null);

  const fetchDatasets = useCallback(async () => {
    const run = activeRun.current;
    if (!run || run.context !== context) return;
    const request = ++run.request;
    let failed = false;
    let partial = false;
    try {
      const loaded = await loadAggregatedDatasets(
        session,
        isLoggedIn ? null : window.fetch.bind(window),
        {
          usePublicCache: true,
          onLoadError: (_error, detail) => {
            // A registry can link to deleted, private or offline entries.
            // Wait for the complete traversal, but do not let one such entry
            // hide every successful result. Discovery failures remain blocking.
            if (detail?.stage === "dataset" || detail?.stage === "catalog") partial = true;
            else failed = true;
          },
        }
      );
      if (activeRun.current !== run || run.request !== request) return;
      setResult({
        context,
        datasets: loaded.datasets.map((dataset) => ({
          ...dataset,
          userHasAccess: dataset.is_public || dataset.webid === webId,
        })),
        catalogs: loaded.catalogs || [],
        error: failed,
        partial,
      });
    } catch (error) {
      if (activeRun.current !== run || run.request !== request) return;
      console.error("Error fetching datasets:", error);
      setResult({ context, datasets: [], catalogs: [], error: true });
    }
  }, [session, context, isLoggedIn, webId]);

  useEffect(() => {
    const run = { context, request: 0 };
    activeRun.current = run;
    setResult(null);
    // Keep the existing maintenance step, but load the final catalog only
    // afterwards. Sharing its promise also avoids duplicate Strict Mode writes.
    if (isLoggedIn && webId &&
        (cleanup.current?.context !== context || cleanup.current?.session !== session)) {
      cleanup.current = {
        context,
        session,
        promise: cleanupCatalogSeriesLinks(session).catch((error) => {
          console.error("Cleanup failed:", error);
        }),
      };
    }
    const preparation = isLoggedIn ? cleanup.current?.promise : undefined;
    Promise.resolve(preparation).then(() => {
      if (activeRun.current === run) fetchDatasets();
    });
    // Ignore stale responses after account changes or unmounts.
    // https://react.dev/reference/react/useEffect#fetching-data-with-effects
    return () => {
      if (activeRun.current === run) activeRun.current = null;
    };
  }, [session, context, isLoggedIn, webId, attempt, fetchDatasets]);

  const current = result?.context === context ? result : null;
  return {
    datasets: current?.datasets || [],
    catalogs: current?.catalogs || [],
    loading: !current,
    error: Boolean(current?.error),
    partial: Boolean(current?.partial),
    fetchDatasets,
    retry: () => {
      setResult(null);
      setAttempt((value) => value + 1);
    },
  };
}
