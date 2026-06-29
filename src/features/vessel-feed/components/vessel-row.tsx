import styled, { css, keyframes } from "styled-components";
import type { VesselSummary } from "@/entities/vessel/types/vessel.types";

type VesselRowProps = {
  vessel: VesselSummary;
  selectedMmsi: string | null;
  recentlyUpdated: ReadonlySet<string>;
  onVesselSelect: (mmsi: string) => void;
};

export default function VesselRow({
  vessel,
  selectedMmsi,
  recentlyUpdated,
  onVesselSelect,
}: VesselRowProps) {
  const isSelected = vessel.mmsi === selectedMmsi;
  const isUpdated = recentlyUpdated.has(vessel.mmsi);
  const sog = vessel.sog != null ? `${vessel.sog.toFixed(1)} kn` : null;

  return (
    <Wrapper
      $isSelected={isSelected}
      $isUpdated={isUpdated}
      onClick={() => onVesselSelect(vessel.mmsi)}
    >
      <VesselName>{vessel.name ?? "Unknown vessel"}</VesselName>
      <VesselMeta>
        <span>{vessel.mmsi}</span>
        {sog && <span>{sog}</span>}
      </VesselMeta>
    </Wrapper>
  );
}

const radarReturn = keyframes`
  0%   { border-left-color: var(--color-accent); background: var(--color-accent-soft); }
  100% { border-left-color: transparent; background: transparent; }
`;

const Wrapper = styled.li<{
  $isSelected: boolean;
  $isUpdated: boolean;
}>`
  padding: var(--space-sm) var(--space-lg);
  cursor: pointer;
  border-left: 3px solid transparent;
  transition: background var(--transition-fast);

  ${(p) =>
    p.$isSelected &&
    css`
      border-left-color: var(--color-accent);
      background: rgba(0, 180, 216, 0.08);
    `}

  ${(p) =>
    p.$isUpdated &&
    !p.$isSelected &&
    css`
      animation: ${radarReturn} 0.8s ease-out forwards;
    `}

  &:hover {
    background: rgba(0, 180, 216, 0.06);
  }
`;

const VesselName = styled.p`
  font-size: 1.35rem;
  font-weight: 500;
  color: var(--color-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
`;

const VesselMeta = styled.p`
  font-size: 1.1rem;
  color: var(--color-text-muted);
  margin-top: 0.3rem;
  display: flex;
  gap: 1.2rem;
`;
