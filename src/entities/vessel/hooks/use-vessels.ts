import { useCallback } from "react";
import {
  useQuery,
  useQueryClient,
  type UseQueryResult,
} from "@tanstack/react-query";
import type { VesselSummary, VesselWsEvent } from "../types/vessel.types";
import { getAllVessels } from "../api/get-all-vessels";
import { applyWsEvent } from "../lib/apply-ws-event";
import { useVesselWebSocket } from "./use-vessel-websocket";
import { useRecentlyUpdated } from "./use-recently-updated";
import { ApiError } from "@/shared/api/api-error";
import { WS_URL } from "@/shared/api/api-base";

export const VESSELS_QUERY_KEY = ["vessels"] as const;

export interface UseVesselsResult {
  vessels: VesselSummary[];
  isLoading: boolean;
  isError: boolean;
  error: ApiError | null;
  recentlyUpdated: ReadonlySet<string>;
}

/**
 * Composes the vessel list query with its live WebSocket feed. The REST
 * fetch establishes the very first paint before the socket has opened;
 * after that, the socket is authoritative and the cache is never
 * re-fetched over HTTP again. Connection lifecycle and "recently updated"
 * pulse tracking are delegated to their own hooks — this one only wires
 * them together.
 *
 * Resync-on-reconnect is handled implicitly, not by this hook: the server
 * sends a `vessel:snapshot` event immediately on every connection,
 * including reconnects after a dropped socket, and `applyWsEvent` replaces
 * the cache wholesale on that event. This hook deliberately does NOT call
 * `queryClient.invalidateQueries` on `"open"` — doing so would trigger a
 * redundant REST re-fetch racing against a snapshot that's already on its
 * way over the socket. If the server's snapshot-on-connect behavior ever
 * changes, this is the first place that needs to change with it.
 */
export function useVessels(): UseVesselsResult {
  const queryClient = useQueryClient();
  const { recentlyUpdated, markUpdated } = useRecentlyUpdated();

  const query: UseQueryResult<VesselSummary[], ApiError> = useQuery({
    queryKey: VESSELS_QUERY_KEY,
    queryFn: getAllVessels,
    refetchOnWindowFocus: false,
    staleTime: 0,
  });

  const handleEvent = useCallback(
    (event: VesselWsEvent) => {
      if (
        event.event === "vessel:updated" ||
        event.event === "vessel:created"
      ) {
        markUpdated(event.data.mmsi);
      }

      queryClient.setQueryData<VesselSummary[]>(VESSELS_QUERY_KEY, (prev) =>
        applyWsEvent(prev ?? [], event),
      );
    },
    [queryClient, markUpdated],
  );

  useVesselWebSocket({ url: WS_URL, onEvent: handleEvent });

  return {
    vessels: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    recentlyUpdated,
  };
}
