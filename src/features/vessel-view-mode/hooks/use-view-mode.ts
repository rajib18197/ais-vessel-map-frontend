import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

export type ViewMode = "all" | "bounds";

const MODE_PARAM = "mode";
const BOUNDS_MODE_VALUE = "bounds";

/**
 * View mode lives in the URL, not component state — it's navigable,
 * shareable, and survives a refresh. Absence of `?mode=bounds` IS the
 * "all vessels" state; there is no `?mode=all` to keep the default
 * path URL-clean (per product decision: only bounds mode is
 * URL-addressable).
 */
export function useViewMode(): {
  mode: ViewMode;
  setMode: (next: ViewMode) => void;
} {
  const [searchParams, setSearchParams] = useSearchParams();

  const mode: ViewMode =
    searchParams.get(MODE_PARAM) === BOUNDS_MODE_VALUE ? "bounds" : "all";

  const setMode = useCallback(
    (next: ViewMode) => {
      setSearchParams(
        (prev) => {
          const params = new URLSearchParams(prev);
          if (next === "bounds") {
            params.set(MODE_PARAM, BOUNDS_MODE_VALUE);
          } else {
            params.delete(MODE_PARAM);
          }
          return params;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  return { mode, setMode };
}
