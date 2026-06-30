import { useVessels } from "@/entities/vessel/hooks/use-vessels";
import { useVesselsInBounds } from "@/entities/vessel/hooks/use-vessels-in-bounds";
import type {
  BoundsOptions,
  VesselSummary,
} from "@/entities/vessel/types/vessel.types";
import { filterToBounds } from "@/entities/vessel/utils/bounds";
import { useViewMode } from "@/features/vessel-view-mode/hooks/use-view-mode";
import { useCallback, useState } from "react";

export type UseVesselTrackerResult = {
  vessels: VesselSummary[];
  selectedMmsi: string | null;
  selected: VesselSummary | null;
  recentlyUpdated: ReadonlySet<string>;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
  isBoundsMode: boolean;
  onVesselSelect: (mmsi: string | null) => void;
  onBoundsChange: (bounds: BoundsOptions) => void;
};

export function useVesselTracker(): UseVesselTrackerResult {
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

  const vessels = deriveVessels({
    isBoundsMode,
    isLoading,
    liveVessels,
    boundsData: boundsQuery.data,
    bounds,
  });

  /*
    I structured this way simply because it has to do with one of the most important mental models I've learned, when it comes to working with React: the principle of least privilege.

    When we give the consumer a state-setter function, we grant it so much more power than that. For example, it can erase all of the current items:

    By sharing `onVesselSelect` instead of `setSelectedMmsi` we expose less power to the consumer. We're in total control of the state transition. 
    
    I think this will truely shine on scale. what if we were working on a codebase with hundreds of thousands of lines of code? If we were 1 of 50 developers on the project? 
  */
  const onVesselSelect = useCallback((mmsi: string | null) => {
    setSelectedMmsi(mmsi);
  }, []);

  const onBoundsChange = useCallback(
    (next: BoundsOptions) => {
      if (isBoundsMode) setBounds(next);
    },
    [isBoundsMode],
  );

  return {
    vessels,
    selectedMmsi,
    selected: vessels.find((v) => v.mmsi === selectedMmsi) ?? null,
    recentlyUpdated,
    isLoading,
    isError,
    errorMessage: error?.message ?? null,
    isBoundsMode,
    onVesselSelect: onVesselSelect,
    onBoundsChange: onBoundsChange,
  };
}

type DeriveVesselsParams = {
  isBoundsMode: boolean;
  isLoading: boolean;
  liveVessels: VesselSummary[];
  boundsData: VesselSummary[] | undefined;
  bounds: BoundsOptions | null;
};

function deriveVessels({
  isBoundsMode,
  isLoading,
  liveVessels,
  boundsData,
  bounds,
}: DeriveVesselsParams): VesselSummary[] {
  if (!isBoundsMode) return liveVessels;
  if (isLoading) return boundsData ?? [];
  if (bounds) return filterToBounds(liveVessels, bounds);
  return liveVessels;
}
