import styled from "styled-components";
import VesselRow from "./vessel-row";
import type { VesselSummary } from "@/entities/vessel/types/vessel.types";

type VesselSidebarProps = {
  vessels: VesselSummary[];
  selectedMmsi: string | null;
  recentlyUpdated: ReadonlySet<string>;
  onVesselSelect: (mmsi: string) => void;
};

export default function VesselList({
  vessels,
  selectedMmsi,
  onVesselSelect,
  recentlyUpdated,
}: VesselSidebarProps) {
  const selected = vessels.find((v) => v.mmsi === selectedMmsi) ?? null;

  return (
    <Wrapper $hasDetail={!!selected}>
      <SectionLabel>Active vessels</SectionLabel>

      <ListWrapper>
        {vessels.length === 0 ? (
          <EmptyMessage>No vessels in range.</EmptyMessage>
        ) : (
          vessels.map((vessel) => (
            <VesselRow
              vessel={vessel}
              selectedMmsi={selectedMmsi}
              onVesselSelect={onVesselSelect}
              recentlyUpdated={recentlyUpdated}
              key={vessel.mmsi}
            />
          ))
        )}
      </ListWrapper>
    </Wrapper>
  );
}

const Wrapper = styled.div<{ $hasDetail: boolean }>`
  flex: ${(p) => (p.$hasDetail ? "0 0 45%" : "1")};
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
  background: var(--color-surface);
`;

const SectionLabel = styled.div`
  padding: var(--space-sm) var(--space-lg) 0.8rem;
  font-size: 1.05rem;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.14em;
  flex-shrink: 0;
`;

const ListWrapper = styled.ul`
  list-style: none;
  overflow-y: auto;
  flex: 1;
  padding: 0 0 var(--space-sm);

  &::-webkit-scrollbar {
    width: 0;
  }
`;

const EmptyMessage = styled.p`
  font-size: 1.2rem;
  color: var(--color-text-muted);
  padding: var(--space-lg) var(--space-lg);
  line-height: 1.6;
`;
