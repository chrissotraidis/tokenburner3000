# Decision: One Shared Fight-Event Engine

**Date:** 2026-07-11
**Who Decided:** User direction, refined by implementation planning
**Status:** Accepted

## The Situation

Signature moves, Commission rulings, commentary, audience actions, audiovisual
feedback, scoring, and post-fight replay all react to the same moments.

## What We Chose

Use one typed, deterministic event stream. Simulation emits events; UI, scoring,
commentary, accessibility announcements, persistence, and replay consume them.
Each fight has a seed, and rematches generate a new seed.

## What We Rejected

- Independent timers and booleans for every feature
- Visual-only events with no recorded gameplay meaning
- Non-replayable random side effects

## Consequences

- Event ordering and duplicate prevention become core invariants.
- Stored fight records gain a schema version and event log.
- New mechanics should be expressed as event producers and consumers.
