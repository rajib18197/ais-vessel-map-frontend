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
  0%   { border-left-color: #00b4d8; background: rgba(0, 180, 216, 0.12); }
  100% { border-left-color: transparent; background: transparent; }
`;

const Wrapper = styled.li<{
  $isSelected: boolean;
  $isUpdated: boolean;
}>`
  padding: 1.2rem 2.8rem;
  cursor: pointer;
  border-left: 3px solid transparent;
  transition: background 0.15s;

  /* Selected state */
  ${(p) =>
    p.$isSelected &&
    css`
      border-left-color: #00b4d8;
      background: rgba(0, 180, 216, 0.07);
    `}

  /* Radar return pulse on live update */
  ${(p) =>
    p.$isUpdated &&
    !p.$isSelected &&
    css`
      animation: ${radarReturn} 0.8s ease-out forwards;
    `}

  &:hover {
    background: rgba(0, 180, 216, 0.05);
  }
`;

const VesselName = styled.p`
  font-size: 1.35rem;
  font-weight: 400;
  color: hsl(259deg 100% 71%/1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
`;

const VesselMeta = styled.p`
  font-size: 1.15rem;
  color: hsl(210deg 10% 90%/1);
  margin-top: 0.2rem;
  display: flex;
  gap: 1.2rem;
`;
