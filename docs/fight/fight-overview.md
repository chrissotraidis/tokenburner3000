# Fight

## What It Does
The main event. Two AI models stream text simultaneously on a split-screen arena view with a 60-second countdown timer, live token counters, cost calculators, and a speed comparison bar.

## Why It Matters
This is the core product experience. The live streaming split-screen with visibly different speeds is what makes it feel like a real fight broadcast.

## Core Rules
- Both models stream simultaneously via parallel simulation intervals (spec-stated, implemented)
- Responses stream in real-time, side by side (spec-stated, implemented)
- 60-second countdown timer — the only way a fight ends (spec-stated, implemented)
- Token counters tick up live as tokens arrive (spec-stated, implemented)
- Cost calculators update based on real per-token pricing (`outputPer1M / 1,000,000`) (spec-stated, implemented)
- Streaming speed is driven by `tokensPerSecond`: interval = `40000 / tokensPerSecond` ms (implemented)
- Tokens per tick scale with speed: `random(0-2) + ceil(tokensPerSecond / 50)` (implemented)
- Speed comparison bar in HUD shows relative t/s between fighters (implemented)
- Each fighter streams from a unique mock word pool (40-60 phrases per fighter) (implemented)
- Forfeit button allows canceling a fight mid-match (implemented)

## What's Assumed
- V1 uses mock simulation. API keys needed for real fights (future). Risk if wrong: Low
- Token counting from mock ticks is approximate, not tokenizer-accurate. Risk if wrong: Low

## Key References
- **Source spec:** tokenburner-3000-concept-v2.md, section "3. THE FIGHT"
- **Implementation:** src/components/Fight.tsx, src/data/mockWords.ts

## Acceptance Criteria
- [x] Both model simulations run simultaneously, not sequentially
- [x] Responses stream visibly in real-time in split-screen layout
- [x] 60-second timer counts down and is visible
- [x] Token count and cost update live during streaming
- [x] Fight ends when timer expires (full 60 seconds)
- [x] Speed differences are visually dramatic (5.5x spread)
- [x] Speed comparison bar shows relative t/s
- [x] Forfeit button available

## Status
🟢 Implemented
