# 015 — Progressive Datacenter Spectacle

**Date:** 2026-07-12
**Status:** Accepted
**Decided by:** Product owner selection of visual option 3

## Decision

TokenBurner adopts the Doomsday Datacenter Rave as its presentation direction.
Illustrated raster environments provide stable visual art. A small React Three
Fiber layer provides pointer parallax, a token tunnel, event pulses, and battle
phase escalation. DOM controls, transcripts, notifications, and data remain the
authoritative interaction layer.

## Rejected

- Using the selected mockup itself as a flat, non-interactive full-screen image.
- Replacing the fixed app frame with an unbounded cinematic page.
- Using blocking event popups or automatic stingers to create intensity.
- Making WebGL a requirement for the game loop.

## Consequences

- Generated backdrops are project assets and must be visually verified.
- The spectacle layer must pause or simplify under Reduce Effects and reduced
  motion.
- Major fight events may alter visuals but cannot alter event ordering or score.
- Mobile receives a simpler particle budget and keeps 14px transcript text.
