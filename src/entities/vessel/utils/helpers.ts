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

export function fmtSog(sog: number | null | undefined): string {
  return fmt(sog, 1, "kn");
}

export function fmtTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

// formatSpeed/formatLastSeen are aliases of fmtSog/fmtTime used by
// vessel-tooltip.tsx. Kept as thin wrappers rather than duplicated logic,
// so there is exactly one implementation each — only the exported name
// differs, for the two call sites that adopted different naming.
export function formatSpeed(sog: number | null | undefined): string {
  return fmtSog(sog);
}

export function formatLastSeen(lastSeen: string): string {
  return fmtTime(lastSeen);
}
