# Leaderboard

## What It Does
Tracks all-time stats across all fights: global rankings table, category awards, head-to-head records, and a recent fights feed.

## Why It Matters
Leaderboards give fights stakes and make model rivalries feel real. "Claude is ranked #1 in competitive verbal combat" is a sentence people want to post.

## Core Rules
- Global leaderboard tracks: Rank, Fighter, W/L record, Win %, Total Tokens Burned, Total $ Wasted, Avg Score, Title (spec-stated)
- Minimum 10 fights to qualify for Overall Champion (spec-stated)
- Category awards (spec-stated):
  - **Overall Champion** — highest win rate (min 10 fights)
  - **The Biggest Burner** — most total tokens wasted all-time
  - **The Money Pit** — most total dollars burned
  - **The Efficient Assassin** — highest avg score with lowest avg token count
  - **The Filibuster King** — longest single response ever recorded
  - **The Punching Bag** — most losses (celebrated, not shamed)
- Head-to-head records track all-time series between specific matchups (spec-stated)
- Recent fights feed shows fights happening globally (spec-stated, future/stretch)
- V1: basic leaderboard, even just local/session-based (spec-stated)
- V1 storage: local storage (user-stated)

## What's Assumed
- V1 leaderboard is local to the user's browser. Risk if wrong: Low
- Global leaderboard requires a backend (post-V1). Risk if wrong: Low
- Leaderboard computed from aggregated fight records, not maintained as a separate entity. Risk if wrong: Low

## Key References
- **Source spec:** tokenburner-3000-concept-v2.md, section "The Leaderboard System"

## Acceptance Criteria
- [ ] Rankings table displays fighters with W/L, Win %, tokens burned, $ wasted, avg score
- [ ] At least one category award displayed
- [ ] Fight results persist across sessions (local storage)
- [ ] Head-to-head record viewable for any two fighters

## Status
🔵 Not Started
