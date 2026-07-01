import L, { type DivIcon } from "leaflet";
import { getVesselTheme } from "../constants/vessel-theme";
import type { VesselColorTheme } from "../types";
import VesselSVG from "./vessel-svg";

function resolveVesselTheme(
  vesselType: string,
  isSelected: boolean,
): VesselColorTheme {
  const key = vesselType?.toLowerCase() ?? "unknown";
  const theme = getVesselTheme(Number(key), isSelected);
  return isSelected ? { ...theme, stroke: "#ffffff" } : theme;
}

const BASE_ICON_SIZE = 38;
const SELECTED_ICON_SCALE = 1.45;

/**
 * Pure function of only the fields that actually change the rendered
 * icon: type, selection state, bucketed heading, and moving state.
 * Deliberately does NOT take the full `VesselSummary` — that would
 * defeat memoization upstream, since a new vessel object (with the
 * same visual fields) arrives on every websocket tick.
 */
export function createVesselIcon(
  vesselType: string | number,
  isSelected: boolean,
  rotation: number,
  isMoving: boolean,
): DivIcon {
  const theme = resolveVesselTheme(String(vesselType), isSelected);
  const size = Math.round(
    BASE_ICON_SIZE * (isSelected ? SELECTED_ICON_SCALE : 1),
  );

  return L.divIcon({
    html: VesselSVG(theme, isMoving, isSelected, rotation, size),
    className: "vessel-icon-wrapper",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}
