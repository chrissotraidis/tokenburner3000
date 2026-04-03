# Decision: Referee Model — Funny/Ironic Choice

**Date:** 2026-04-03
**Who Decided:** User
**Status:** Accepted (model TBD)

## The Situation
The referee model needs good judgment for scoring but also comedic timing for the verdict statement.

## What We Chose
Something funny and ironic — not the most powerful or serious model. The referee should feel like a character, not a neutral arbiter. Exact model TBD during implementation.

Candidates to explore:
- A model with a naturally dramatic/opinionated voice
- Could be a smaller model prompted heavily for personality
- The irony of a "lesser" model judging "greater" ones is on-brand

## What We Rejected
Using the biggest/most capable model as referee — too serious, misses the comedic opportunity.

## Why
The referee's statement is the punchline of the whole experience. It needs personality, not raw capability.

## Consequences
- Need to test different models for comedic output quality
- Structured output (JSON scores) must still be reliable from the chosen model
- May need prompt engineering to get consistent personality
