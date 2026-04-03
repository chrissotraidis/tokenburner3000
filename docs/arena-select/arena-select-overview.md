# Arena Select

## What It Does
Lets the user choose a battle topic/mode that determines the prompt framework for the fight. Each arena type provokes a different style of verbal combat.

## Why It Matters
Arena variety is what keeps fights fresh. Different modes produce fundamentally different content, driving replayability and shareability.

## Core Rules
- 5 arena types defined (spec-stated):
  - **THE ROAST PIT** — Models directly trash-talk each other. No mercy. Maximum verbal devastation.
  - **THE DEBATE RING** — Models argue opposite sides of an absurd proposition.
  - **THE EXPLAIN-OFF** — Both models explain a ridiculous concept, scored on creativity and commitment.
  - **THE FILIBUSTER** — Each model tries to say as much as possible about nothing. Pure verbosity competition.
  - **FREESTYLE** — User writes their own battle prompt.
- V1 minimum: Roast Pit + Freestyle (spec-stated)
- Arena selection happens after fighter selection (spec-stated)
- Each arena has a name and description displayed to the user (code-derived)
- Selecting an arena immediately starts the fight (code-derived)

## What's Assumed
- Freestyle mode needs a text input for the user's custom prompt. Risk if wrong: Low
- Arena types are hardcoded, not user-creatable. Risk if wrong: Low

## Key References
- **Source spec:** tokenburner-3000-concept-v2.md, section "2. CHOOSE THE ARENA"
- **Prototype:** tokenburner3000.html, ARENAS constant (line 84-89)

## Acceptance Criteria
- [ ] At least 2 arena types displayed (Roast Pit + Freestyle for V1)
- [ ] Each arena shows name and description
- [ ] Freestyle mode accepts a custom user prompt
- [ ] Selecting an arena proceeds to the fight screen

## Status
🔵 Not Started
