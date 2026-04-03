# Commentary

## What It Does
A third AI model watches both responses streaming in and provides live color commentary, styled like a sports ticker at the bottom of the arena. Updates every ~10 seconds with a new quip.

## Why It Matters
Commentary makes the fight feel like a broadcast event. One good commentator line is the kind of thing that goes viral.

## Core Rules
- Commentator is a separate, third model (not one of the fighters) (spec-stated)
- Updates every ~10 seconds with a new quip (spec-stated)
- Styled like a sports ticker at the bottom of the arena (spec-stated)
- Commentary is optional and toggleable by the user (spec-stated)
- Commentator model should be sassy — Grok or similar personality (user-stated)
- Commentary voice examples: "Gemini opens with flattery before the kill — classic misdirection!" / "Llama is going LONG. This is either genius or a cry for help." (spec-stated)

## What's Assumed
- Commentator receives partial responses (what's streamed so far) to generate timely commentary. Risk if wrong: Medium
- A cheaper/faster model is fine for commentary since it's supplementary. Risk if wrong: Low
- This is a stretch goal for V1. Risk if wrong: Low

## Key References
- **Source spec:** tokenburner-3000-concept-v2.md, section "The Live Commentator"

## Acceptance Criteria
- [ ] Third model generates commentary based on ongoing fight content
- [ ] Commentary updates appear every ~10 seconds during the fight
- [ ] Commentary can be toggled on/off by the user
- [ ] Commentary is styled as a sports ticker at the bottom of the arena

## Status
🔵 Not Started (Stretch Goal)
