import { useEffect, useRef, useState, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { VesselSummary } from "../types/vessel.types";
import { parseVesselWsEvent } from "../types/vessel.types";
import { getAllVessels } from "../api/get-all-vessels";
import { applyWsEvent } from "../lib/apply-ws-event";

const WS_URL = import.meta.env.VITE_WS_URL ?? "ws://localhost:3000/ws/vessels";

export const VESSELS_QUERY_KEY = ["vessels"] as const;

export interface UseVesselsResult {
  vessels: VesselSummary[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  /** MMSIs that received a live update in the last 800ms — used for pulse highlight */
  recentlyUpdated: ReadonlySet<string>;
}

export function useVessels(): UseVesselsResult {
  const queryClient = useQueryClient();
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [recentlyUpdated, setRecentlyUpdated] = useState<ReadonlySet<string>>(
    new Set(),
  );

  const markUpdated = useCallback((mmsi: string) => {
    setRecentlyUpdated((prev) => new Set([...prev, mmsi]));
    setTimeout(() => {
      setRecentlyUpdated((prev) => {
        const next = new Set(prev);
        next.delete(mmsi);
        return next;
      });
    }, 800);
  }, []);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: VESSELS_QUERY_KEY,
    queryFn: getAllVessels,
    refetchOnWindowFocus: false,
    staleTime: 0,
  });

  useEffect(() => {
    let destroyed = false;

    function connect(): void {
      if (destroyed) return;

      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onmessage = (ev: MessageEvent<string>) => {
        let parsed: unknown;
        try {
          parsed = JSON.parse(ev.data) as unknown;
        } catch {
          return;
        }

        const event = parseVesselWsEvent(parsed);
        if (!event) return;

        if (
          event.event === "vessel:updated" ||
          event.event === "vessel:created"
        ) {
          markUpdated(event.data.mmsi);
        }

        queryClient.setQueryData<VesselSummary[]>(VESSELS_QUERY_KEY, (prev) =>
          applyWsEvent(prev ?? [], event),
        );
      };

      ws.onclose = () => {
        if (destroyed) return;
        reconnectTimerRef.current = setTimeout(() => {
          if (!destroyed) connect();
        }, 5_000);
      };
    }

    connect();

    return () => {
      destroyed = true;
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
      wsRef.current?.close();
      wsRef.current = null;
    };
  }, [queryClient, markUpdated]);

  return {
    vessels: data ?? [],
    isLoading,
    isError,
    error: error as Error | null,
    recentlyUpdated,
  };
}
