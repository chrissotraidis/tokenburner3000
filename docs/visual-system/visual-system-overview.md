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

## Status

🟢 Implemented — the cabinet identity remains while the compact shell, internal
panels, notification rail, readable fight type, and cost meters replace the old
floating controls, banners, and flame canvas.
