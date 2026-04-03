# Decision: Local Storage for V1

**Date:** 2026-04-03
**Who Decided:** User
**Status:** Accepted

## The Situation
Need data persistence for fight results and leaderboard. Options range from no persistence to a full backend database.

## What We Chose
Local storage for V1. Quick to implement, no backend dependency, keeps deployment simple (static site).

## What We Rejected
- Supabase/Firebase (mentioned in spec as options) — deferred to post-V1
- No persistence — would lose leaderboard data on refresh

## Why
Fastest path to a working product. Modular enough to swap in a real backend later when accounts and online play are needed.

## Consequences
- Leaderboard is per-browser, not global
- No cross-device history
- Future migration to a backend database will need a data export/import path
- The app will need accounts/auth eventually for online play (user-stated future requirement)
