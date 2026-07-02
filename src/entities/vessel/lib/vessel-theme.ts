export const FALLBACK_CENTER: [number, number] = [32.72, -117.23];
export const FALLBACK_ZOOM = 11;
export const FIT_BOUNDS_PADDING: [number, number] = [50, 50];

export const TILE_LAYER_URL =
  "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png" as const;

export const TILE_LAYER_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' as const;

export type VesselCategory =
  | "cargo"
  | "tanker"
  | "fishing"
  | "passenger"
  | "sailing"
  | "unknown";

type VesselTypeEntry = {
  readonly min: number;
  readonly max: number;
  readonly category: VesselCategory;
  readonly label: string;
};

/**
 * Single source of truth for AIS "Type of ship and cargo" codes
 * (ITU-R M.1371, field decoded server-side as `typeAndCargo` — see
 * ais-feed-decoder.service.ts — and passed through to the client
 * untouched as `vesselType`). Every consumer of vessel type — marker
 * color (category) and tooltip text (label) — reads the same row here,
 * so a category and its label can never drift out of sync the way two
 * separately maintained lookup tables did before.
 *
 * Ranges below are not exhaustive of the full ITU-R table — only the
 * bands that map to a distinct marker color are broken out explicitly;
 * everything else (including genuinely reserved/unassigned codes)
 * falls through to "unknown". Verify against the ITU-R M.1371 Table 50
 * spec before relying on any single-code entry in production.
 */
const VESSEL_TYPE_TABLE: readonly VesselTypeEntry[] = [
  { min: 0, max: 0, category: "unknown", label: "Unknown" },
  { min: 30, max: 30, category: "fishing", label: "Fishing" },
  { min: 31, max: 32, category: "unknown", label: "Tug / Tow" },
  { min: 36, max: 36, category: "sailing", label: "Sailing" },
  { min: 37, max: 37, category: "unknown", label: "Pleasure Craft" },
  { min: 60, max: 69, category: "passenger", label: "Passenger" },
  { min: 70, max: 79, category: "cargo", label: "Cargo" },
  { min: 80, max: 89, category: "tanker", label: "Tanker" },
];

function findVesselTypeEntry(
  vesselType: number | null | undefined,
): VesselTypeEntry | null {
  if (vesselType == null) return null;
  return (
    VESSEL_TYPE_TABLE.find((e) => vesselType >= e.min && vesselType <= e.max) ??
    null
  );
}

export function getVesselCategory(
  vesselType: number | null | undefined,
): VesselCategory {
  return findVesselTypeEntry(vesselType)?.category ?? "unknown";
}

export function resolveTypeName(vesselType: number | null | undefined): string {
  return (
    findVesselTypeEntry(vesselType)?.label ??
    (vesselType != null ? `Type ${vesselType}` : "Unknown")
  );
}

type VesselTheme = { fill: string; stroke: string; deck: string };

export const VESSEL_COLOR_THEMES: Record<VesselCategory, VesselTheme> = {
  cargo: { fill: "#185FA5", stroke: "#85B7EB", deck: "#B5D4F4" },
  tanker: { fill: "#BA7517", stroke: "#FAC775", deck: "#FAEEDA" },
  fishing: { fill: "#0F6E56", stroke: "#5DCAA5", deck: "#9FE1CB" },
  passenger: { fill: "#534AB7", stroke: "#AFA9EC", deck: "#EEEDFE" },
  sailing: { fill: "#3B6D11", stroke: "#97C459", deck: "#C0DD97" },
  unknown: { fill: "#5F5E5A", stroke: "#B4B2A9", deck: "#D3D1C7" },
};

export function getVesselTheme(
  vesselType: number | null | undefined,
  isSelected: boolean,
): VesselTheme {
  const category = getVesselCategory(vesselType);
  const theme = VESSEL_COLOR_THEMES[category];
  if (isSelected) return { ...theme, stroke: "#ffffff" };
  return theme;
}
