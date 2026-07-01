import { useEffect, useRef } from "react";
import type { VesselWsEvent } from "../types/vessel.types";
import { parseVesselWsEvent } from "../types/vessel.types";
import {
  WS_RECONNECT_BASE_DELAY_MS,
  WS_RECONNECT_MAX_DELAY_MS,
} from "../lib/constants";

export type WsConnectionStatus = "connecting" | "open" | "closed";

type UseVesselWebSocketOptions = {
  // keep the URL stable to avoid reconnecting on every render.
  url: string;

  onEvent: (event: VesselWsEvent) => void;
  onStatusChange?: (status: WsConnectionStatus) => void;
};

/**
 * Owns the WebSocket connection lifecycle only — parsing, dispatch, and
 * reconnection. Deliberately knows nothing about React Query or vessel
 * state; it just calls `onEvent` for every well-formed message. This
 * keeps the hook reusable if a second feature ever needs the same feed.
 *
 * Reconnects with exponential backoff (capped) rather than a fixed
 * interval, so a downed server isn't hammered with retries forever.
 *
 * `onclose` is the single source of truth for terminal connection state.
 *
 * `onerror` intentionally does NOT report status — the browser fires
 * `close` immediately after `error` in every mainstream implementation,
 * and routing status through both handlers would mean two code paths
 * racing to describe the same transition, with no guarantee they agree
 * on ordering in every runtime (some WebSocket polyfills and test mocks
 * don't follow `error` with `close`). Reconnection scheduling lives
 * exclusively in `onclose` for the same reason.
 */
export function useVesselWebSocket({
  url,
  onEvent,
  onStatusChange,
}: UseVesselWebSocketOptions): void {
  const onEventRef = useRef(onEvent);
  const onStatusChangeRef = useRef(onStatusChange);

  useEffect(() => {
    onEventRef.current = onEvent;
    onStatusChangeRef.current = onStatusChange;
  }, [onEvent, onStatusChange]);

  useEffect(() => {
    let destroyed = false;
    let socket: WebSocket | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let attempt = 0;

    function nextDelay(): number {
      const delay = WS_RECONNECT_BASE_DELAY_MS * 2 ** attempt;
      return Math.min(delay, WS_RECONNECT_MAX_DELAY_MS);
    }

    function connect(): void {
      if (destroyed) return;

      onStatusChangeRef.current?.("connecting");
      const ws = new WebSocket(url);
      socket = ws;

      ws.onopen = () => {
        // Reset the retry delay after a successful connection.
        attempt = 0;

        onStatusChangeRef.current?.("open");
      };

      ws.onmessage = (ev: MessageEvent<string>) => {
        let parsed: unknown;
        try {
          parsed = JSON.parse(ev.data) as unknown;
        } catch {
          return;
        }

        const event = parseVesselWsEvent(parsed);
        if (event) onEventRef.current(event);
      };

      ws.onerror = () => {
        // Intentionally a no-op for status reporting.onclose handles all disconnect and reconnect logic.
      };

      ws.onclose = () => {
        if (destroyed) return;
        onStatusChangeRef.current?.("closed");
        const delay = nextDelay();
        attempt += 1;
        reconnectTimer = setTimeout(connect, delay);
      };
    }

    connect();

    return () => {
      destroyed = true;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      socket?.close();
      socket = null;
    };
  }, [url]);
}
