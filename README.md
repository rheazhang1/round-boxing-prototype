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

## v0.2

- Four destinations: Home, Learn, Train and Growth; profile and devices live in the avatar menu.
- A single daily task connects lesson content, round training and the next recommended step.
- Four expandable learning units, optional comprehension checks and simpler training settings.
- Finished sessions save immediately. Feedback can be skipped and edited later from history.
- Existing browser data and paused workouts are preserved. New visitors start with an empty history.
- Weekly totals exclude sample and accelerated demo records. Free rounds do not count as a specific skill.
- Larger mobile typography and controls; no new external dependencies or tracking.

The v0.2 release was checked with 15 state-transition regression cases and browser flow testing.
