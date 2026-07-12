# Decision: Versioned Roster with Four Tiers

**Date:** 2026-07-11
**Who Decided:** User direction, refined by implementation planning
**Status:** Accepted

## The Situation

The refreshed roster is too large and too volatile for one flat selection grid.
Replacing fighter IDs would also orphan local fight history.

## What We Chose

Use a dated roster snapshot and four tiers: Main Card, Guest Bench, Restricted,
and Legends. Fighter identity is stable while volatile price, availability,
verification, and ranking metadata can be refreshed independently.

## What We Rejected

- One undifferentiated grid of every researched model
- Deleting retired fighter records
- Treating unknown prices as zero
- Runtime discovery from provider APIs in Exhibition mode

## Consequences

- The default selector stays manageable.
- Restricted and retired fighters remain part of the world without blocking fights.
- Storage and leaderboard rendering must support historical fighter snapshots.
- Public releases require a roster verification pass.
