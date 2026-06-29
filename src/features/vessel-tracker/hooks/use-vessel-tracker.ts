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
    onVesselSelect: setSelectedMmsi,
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
