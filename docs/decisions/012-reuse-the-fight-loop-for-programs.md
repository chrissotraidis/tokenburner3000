# 012 — Reuse the Fight Loop for Competition Programs

**Date:** 2026-07-11
**Status:** Accepted
**Decided by:** Product owner plan, implemented by Codex

## Decision

Best-of-three, provider cards, four-fighter brackets, and daily matchups are
small persisted schedulers around the existing fight loop. They do not own a
second simulation, scoring path, verdict, or record format.

## Rejected

- A separate tournament simulator.
- Precomputed bracket winners.
- An eight-fighter bracket in this upgrade cycle.

## Consequences

- Every program bout has the same proof and event record as Exhibition.
- Draws require an explicit rematch before progression.
- Program state is small enough for versioned local storage.
