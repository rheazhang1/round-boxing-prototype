# ROUND boxing mobile prototype

A Chinese mobile interaction prototype connecting learning, round training,
self-reflection and growth records. Data is saved in the current browser.
Lessons are examples; hardware, recording and camera features are simulated.

## Static deployment

- Node.js 18 or later; no package installation required.
- Build command: `npm run build`
- Output directory: `dist`
- Root directory: `.`
- Entry point: `index.html`
- Hash-based routing supports static hosts without rewrite rules.

The build copies the four application assets unchanged. No secrets, cloud
credentials, user activity records or external asset dependencies are included.
