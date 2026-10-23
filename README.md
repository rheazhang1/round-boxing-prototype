# ROUND boxing skill-tree prototype

Mobile prototype: Skill Tree, Training, AI Coach and Growth.

## v0.3

- The first path connects stance and balance, jab and return, moving jab, and distance control.
- Each node contains knowledge, an optional understanding check, two practice options, observation criteria, reference links and scope limits.
- Understanding, timed practice and conditional validation are distinct. Lighting a node requires a manually reported observation, context, source and attestation. Coach feedback is labeled as user-transcribed, with identity unverified.
- Validation can be withdrawn without removing training history. Nodes are always browsable; connections are suggested prerequisites.
- Training preserves the chosen drill, timer state and automatic session records. Accelerated demo sessions cannot be selected as validation evidence.
- AI Coach is a working local keyword retrieval prototype over four cards, not a connected LLM or video assessor. It makes no external AI requests.
- Existing browser profiles, old lesson completion, sessions and drafts are preserved. Old lesson completion does not light the new skills. No daily-plan dashboard.
- Progress and questions remain in localStorage on the visitor's browser. No personal training data or credentials are included in this repository.

## Static deployment

Node.js 18+, no dependencies. Build: `npm run build`. Output: `dist`.
Hash routes work on static hosting. The build copies index.html, styles.css, data.js and app.js.
The existing public app URL remains https://roundboxing-10k3h3dm.maozi.io/ .

## Verification

27 local state regression tests passed. Browser checks covered 390px and 320px layouts, all four nodes, eight drills, twelve observation criteria, a full two-round timer run (60 active seconds), form validation, refresh persistence, growth records and source-linked coach retrieval. No browser script errors were observed.

The educational cards and observation rubric are prototype content pending coach review, not a governing-body certification. Hardware and video capture are not implemented.
