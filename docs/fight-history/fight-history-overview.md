# Fight History

## What It Does
Personal fight history showing the user's W/L record, total tokens burned, dollars wasted, a "Personal Waste Report," and achievement badges.

## Why It Matters
Personal stats and achievements drive engagement and repeat usage. The waste report is inherently shareable.

## Core Rules
- Tracks user's fight history with W/L record (spec-stated)
- Shows total tokens burned and dollars wasted (spec-stated)
- "Your Personal Waste Report" — monthly summary of contribution to AI waste (spec-stated)
- Achievement badges (spec-stated):
  - "First Blood" — first fight
  - "Serial Burner" — 10 fights
  - "Carbon Footprint" — 1M tokens burned
  - "Degenerate" — 50 fights in one day
- V1: local storage for persistence (user-stated)
- This is a stretch goal (spec-stated)

## What's Assumed
- User identity is anonymous/local for V1 (local storage). Risk if wrong: Low
- Future versions will support accounts/login for persistent identity. Risk if wrong: Low
- Achievement thresholds are as stated in spec, can be tuned later. Risk if wrong: Low

## Key References
- **Source spec:** tokenburner-3000-concept-v2.md, section "Personal Fight History"

## Acceptance Criteria
- [x] User's recent fight tapes display result, matchup, arena, and event count
- [x] Local fighter W/L/D, tokens burned, and priced dollars wasted are shown
- [ ] At least 2 achievement badges implemented and awardable

## Status
🟡 In Progress (Stretch Goal) — recent tapes and aggregate history are part of
the Hall of Shame; personal monthly waste reports and badges remain stretch.
