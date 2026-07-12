# 014 — Fixed App Frame and Notification Rail

**Date:** 2026-07-11
**Status:** Accepted
**Decided by:** Product owner feedback and screenshot audit

## Decision

TokenBurner uses a persistent command bar and a viewport-sized application frame.
Navigation and detailed settings live in a drawer. Automatic fight events render
inside a reserved notification rail and never use fixed overlays or automatic
stingers. Screens that contain more information than one viewport use internal
tabs or labeled scroll regions.

## Rejected

- Floating audio/effects controls over every screen.
- Fixed center-screen event banners.
- Allowing fight transcripts to grow the document.
- Shrinking all text until dense screens happen to fit.

## Consequences

- The global shell owns viewport height and overflow.
- Fight, roster, leaderboard, and verdict must expose deliberate internal regions.
- Event importance is expressed by copy, color, and placement—not surprise motion or sound.
