import { useCallback, useEffect, useRef, useState } from "react";
import { RECENTLY_UPDATED_HIGHLIGHT_MS } from "../lib/constants";

export interface UseRecentlyUpdatedResult {
  recentlyUpdated: ReadonlySet<string>;
  markUpdated: (id: string) => void;
}

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
        // Bail out without creating a new Set when `id` is already a
        // member. The timer above is still cleared and restarted on
        // every call regardless — what's being short-circuited here is
        // only the *membership* update, since re-marking an already-
        // highlighted ID doesn't change what's visible to consumers of
        // `recentlyUpdated`. This avoids an unnecessary re-render on
        // every repeat update to the same vessel within one highlight
        // window, while still correctly extending how long it stays
        // highlighted.
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

  // Intentionally unmount-only (`[]`, not `[highlightMs]`). If `highlightMs`
  // changes while timers are in flight, those timers keep running on their
  // original duration — only future calls to `markUpdated` pick up the new
  // value. That's the desired behavior: changing the prop shouldn't reset
  // pulses that are already mid-flight. This effect's sole job is to make
  // sure no timer outlives the component itself.
  useEffect(() => {
    const timers = timersRef.current;

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
      timers.clear();
    };
  }, []);

  return { recentlyUpdated, markUpdated };
}
