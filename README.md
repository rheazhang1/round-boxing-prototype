# ROUND boxing skill-tree prototype

Mobile prototype: Skill Tree, Training, AI Coach and Growth.

## v0.4

- The home screen shows the development framework immediately: twelve common foundations, four optional branches, style integration, and supporting physical/decision-making abilities.
- Foundations cover preparation, stance, footwork, basic punches, defense, combinations, moving jab and distance judgment. Every published card has knowledge, an optional quiz, practice and conditional observation criteria.
- All branches can be previewed from the beginning. Visitors can bookmark interest early, then select any primary branch once all twelve foundation knowledge cards are marked understood. Switching branches preserves progress and evidence.
- Branches are combination attack, defense/counter, movement/distance and pressure. Each currently has one published introductory card and two clearly labeled planned topics. The framework does not imply the advanced curriculum is complete.
- The selected branch appears in Training and sets the current focus. Completing knowledge, practicing and lighting a skill remain distinct. Lighting requires a manual observation, conditions, source and attestation, not a timer or course count.
- AI Coach is local keyword retrieval over sixteen published cards. It is not a connected LLM or video assessor and makes no external AI requests.
- Existing profiles, skill progress, sessions and validation records are preserved. Progress stays in localStorage on the visitor's browser. No personal training data or credentials are included in this repository.

## Static deployment

Node.js 18+, no dependencies. Build: `npm run build`. Output: `dist`.
Hash routes work on static hosting. The build copies index.html, styles.css, data.js and app.js.
Public app URL: https://roundboxing-10k3h3dm.maozi.io/ .

## Verification

32 local state regression tests passed, including all-foundation gating, early interest, branch switching, reload persistence, retained evidence, and existing timer/validation behavior. Mobile browser checks covered the visible map, gated/unlocked selection, a complete twelve-card understanding flow, branch switching, training linkage, and 390px/320px layouts. No script errors observed during these checks.

Cards and observation rubrics are original prototype content pending coach review, not a governing-body certification. Hardware and video capture are not implemented.
