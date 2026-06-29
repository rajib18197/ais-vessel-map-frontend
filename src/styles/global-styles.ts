import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
:root {
  --font-family-body: "Josefin Sans", sans-serif;
  --font-family-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;

  --space-xxs: 0.4rem;
  --space-xs: 0.8rem;
  --space-sm: 1.2rem;
  --space-md: 1.6rem;
  --space-lg: 2.4rem;
  --space-xl: 3.2rem;
  --space-xxl: 4.8rem;

  --radius-tiny: 3px;
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 18px;
  --radius-xl: 24px;

  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.16);
  --shadow-md: 0 12px 32px rgba(0, 0, 0, 0.18);
  --shadow-lg: 0 20px 48px rgba(0, 0, 0, 0.22);

  --transition-fast: 180ms ease;
  --transition-slow: 300ms ease;

  --color-bg: #08131f;
  --color-surface: #0f1b2c;
  --color-surface-strong: #121e33;
  --color-surface-muted: #111827;
  --color-text: #e9eff7;
  --color-text-muted: #94a3b8;
  --color-text-subtle: #cbd5e1;
  --color-border: rgba(148, 163, 184, 0.18);
  --color-border-strong: rgba(148, 163, 184, 0.28);
  --color-accent: #00b4d8;
  --color-accent-soft: rgba(0, 180, 216, 0.12);
  --color-accent-strong: #22c4ec;
  --color-accent-hover: #0ea1c7;
  --color-error: #f87171;
  --color-error-soft: rgba(248, 113, 113, 0.15);
  --color-warning: #f59e0b;
  --color-success: #22c55e;

  --color-grey-0: #18212f;
  --color-grey-50: #111827;
  --color-grey-100: #1f2937;
  --color-grey-200: #374151;
  --color-grey-300: #4b5563;
  --color-grey-400: #6b7280;
  --color-grey-500: #9ca3af;
  --color-grey-600: #d1d5db;
  --color-grey-700: #e5e7eb;
  --color-grey-800: #f3f4f6;
  --color-grey-900: #f9fafb;

  --color-red-100: #fee2e2;
  --color-red-700: #b91c1c;
  --color-red-800: #991b1b;

  --color-brand-50: #dbf5ff;
  --color-brand-100: #baf0ff;
  --color-brand-200: #84dcff;
  --color-brand-500: #00b4d8;
  --color-brand-600: #00a1c2;
  --color-brand-700: #0086a1;
  --color-brand-800: #0f5780;
  --color-brand-900: #10455f;

  --backdrop-color: rgba(0, 0, 0, 0.28);
  --image-grayscale: 0;
  --image-opacity: 1;
}

:root.light-mode {
  --color-bg: #f8fafc;
  --color-surface: #ffffff;
  --color-surface-strong: #f3f4f6;
  --color-surface-muted: #e5e7eb;
  --color-text: #0f172a;
  --color-text-muted: #475569;
  --color-text-subtle: #64748b;
  --color-border: rgba(148, 163, 184, 0.23);
  --color-border-strong: rgba(100, 116, 139, 0.24);
  --backdrop-color: rgba(255, 255, 255, 0.7);
}

*,
*::before,
*::after {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
  transition: background-color var(--transition-slow), color var(--transition-slow), border-color var(--transition-slow);
}

html {
  font-size: 62.5%;

  @media (max-width: 78em) {
    font-size: 56%;
  }

  @media (max-width: 59em) {
    font-size: 50%;
  }
}

body {
  min-height: 100vh;
  font-family: var(--font-family-body);
  font-weight: 400;
  color: var(--color-text);
  background: radial-gradient(circle at top left, rgba(0, 180, 216, 0.14), transparent 22%), radial-gradient(circle at bottom right, rgba(99, 176, 255, 0.08), transparent 24%), var(--color-bg);
  transition: color var(--transition-slow), background-color var(--transition-slow);
  line-height: 1.5;
  font-size: 1.6rem;
}

input,
button,
textarea,
select {
  font: inherit;
  color: inherit;
}

button {
  cursor: pointer;
}

*:disabled {
  cursor: not-allowed;
}

select:disabled,
input:disabled {
  background-color: var(--color-surface-muted);
  color: var(--color-text-muted);
}

input:focus,
button:focus,
textarea:focus,
select:focus {
  outline: 2px solid var(--color-brand-600);
  outline-offset: 2px;
}

button:has(svg) {
  line-height: 0;
}

a {
  color: inherit;
  text-decoration: none;
}

ul {
  list-style: none;
}

p,
h1,
h2,
h3,
h4,
h5,
h6 {
  overflow-wrap: break-word;
  hyphens: auto;
}

h1,
h2,
p {
  text-rendering: optimizeLegibility;
}

img {
  filter: grayscale(var(--image-grayscale)) opacity(var(--image-opacity));
  max-width: 100%;
}

.leaflet-container {
  height: 100%;
  width: 100%;
  background: var(--color-bg);
}

.leaflet-marker-icon {
  transition: transform 0.4s ease;
}
`;

export default GlobalStyles;
