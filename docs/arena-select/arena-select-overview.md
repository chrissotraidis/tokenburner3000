# Arena Select

## What It Does

Lets the user choose the rule set, prompt framework, content pool, and scoring
modifiers for a fight. Arena selection must materially change what happens.

## Core Rules

- Roast Pit rewards attacks and callbacks and raises aggression frequency. (user-stated)
- Debate Ring assigns opposing positions and rewards rebuttals. (user-stated)
- Explain-Off adds a mandatory explanation/metaphor constraint. (user-stated)
- Filibuster rewards sustained output and penalizes repetition. (user-stated)
- Freestyle uses and preserves the user's custom prompt. (user-stated)
- The selected arena and prompt appear on the VS and verdict screens. (user-stated)
- Every arena supplies phrase tags and scoring modifiers to the event engine. (decided)

## Acceptance Criteria

- [x] All five arenas display a clear rule summary before selection.
- [x] Freestyle requires and preserves a non-empty custom prompt.
- [x] The same matchup behaves differently in at least three arenas.
- [x] Arena modifiers are recorded in the fight event log.
- [x] Verdict copy explains arena modifiers that affected scoring.
- [x] Changing fighters and returning does not silently reuse a stale prompt.

## Status

🟢 Implemented — arena phrase pools, scoring profiles, Freestyle mandate, and
fight-start rule event are active.
