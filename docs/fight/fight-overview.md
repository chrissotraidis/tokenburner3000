# Fight

## What It Does
The main event. Two AI models stream text simultaneously on a split-screen arena view with a 60-second countdown timer, live token counters, cost calculators, and a speed comparison bar.

## Why It Matters
This is the core product experience. The live streaming split-screen with visibly different speeds is what makes it feel like a real fight broadcast.

## Core Rules
- Both models stream simultaneously via parallel simulation intervals (spec-stated, implemented)
- Responses stream in real-time, side by side (spec-stated, implemented)
- 60-second countdown timer — the only automatic path to a scored verdict; Forfeit cancels without a record (decided, implemented)
- Token counters tick up live as tokens arrive (spec-stated, implemented)
- Cost calculators update based on real per-token pricing (`outputPer1M / 1,000,000`) (spec-stated, implemented)
- Streaming speed is driven by `tokensPerSecond`: interval = `40000 / tokensPerSecond` ms (implemented)
- Tokens per tick scale with speed: `random(0-2) + ceil(tokensPerSecond / 50)` (implemented)
- Speed comparison bar in HUD shows relative t/s between fighters (implemented)
- Each fighter combines a compact identity phrase pool with arena constraints,
  custom mandates, interventions, modes, and tag-ins (implemented)
- Forfeit button allows canceling a fight mid-match (implemented)
- Fight transcripts remain fixed-height, scroll independently, and never increase document height. (user-stated)
- Mock phrases stream through a character queue rather than appearing one sentence at a time. (user-stated)
- Automatic events use the reserved notification rail and do not play synthesized stingers. (user-stated)
- Cost is shown as a restrained heat meter; animated fire artwork is not part of the broadcast. (user-stated)

## What's Assumed
- V1 uses mock simulation. API keys needed for real fights (future). Risk if wrong: Low
- Token counting from mock ticks is approximate, not tokenizer-accurate. Risk if wrong: Low

## Key References
- **Source spec:** tokenburner-3000-concept-v2.md, section "3. THE FIGHT"
- **Implementation:** `src/components/Fight.tsx`, `src/lib/fightEngine.ts`,
  `src/data/fighters.ts`, and `src/data/arenas.ts`

## Acceptance Criteria
- [x] Both model simulations run simultaneously, not sequentially
- [x] Responses stream visibly in real-time in split-screen layout
- [x] 60-second timer counts down and is visible
- [x] Token count and cost update live during streaming
- [x] Fight ends when timer expires (full 60 seconds)
- [x] Speed differences are visually dramatic (5.5x spread)
- [x] Speed comparison bar shows relative t/s
- [x] Forfeit button available
- [x] Arena rules, signatures, Commission rulings, commentary, and audience actions share one event log
- [x] Repetition, cost gaps, lead changes, and token milestones affect the broadcast and scoring
- [x] Document height remains equal to viewport height for the full 60-second fight.
- [x] Each transcript scrolls internally while new characters stream smoothly.
- [x] No automatic event opens a fixed popup or plays a sound.
- [x] Burn treatment communicates relative cost without animated flame art.

## Status
🟢 Implemented
