type TooltipRowProps = {
  label: string;
  value: string;
  withBorder?: boolean;
};

export default function TooltipRow({
  label,
  value,
  withBorder = true,
}: TooltipRowProps) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: "2rem",
        ...(withBorder && {
          borderBottom: "1px solid rgba(148, 163, 184, 0.18)",
          paddingBottom: "4px",
        }),
      }}
    >
      <span style={{ color: "var(--color-text-muted)" }}>{label}</span>
      <span style={{ color: "var(--color-text)", fontWeight: 500 }}>
        {value}
      </span>
    </div>
  );
}
