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

// dist/index.html                             0.81 kB │ gzip:  0.39 kB
// dist/assets/vendor-leaflet-vh-t_kPv.css    15.09 kB │ gzip:  6.36 kB
// dist/assets/rolldown-runtime-Bh1tDfsg.js    0.56 kB │ gzip:  0.36 kB
// dist/assets/vessel-map-0GnDB7el.js          7.27 kB │ gzip:  3.21 kB
// dist/assets/vendor-query-BZQ_P8SW.js       33.66 kB │ gzip: 10.17 kB
// dist/assets/vendor-zod-Cbyvp0Nm.js         69.68 kB │ gzip: 18.71 kB
// dist/assets/vendor-leaflet-oOTU9J22.js    164.17 kB │ gzip: 48.41 kB
// dist/assets/index-CDY6592P.js             279.94 kB │ gzip: 91.36 kB
