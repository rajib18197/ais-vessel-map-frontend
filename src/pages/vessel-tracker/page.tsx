import { VesselTracker } from "@/features/vessel-tracker";
import ErrorFallback from "@/shared/ui/feature-error-fallback";
import { ErrorBoundary } from "react-error-boundary";

export default function VesselTrackerPage() {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => window.location.replace("/")}
    >
      <VesselTracker />
    </ErrorBoundary>
  );
}
