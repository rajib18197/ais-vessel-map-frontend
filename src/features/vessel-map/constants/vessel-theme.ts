export const VESSEL_TYPE_LABELS: Record<number, string> = {
  0: "Unknown",
  6: "Passenger",
  31: "Tug/Tow",
  36: "Sailing",
  37: "Pleasure",
  38: "Reserved",
};

type VesselCategory =
  | "cargo"
  | "tanker"
  | "fishing"
  | "passenger"
  | "sailing"
  | "unknown";

export const VESSEL_TYPE_RANGES: ReadonlyArray<{
  readonly min: number;
  readonly max: number;
  readonly category: VesselCategory;
}> = [
  { min: 30, max: 30, category: "fishing" },
  { min: 36, max: 36, category: "sailing" },
  { min: 60, max: 69, category: "passenger" },
  { min: 70, max: 79, category: "cargo" },
  { min: 80, max: 89, category: "tanker" },
];

export function getVesselCategory(
  vesselType: number | null | undefined,
): VesselCategory {
  if (vesselType == null) return "unknown";

  for (const range of VESSEL_TYPE_RANGES) {
    if (vesselType >= range.min && vesselType <= range.max) {
      return range.category;
    }
  }

  return "unknown";
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
