import type { VesselSummary, VesselWsEvent } from "../types/vessel.types";

/**
 * Compile-time exhaustiveness guard. If `VesselWsEvent`'s union ever grows
 * a new variant, every `switch` using this in its `default` case fails to
 * compile until that variant is handled here too — this is what makes
 * "exhaustive switch" an enforced invariant rather than a convention that
 * silently rots the next time someone adds an event type.
 */
function assertNever(value: never): never {
  throw new Error(`Unhandled VesselWsEvent variant: ${JSON.stringify(value)}`);
}

/**
 * Pure reducer applying a single WebSocket event to the current vessel
 * list. Used directly inside `queryClient.setQueryData`'s updater, so it
 * must never mutate `vessels` or any element within it — React Query (and
 * any memoized selector downstream) relies on referential identity to
 * detect change.
 */
export function applyWsEvent(
  vessels: VesselSummary[],
  event: VesselWsEvent,
): VesselSummary[] {
  switch (event.event) {
    case "vessel:snapshot": {
      // Defensive copy: `event.data` is the array reference produced by
      // JSON.parse inside the WS message handler. Returning it directly
      // would let the React Query cache alias an object nothing else
      // owns the lifecycle of. Spreading costs one shallow array
      // allocation per snapshot — snapshots only arrive on
      // connect/reconnect, not on every update, so this is not a hot
      // path.
      return [...event.data];
    }

    case "vessel:created": {
      const exists = vessels.some((v) => v.mmsi === event.data.mmsi);
      return exists ? vessels : [event.data, ...vessels];
    }

    case "vessel:updated": {
      return vessels.map((v) => (v.mmsi === event.data.mmsi ? event.data : v));
    }

    default:
      return assertNever(event);
  }
}
