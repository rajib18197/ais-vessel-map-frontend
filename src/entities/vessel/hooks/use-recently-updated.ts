import { useCallback, useEffect, useRef, useState } from "react";
import { RECENTLY_UPDATED_HIGHLIGHT_MS } from "../lib/constants";

type UseRecentlyUpdatedResult = {
  recentlyUpdated: ReadonlySet<string>;
  markUpdated: (id: string) => void;
};

/**
 * Tracks which IDs were updated within the last N ms, for transient
 * "pulse" highlighting. Each ID's timer is tracked individually so that
 * re-marking an ID (a vessel updating again before its previous pulse
 * expired) cleanly restarts its own timer instead of leaving the old
 * one to fire and incorrectly clear a newer highlight.
 */
export function useRecentlyUpdated(
  highlightMs: number = RECENTLY_UPDATED_HIGHLIGHT_MS,
): UseRecentlyUpdatedResult {
  const [recentlyUpdated, setRecentlyUpdated] = useState<ReadonlySet<string>>(
    () => new Set(),
  );
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map(),
  );

  const markUpdated = useCallback(
    (id: string) => {
      const existingTimer = timersRef.current.get(id);
      if (existingTimer) clearTimeout(existingTimer);

      setRecentlyUpdated((prev) => {
        // No need to update state if this ID is already highlighted.
        if (prev.has(id)) return prev;

        const next = new Set(prev);
        next.add(id);
        return next;
      });

      const timer = setTimeout(() => {
        timersRef.current.delete(id);
        setRecentlyUpdated((prev) => {
          if (!prev.has(id)) return prev;
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }, highlightMs);

      timersRef.current.set(id, timer);
    },
    [highlightMs],
  );

  // Only clear timers when the component unmounts.
  useEffect(() => {
    const timers = timersRef.current;

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
      timers.clear();
    };
  }, []);

  return { recentlyUpdated, markUpdated };
}
