import { useCallback, useRef, useState } from "react";

const HOVER_CLOSE_DELAY_MS = 250;

/**
 * Hover state with a short close-delay grace period. Raw mouseover/
 * mouseout on a moving marker is a noisy signal — the marker can slide
 * out from under a stationary cursor mid-tick, firing mouseout even
 * though the user's intent hasn't changed. This treats "hover start" as
 * authoritative immediately, but debounces "hover end" so a same-target
 * re-hover within the grace window cancels the pending close instead of
 * causing a visible flicker.
 */
export function useHoverWithGrace(): {
  hoveredMmsi: string | null;
  onHoverStart: (mmsi: string) => void;
  onHoverEnd: (mmsi: string) => void;
  clear: () => void;
} {
  const [hoveredMmsi, setHoveredMmsi] = useState<string | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onHoverStart = useCallback((mmsi: string) => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setHoveredMmsi(mmsi);
  }, []);

  const onHoverEnd = useCallback((mmsi: string) => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => {
      setHoveredMmsi((current) => (current === mmsi ? null : current));
    }, HOVER_CLOSE_DELAY_MS);
  }, []);

  // Immediate, non-debounced clear — used when the hovered vessel has
  // actually left the feed, where a grace-period delay makes no sense
  // (there's nothing to re-hover back onto).
  const clear = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setHoveredMmsi(null);
  }, []);

  return { hoveredMmsi, onHoverStart, onHoverEnd, clear };
}
