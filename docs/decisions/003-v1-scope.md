# Decision: V1 MVP Scope

**Date:** From initial spec
**Who Decided:** Per spec
**Status:** Accepted
**Source:** tokenburner-3000-concept-v2.md, section "V1 Scope (MVP)"

## The Situation
Need to define what ships first vs what's stretch.

## What We Chose
V1 includes:
1. Landing page (prototype exists)
2. Fighter select (4-6 models)
3. Arena select (Roast Pit + Freestyle minimum)
4. Fight screen (split stream + timer + token counter)
5. Referee verdict (scoring + statement)
6. Basic leaderboard (local storage)

Stretch: Commentary, achievements, share cards, accounts, global leaderboard, fight history.

## What We Rejected
A larger initial scope. Commentary and accounts are explicitly deferred.

## Why
Ship the core loop first: pick fighters, pick arena, watch fight, see verdict. Everything else enhances but isn't essential.

## Consequences
- V1 is a static site + API keys (no backend needed)
- Leaderboard data is local to the browser
- No social/sharing features in V1
- Commentary is the first stretch feature to add
