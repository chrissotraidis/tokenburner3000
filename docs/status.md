# Project Status

Last updated: 2026-04-05

## Features

| Feature | Status | Notes |
|---------|--------|-------|
| Landing Page | 🟢 Implemented | Hero, ticker, CTA, footer — neon CRT aesthetic |
| Fighter Roster | 🟢 Implemented | 14 fighters from 7 providers with real pricing and distinct speeds |
| Arena Select | 🟢 Implemented | 5 arena types including Freestyle with custom prompt input |
| Fight | 🟢 Implemented | Split-screen streaming, full 60s timer, speed-differentiated output, live token/cost counters |
| Commentary | 🔵 Not Started | Stretch goal — sassy third model commentary |
| Referee | 🟢 Implemented | 5-category scoring based on verbosity + cost burned (mock verdict statements) |
| Post-Fight | 🟢 Implemented | Compute receipt with per-fighter cost breakdown, rematch, new fight |
| Leaderboard | 🟢 Implemented | Rankings table, 5 category awards, head-to-head, localStorage persistence |
| Fight History | 🔵 Not Started | Stretch goal — personal stats, achievements |
| Background Music | 🟢 Implemented | Looping soundtrack with volume controls (top-right) |

## V1 Scope (MVP)

Per spec, V1 requires:
1. ✅ Landing page
2. ✅ Fighter select (14 models from 7 providers)
3. ✅ Arena select (5 types including Freestyle)
4. ✅ Fight screen (split stream + 60s timer + speed-differentiated token counter)
5. ✅ Referee verdict (scoring based on verbosity + cost)
6. ✅ Basic leaderboard (localStorage)

**Stretch for V1:** Commentary, achievements, share cards, accounts, global leaderboard

## Notes

- V1 uses mock/simulated fight responses. Architecture is ready to swap in real API calls.
- Scoring is driven by token volume and cost burned — not random.
- Fighter speeds range from 45 t/s (o3) to 250 t/s (Llama 4 Maverick) with visible streaming differences.
- All data persists in localStorage.
- Tech stack: Vite + React + TypeScript + Tailwind CSS v4.
- Background music with volume controls.

## Blockers

- None currently identified
