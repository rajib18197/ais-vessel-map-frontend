import VesselDetails from "@/features/vessel-details/components/vessel-details";
import FeedHeader from "@/features/vessel-feed/components/feed-header";
import VesselList from "@/features/vessel-feed/components/vessel-list";
import Sidebar from "@/shared/ui/side-bar";
import styled from "styled-components";
import { useVesselTracker } from "../hooks/use-vessel-tracker";
import { lazy, Suspense } from "react";

// Keep the map lazy-loaded because Leaflet is one of the largest bundles.
const MapCanvas = lazy(() =>
  import("@/features/vessel-map").then((module) => ({
    default: module.MapCanvas,
  })),
);

export default function VesselTracker() {
  const {
    vessels,
    selected,
    selectedMmsi,
    recentlyUpdated,
    isLoading,
    isError,
    errorMessage,
    isBoundsMode,
    bounds,
    onVesselSelect,
    onBoundsChange,
  } = useVesselTracker();

  // Bounds mode keeps showing stale data while a new bounds query loads.
  if (isLoading && !isBoundsMode) {
    return <CenteredMessage>Connecting to AIS feed…</CenteredMessage>;
  }

  if (isError) {
    return (
      <ErrorMessage>
        <span>Failed to load vessels</span>
        <ErrorDetail>{errorMessage ?? "Unknown error"}</ErrorDetail>
      </ErrorMessage>
    );
  }

  return (
    <Wrapper>
      <Sidebar>
        {/*
          === Interface Segregation Principle in action ===
          I could give the `vessels` data here to `FeedHeader` component but chose not to because:
          1) `vessels` seems like too much of a high level props for such a low level component

          2) Let's suppose we wanna change how `vessel` is structured, may be we wanna change `lastSeen' to `lastUpdated` so that it's consistent with other objects in our data model. Now we have to wonder:
             - Does this component depend on that prop we just changed?!?! Typescript here helps but for that we have to dig into the component.
             - By passing only the `itemCount` it's very very clear that we're only using a single property on this data and makes it easier to tell at a glance of what this component is doing.   
        */}
        <FeedHeader itemCount={vessels.length} />

        <VesselList
          vessels={vessels}
          onVesselSelect={onVesselSelect}
          recentlyUpdated={recentlyUpdated}
          selectedMmsi={selectedMmsi}
        />

        {selected && <VesselDetails summary={selected} />}
      </Sidebar>

      <Suspense fallback={<MapPlaceholder />}>
        <MapCanvas
          vessels={vessels}
          selectedMmsi={selectedMmsi}
          onVesselSelect={onVesselSelect}
          onBoundsChange={onBoundsChange}
          isBoundsMode={isBoundsMode}
          bounds={bounds}
        />
      </Suspense>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 35rem 1fr;
  min-height: 100vh;
  width: 100vw;
  overflow: hidden;
  background: var(--color-bg);
`;

const CenteredMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  background: var(--color-surface);
  color: var(--color-text-muted);
  font-size: 1.4rem;
  letter-spacing: 0.06em;
`;

const ErrorMessage = styled(CenteredMessage)`
  flex-direction: column;
  gap: 0.8rem;
  color: var(--color-error);
`;

const ErrorDetail = styled.span`
  font-size: 1.1rem;
  color: var(--color-text-muted);
`;

const MapPlaceholder = styled.div`
  height: 100vh;
  width: 100%;
  background: #0e1117;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4a6580;
  font-size: 1.2rem;
  letter-spacing: 0.06em;
`;
