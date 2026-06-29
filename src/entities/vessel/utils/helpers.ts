export const VESSEL_TYPE_LABELS: Record<number, string> = {
  0: "Unknown",
  6: "Passenger",
  31: "Tug / Tow",
  36: "Sailing",
  37: "Pleasure",
  38: "Reserved",
};

export function fmt(
  value: number | null | undefined,
  decimals = 1,
  unit = "",
): string {
  if (value == null) return "—";
  return `${value.toFixed(decimals)}${unit ? " " + unit : ""}`;
}

export function fmtCoord(value: number | null | undefined): string {
  if (value == null) return "—";
  return value.toFixed(5);
}

export function fmtType(type: number | null | undefined): string {
  if (type == null) return "—";
  return VESSEL_TYPE_LABELS[type] ?? `Type ${type}`;
}

export function fmtTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function fmtSog(sog: number | null | undefined): string {
  return fmt(sog, 1, "kn");
}
