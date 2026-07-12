# Vector-Arcade Visual System

## What It Does

Presents the entire product as a glowing vector arcade cabinet while preserving
the existing React DOM interface and a complete flat fallback.

## Core Rules

- The cabinet shell, CRT surface, typography, notification rail, and effects form one system. (user-stated)
- The DOM remains the primary interaction and content layer. (decided)
- Cost intensity uses a restrained DOM heat meter; decorative flame canvas is retired. (superseded by Decision 014)
- WebGL enhancements are progressive and never required. (decided)
- Output price drives heat-meter intensity; unknown price uses a review state. (superseded by Decision 014)
- Reduce Effects and `prefers-reduced-motion` remove shake, flicker, hitstop, and zoom. (user-stated)
- Essential information is never conveyed only by color, sound, motion, or haptics. (decided)
- Operational and supporting text has a 12px desktop floor and an 11px compact
  floor; primary reading text remains at least 15px desktop and 14px compact. (user-stated)
- Face-off portraits use slow opposing parallax, animated corner light, and a
  reactive versus core; the interaction remains usable with motion disabled. (user-stated)

## Acceptance Criteria

- [x] Landing, selection, fight, verdict, and leaderboard share the cabinet language.
- [x] Fight view includes a restrained per-fighter cost-load meter.
- [x] Signature and Commission events update the reserved rail without automatic sound.
- [x] Reduce Effects persists locally and disables disruptive motion.
- [x] The complete fight loop works without canvas or WebGL.
- [x] Mobile layout preserves readable fight text and controls.
- [x] Effects do not intercept pointer or keyboard input.
- [x] Global controls never cover ticker or page content.
- [x] Automatic events remain inside the fixed notification rail.
- [x] Primary fight text remains at least 15px on desktop and 14px on compact screens.
- [x] Operational labels and values meet the 12px desktop / 11px compact floor.
- [x] Face-off motion and glow respond to hype without covering identities or controls.
- [x] Historical fighter portraits resolve to real cabinet artwork, never broken-image placeholders.

## Status

🟢 Implemented — the cabinet identity, fixed shell, internal panels, readable
type floor, progressive stage/face-off motion, and static fallback are aligned.
