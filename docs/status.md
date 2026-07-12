# Project Status

Last updated: 2026-07-12

## Current Milestone

**Sanctioned Live — implemented from July 12 real-provider request.**

The client-only Exhibition experience now covers the sourced roster, shared
event system, mechanically distinct arenas and fighters, interactive broadcast,
vector-arcade presentation, post-fight storytelling, and local competition
programs. Sanctioned Live now adds an isolated real-provider path without
changing the free Exhibition contract.

| Feature | Status | Notes |
|---|---|---|
| Landing Page | 🟢 Implemented | Cabinet hero, ticker, Exhibition, Fight Programs, and Hall of Shame |
| App Shell | 🟢 Implemented | Persistent menu, compact settings, fixed viewport, and notification rail |
| Arcade Spectacle | 🟢 Implemented | Collision-free lobby actions, 19-fighter portrait library, portrait face-off, and interactive verdict show |
| Fighter Roster | 🟢 Implemented | Dated tiers, provenance, clearance trials, GPT-5.6 modes, legacy snapshots |
| Arena Select | 🟢 Implemented | Five rule profiles, animated Killbox, Reduced Effects fallback, Freestyle mandate |
| Fight | 🟢 Implemented | Fixed broadcast frame, independent transcript scroll, smooth reveal, quiet notification and cost rails |
| Fight Event System | 🟢 Implemented | Seeded schedule, stable IDs, event scoring, accessibility copy, stored timeline |
| Commission | 🟢 Implemented | Disclosed, optional, low-frequency, recoverable, venue-aware rulings |
| Commentary | 🟢 Implemented | Local event-driven booth with duplicate suppression and independent toggle |
| Audience Interventions | 🟢 Implemented | Six measurable actions, two charges, idempotent event path |
| Referee | 🟢 Implemented | Five categories, event/arena modifiers, explicit draws, judge cards |
| Post-Fight | 🟢 Implemented | Receipt, highlights, timeline, signature replay, sharing, rematch paths |
| Leaderboard | 🟢 Implemented | Local W/L/D rankings, awards, H2H, historical snapshots, recent tapes |
| Competition Modes | 🟢 Implemented | Best-of-three, provider cards, four-fighter bracket, daily matchup, resume |
| Vector-Arcade Visual System | 🟢 Implemented | Fixed cabinet, readable type floor, animated stage/face-off, internal panels, restrained cost meters |
| Fight History | 🟡 In Progress | Recent tapes and aggregates shipped; badges/monthly report remain stretch |
| Sanctioned Live Mode | 🟢 Implemented | Ephemeral server vault, eight provider adapters, editable roster routes, actual usage meter, spend guard, recovery, and Live receipt |

## Verification Snapshot

- Primary-source roster ledger: 🟢 recorded and represented in code
- Under-review values: 🟢 nullable and shown as `COMMISSION REVIEW`
- Storage compatibility: 🟢 versioned migration, historical snapshots, explicit draws
- Automated verification: 🟢 23 tests across event engine, scoring, storage,
  programs, portrait resolution, clearance, and provider usage normalization
- Static verification: 🟢 ESLint and TypeScript/Vite production build
- Browser acceptance: 🟢 full 60-second reduced-effects bracket bout, intervention,
  draw, timeline, same-bout replay, H2H draw, and refresh resume verified
- Compact UI acceptance: 🟢 1048×784 and 390×844 have zero document overflow;
  sustained fight text scrolls inside fixed panes; notification rail and menu verified
- Constrained full-effects performance: 🟢 12 ms sustained main-thread pressure;
  17 ms median / 19 ms p95 / 23 ms max cycles; 60.52-second fight completed
- Datacenter spectacle acceptance: 🟢 selected reference compared against the
  final lobby; full desktop and 390×844 primary loops verified; Design QA passed
- Fighter identity acceptance: 🟢 all Main, Guest, Restricted, and Legend
  portraits resolve at 1024×1024; roster, face-off, fight HUD, leaderboard, and
  verdict placements verified
- Verdict acceptance: 🟢 summary, scores, timeline, and receipt exercised;
  unabridged referee report verified at desktop and 390×844
- Sanctioned Live acceptance: 🟢 eight-provider session vault and 19-fighter
  routing matrix verified; dummy credential cleared; API responses contained no
  secret; provider usage normalizers covered by tests; no-key failure recovered
- Clearance/readability acceptance: 🟢 restricted trials derived from existing
  history; historical portraits resolve to 1024×1024 art; reviewed desktop UI
  has no visible text below 12px, compact UI none below 11px; no document overflow

## Remaining Work

1. Repeat the constrained visual check on physical release-target devices as
   ordinary pre-release QA.
2. Decide whether to complete stretch achievements and monthly personal waste reports.
3. Choose production auth, encrypted shared secret storage, and multi-instance
   rate limiting before hosting Sanctioned Live for public accounts.

## Check History

| Date | Aligned | Drifted | Gaps | Notes |
|---|---:|---:|---:|---|
| 2026-07-11 | 17 | 0 | 2 | Scoped post-build check added the fixed shell and contained fight; no UI-contract drift found |
| 2026-07-11 | 15 | 0 | 2 | Post-build sync resolved stale statuses/API-flow/tie docs; stretch history and explicitly later Live remain planned gaps |
