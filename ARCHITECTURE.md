# Architecture

## Layer Structure

The codebase is divided into five layers. Each layer can only import from layers **below** it — never sideways, never upward.

```
app → pages → features → entities → shared
```

| Layer      | Path            | What goes here                                       |
| ---------- | --------------- | ---------------------------------------------------- |
| `app`      | `src/app/`      | Router, providers, app-level wiring                  |
| `pages`    | `src/pages/`    | Route components — orchestration only, no logic      |
| `features` | `src/features/` | Self-contained feature modules                       |
| `entities` | `src/entities/` | Domain types, API calls, domain hooks                |
| `shared`   | `src/shared/`   | Generic utils, UI primitives — zero domain knowledge |

This is enforced by `eslint-plugin-boundaries`. A lint error fires if you break the hierarchy.

---

## Import Rules

**Cross-feature imports must go through the barrel (`index.ts`):**

```ts
// ✅ Correct — consuming a feature from outside
import { VesselMap } from "@/features/vessel-map";

// ❌ Wrong — reaching into another feature's internals
import { MapCanvas } from "@/features/vessel-map/components/map-canvas";
```

**Inside a feature, skip the barrel and import directly:**

```ts
// ✅ Correct — internal import within the same feature
import { MapCanvas } from "../components/map-canvas";

// ❌ Wrong — a file should never import through its own barrel
import { VesselMap } from "@/features/vessel-map";
```

---

## Feature Structure

Every feature follows the same shape:

```
features/
  vessel-map/
    components/   ← UI components (internal)
    hooks/        ← feature-local hooks (internal)
    constants/    ← feature-local constants (internal)
    index.ts      ← public surface only
```

The `index.ts` barrel only exports what other layers actually need. Internal components and hooks are never exported from it.

```ts
// features/vessel-map/index.ts

// ✅ Export only the public surface
export { VesselMap } from "./components/map-canvas";
export type { VesselMapProps } from "./components/map-canvas";

// ❌ Never export internals
// export { MapAutoPan } from "./components/map-auto-pan";
```

---

## Adding a New Feature

1. Create `src/features/your-feature/`
2. Follow the folder structure above
3. Add an `index.ts` that exports only the public surface
4. Add the pattern to `eslint.config.js` under `boundaries/elements` if needed

---

## What Lives Where — Quick Reference

**Not sure where something goes? Ask these questions in order:**

- Is it reusable with zero domain knowledge? → `shared/`
- Is it a domain type, API call, or domain hook used across features? → `entities/`
- Is it scoped to one feature? → inside that `features/your-feature/`
- Is it composing features into a page? → `pages/`
- Is it a provider or router? → `app/`
