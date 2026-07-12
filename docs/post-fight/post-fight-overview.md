# Post-Fight

## What It Does

Turns the stored fight event log into a verdict, explainable scorecard, compute
receipt, event timeline, replay highlights, and shareable arcade result card.

## Core Rules

- Verdict explains arena, signature, Commission, and intervention modifiers. (user-stated)
- Timeline is derived from the stored event log. (decided)
- Turning point and largest burn spike are computed from recorded events. (decided)
- Share card has a flat renderer and does not require WebGL. (user-stated)
- Rematch preserves matchup/rules and generates a new seed. (decided)
- Alternate-arena rematch preserves fighters but returns to arena selection. (user-stated)
- The verdict is a post-fight show, not a static receipt: portraits frame the
  score, the winner owns a visible champion treatment, and panels can be explored
  without growing the document. (user-stated)
- The referee statement is always fully readable inside a deliberate scrollable
  report region and cannot be clipped by highlights or actions. (user-stated)

## Acceptance Criteria

- [x] Receipt shows duration, tokens, verified/unknown cost treatment, and statement.
- [x] Timeline lists major events in deterministic order.
- [x] Draws display and persist without assigning a winner.
- [x] Rematch uses a new seed.
- [x] Alternate-arena rematch preserves fighters.
- [x] Share card renders without WebGL and includes matchup, scores, and verdict.
- [x] Turning point and burn spike link to real stored events.
- [x] Judge-by-judge cards and signature replay reuse the scored categories and event log.
- [x] Winner and runner-up portraits are visible in the score presentation.
- [x] Referee statement remains fully readable at desktop and 390×844.
- [x] Summary, scores, timeline, and receipt feel like distinct interactive panels.

## Status

🟢 Implemented — receipt, category and judge cards, timeline, signature replay,
draw handling, share renderer, highlights, rematch, and alternate arena are active.
