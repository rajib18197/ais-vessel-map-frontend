import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Root from "./app/root.tsx";
import { ErrorBoundary } from "react-error-boundary";
import GlobalErrorFallback from "./shared/ui/global-error-fallback.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary FallbackComponent={GlobalErrorFallback}>
      <Root />
    </ErrorBoundary>
  </StrictMode>,
);
