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

// dist/index.html                             1.11 kB │ gzip:  0.49 kB
// dist/assets/vendor-leaflet-vh-t_kPv.css    15.09 kB │ gzip:  6.36 kB
// dist/assets/rolldown-runtime-Bh1tDfsg.js    0.56 kB │ gzip:  0.36 kB
// dist/assets/vendor-query-S8_okLn-.js       33.69 kB │ gzip: 10.18 kB
// dist/assets/vessel-map-D2oHdZDP.js         41.25 kB │ gzip: 16.02 kB
// dist/assets/vendor-zod-Cbyvp0Nm.js         69.68 kB │ gzip: 18.71 kB
// dist/assets/vendor-leaflet-D_5jmO2b.js    163.27 kB │ gzip: 48.12 kB
// dist/assets/index-DzxVK-xo.js             281.13 kB │ gzip: 91.65 kB
