import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { roundBounds } from "../utils/bounds";
import type { BoundsOptions } from "../types/vessel.types";

const PARAM_KEYS = {
  swLng: "swLng",
  swLat: "swLat",
  neLng: "neLng",
  neLat: "neLat",
} as const;

export function useBoundsParam(): {
  bounds: BoundsOptions | null;
  setBounds: (next: BoundsOptions) => void;
  clearBounds: () => void;
} {
  const [searchParams, setSearchParams] = useSearchParams();

  const raw = {
    swLng: searchParams.get(PARAM_KEYS.swLng),
    swLat: searchParams.get(PARAM_KEYS.swLat),
    neLng: searchParams.get(PARAM_KEYS.neLng),
    neLat: searchParams.get(PARAM_KEYS.neLat),
  };

  const parsed =
    raw.swLng !== null &&
    raw.swLat !== null &&
    raw.neLng !== null &&
    raw.neLat !== null
      ? {
          swLng: Number(raw.swLng),
          swLat: Number(raw.swLat),
          neLng: Number(raw.neLng),
          neLat: Number(raw.neLat),
        }
      : null;

  const bounds =
    parsed && Object.values(parsed).every((n) => Number.isFinite(n))
      ? parsed
      : null;

  // Rounded here, once, so the URL and the react-query cache key
  // (which also rounds, in `useVesselsInBounds`) can never disagree.
  const setBounds = useCallback(
    (next: BoundsOptions) => {
      const rounded = roundBounds(next);
      setSearchParams(
        (prev) => {
          const params = new URLSearchParams(prev);
          params.set(PARAM_KEYS.swLng, String(rounded.swLng));
          params.set(PARAM_KEYS.swLat, String(rounded.swLat));
          params.set(PARAM_KEYS.neLng, String(rounded.neLng));
          params.set(PARAM_KEYS.neLat, String(rounded.neLat));
          return params;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const clearBounds = useCallback(() => {
    setSearchParams(
      (prev) => {
        const params = new URLSearchParams(prev);
        params.delete(PARAM_KEYS.swLng);
        params.delete(PARAM_KEYS.swLat);
        params.delete(PARAM_KEYS.neLng);
        params.delete(PARAM_KEYS.neLat);
        return params;
      },
      { replace: true },
    );
  }, [setSearchParams]);

  return { bounds, setBounds, clearBounds };
}
