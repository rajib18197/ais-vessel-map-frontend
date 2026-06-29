import { useVessels } from "@/entities/vessel/hooks/use-vessels";
import { useVesselsInBounds } from "@/entities/vessel/hooks/use-vessels-in-bounds";
import type { BoundsOptions } from "@/entities/vessel/types/vessel.types";
import { filterToBounds } from "@/entities/vessel/utils/bounds";
import VesselDetails from "@/features/vessel-details/components/vessel-details";
import FeedHeader from "@/features/vessel-feed/components/feed-header";
import VesselList from "@/features/vessel-feed/components/vessel-list";
import { MapCanvas } from "@/features/vessel-map";
import { useViewMode } from "@/features/vessel-view-mode/hooks/use-view-mode";
import Sidebar from "@/shared/ui/side-bar";
import { useCallback, useState } from "react";
import styled from "styled-components";

export default function VesselTrackerPage() {
  const {
    vessels: liveVessels,
    isLoading,
    isError,
    error,
    recentlyUpdated,
  } = useVessels();

  const [selectedMmsi, setSelectedMmsi] = useState<string | null>(null);

  const [bounds, setBounds] = useState<BoundsOptions | null>(null);
  const { mode } = useViewMode();
  const isBoundsMode = mode === "bounds";

  const boundsQuery = useVesselsInBounds(bounds, isBoundsMode && isLoading);

  const handleBoundsChange = useCallback((next: BoundsOptions) => {
    setBounds(next);
  }, []);

  const vessels = !isBoundsMode
    ? liveVessels
    : isLoading
      ? (boundsQuery.data ?? [])
      : bounds
        ? filterToBounds(liveVessels, bounds)
        : liveVessels;

  const selected = vessels.find((v) => v.mmsi === selectedMmsi) ?? null;

  if (isLoading && !isBoundsMode) {
    return <CenteredMessage>Connecting to AIS feed…</CenteredMessage>;
  }

  if (isError) {
    return (
      <ErrorMessage>
        <span>Failed to load vessels</span>
        <ErrorDetail>{error?.message ?? "Unknown error"}</ErrorDetail>
      </ErrorMessage>
    );
  }

  return (
    <Wrapper>
      <Sidebar>
        <FeedHeader itemCount={liveVessels.length} />

        <VesselList
          vessels={vessels}
          onVesselSelect={setSelectedMmsi}
          recentlyUpdated={recentlyUpdated}
          selectedMmsi={selectedMmsi}
        />

        {selected && <VesselDetails summary={selected} />}
      </Sidebar>

      <MapCanvas
        vessels={vessels}
        selectedMmsi={selectedMmsi}
        onVesselSelect={setSelectedMmsi}
        onBoundsChange={isBoundsMode ? handleBoundsChange : undefined}
      />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 35rem 1fr;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
`;

const CenteredMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  background: #0e1117;
  font-family: "Share Tech Mono", "JetBrains Mono", monospace;
  font-size: 1.4rem;
  color: #4a6580;
  letter-spacing: 0.06em;
`;

const ErrorMessage = styled(CenteredMessage)`
  flex-direction: column;
  gap: 0.8rem;
  color: #f87171;
`;

const ErrorDetail = styled.span`
  font-size: 1.1rem;
  color: #4a6580;
`;
