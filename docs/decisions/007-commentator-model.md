# Decision: Commentator Model — Sassy (Grok-style)

**Date:** 2026-04-03
**Who Decided:** User
**Status:** Accepted (model TBD)

## The Situation
The live commentator needs to be fast, cheap, and entertaining — providing quips every ~10 seconds during a fight.

## What We Chose
A sassy model like Grok or similar. The commentator should have personality and attitude, not be neutral.

## What We Rejected
Using a bland/neutral smaller model — would produce boring commentary.

## Why
Commentary needs to feel like color commentary from a sports broadcast. Sass and attitude make individual lines shareable. Grok's personality is a natural fit.

## Consequences
- Depends on xAI API availability and pricing
- Need a fallback if Grok isn't available (heavily-prompted alternative)
- Commentary is a stretch goal, so this decision doesn't block V1
