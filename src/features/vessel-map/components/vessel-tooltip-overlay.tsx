import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type RefObject,
} from "react";
import type L from "leaflet";
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  arrow,
  FloatingPortal,
  FloatingArrow,
  type VirtualElement,
} from "@floating-ui/react";
import type { VesselSummary } from "@/entities/vessel/types/vessel.types";
import { VesselTooltip } from "./vessel-tooltip";

const TOOLTIP_OFFSET_PX = 16;
const VIEWPORT_PADDING_PX = 8;
const TOOLTIP_BG = "#0f172a"; // match your card background
const EMPTY_RECT = new DOMRect();

type VesselTooltipOverlayProps = {
  readonly vessel: VesselSummary | null;
  readonly markersRef: RefObject<Map<string, L.Marker>>;
};

export function VesselTooltipOverlay({
  vessel,
  markersRef,
}: VesselTooltipOverlayProps) {
  // Store the arrow element for Floating UI positioning.
  const [arrowElement, setArrowElement] = useState<SVGSVGElement | null>(null);

  const mmsi = vessel?.mmsi ?? null;

  // Read the latest marker element instead of keeping a stale DOM reference.
  const reference: VirtualElement | null = useMemo(() => {
    if (mmsi === null) return null;
    return {
      getBoundingClientRect: () => {
        const el = markersRef.current.get(mmsi)?.getElement();
        return el?.getBoundingClientRect() ?? EMPTY_RECT;
      },
      get contextElement() {
        return markersRef.current.get(mmsi)?.getElement();
      },
    };
  }, [mmsi, markersRef]);

  const { refs, floatingStyles, context } = useFloating({
    // Show the tooltip when a vessel is being hovered.
    open: mmsi !== null,

    placement: "top",
    middleware: [
      offset(TOOLTIP_OFFSET_PX),

      // Only flip above or below the marker.
      flip({ fallbackPlacements: ["bottom"], padding: VIEWPORT_PADDING_PX }),

      // Keep the tooltip inside the viewport.
      shift({ padding: VIEWPORT_PADDING_PX }),

      arrow({ element: arrowElement ?? undefined }),
    ],

    // Keep the tooltip position in sync while the map moves or zooms.
    whileElementsMounted: (referenceEl, floatingEl, update) =>
      autoUpdate(referenceEl, floatingEl, update, { animationFrame: true }),
  });

  // Connect the current virtual reference to Floating UI.
  useEffect(() => {
    refs.setReference(reference);
  }, [reference, refs]);

  // Wrap setFloating so it runs through React's ref callback lifecycle.
  const attachFloatingNode = useCallback(
    (node: HTMLElement | null) => {
      refs.setFloating(node);
    },
    [refs],
  );

  if (!vessel) return null;

  return (
    <FloatingPortal>
      <div
        ref={attachFloatingNode}
        style={{ ...floatingStyles, zIndex: 1000, pointerEvents: "none" }}
      >
        <div
          style={{
            background: TOOLTIP_BG,
            borderRadius: "12px",
            padding: "14px 16px",
            boxShadow: "0 12px 32px rgba(0, 0, 0, 0.45)",
          }}
        >
          <VesselTooltip vessel={vessel} />
        </div>
        <FloatingArrow
          ref={setArrowElement}
          context={context}
          fill={TOOLTIP_BG}
        />
      </div>
    </FloatingPortal>
  );
}
