# Commentary

## What It Does

An event-driven local commentator turns fight events and verified fighter lore
into live broadcast copy. A real-model commentator is deferred to Sanctioned Live mode.

## Core Rules

- Exhibition commentary is generated from tagged local phrase templates. (decided)
- Commentary reacts to events, not arbitrary ten-second polling. (decided)
- Triggers include signatures, rulings, lead changes, cost gaps, repetition,
  milestones, swarms, cache hits, countdown, and rivalry history. (user-stated)
- Commentary never obscures fighter text or essential controls. (decided)
- Commentary has an independent mute/visibility control. (user-stated)
- Lines respect the dead-serious combat-sports tone. (decided)

## Acceptance Criteria

- [x] At least eight event types can produce contextual commentary.
- [x] Commentary references both the event and relevant fighter lore.
- [x] Duplicate lines are suppressed within one fight.
- [x] Commentary can be hidden without changing gameplay.
- [x] Commentary is announced accessibly without overwhelming the live region.
- [x] Commentary events appear in the post-fight timeline.

## Status

🟢 Implemented — local event templates cover rules, milestones, lead changes,
cost gaps, repetition, signatures, interventions, rulings, and countdown.
