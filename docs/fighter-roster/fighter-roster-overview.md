# Fighter Roster

## What It Does
Defines the roster of 14 AI models available for combat, each with a fighter profile including name, nickname, real pricing data, speed rating, and visual identity. Users select two fighters from this roster to enter the arena.

## Why It Matters
Fighter identity and personality are what make each matchup feel different and shareable. The profiles are the first thing users engage with. Speed and cost differences create strategic matchup choices.

## Core Rules
- Each fighter has: real model name (styled as boxing alias), nickname/title, real API pricing, speed rating, fighter icon (spec-stated, implemented)
- 14 fighters from 7 providers: Anthropic (3), OpenAI (3), Google (2), Meta (1), DeepSeek (2), xAI (1), Mistral (1), Cohere (1) (implemented)
- Fighter data model includes: `tokensPerSecond`, `inputPer1M`, `outputPer1M`, `style`, `provider`, `signatureMove` (implemented)
- Speed ranges from 45 t/s (o3) to 250 t/s (Llama 4 Maverick) — a 5.5x spread (implemented)
- Output pricing ranges from $0.28/1M (DeepSeek V3) to $25.00/1M (Claude Opus 4) (implemented)
- User must select exactly 2 different fighters per fight (spec-stated, implemented)
- Fighter 1 = Red Corner, Fighter 2 = Blue Corner (code-derived, implemented)
- A fighter cannot fight itself (code-derived, implemented)
- Selected fighters can be deselected via X buttons (implemented)
- Hardcoded `winRate` removed — win rate is computed from actual fight records (decided)

## What's Assumed
- Fighter stats use real published API pricing but fights are simulated (mock mode). Risk if wrong: Low
- The roster is hardcoded, not dynamically discovered from API availability. Risk if wrong: Medium

## Key References
- **Source spec:** tokenburner-3000-concept-v2.md, section "1. PICK YOUR FIGHTERS"
- **Implementation:** src/data/fighters.ts (14 fighters), src/components/FighterSelect.tsx

## Acceptance Criteria
- [x] At least 4 fighters displayed with name, nickname, icon, and stats
- [x] User can select exactly 2 different fighters
- [x] Selected fighters are visually distinguished (corner labels, disabled state)
- [x] Selection flows to arena select with both fighters confirmed
- [x] 14 fighters with real pricing and speed data
- [x] Fighter deselection via X buttons

## Status
🟢 Implemented
