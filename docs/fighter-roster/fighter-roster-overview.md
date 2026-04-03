# Fighter Roster

## What It Does
Defines the roster of AI models available for combat, each with a fighter profile including name, nickname, fake stats, and visual identity. Users select two fighters from this roster to enter the arena.

## Why It Matters
Fighter identity and personality are what make each matchup feel different and shareable. The profiles are the first thing users engage with.

## Core Rules
- Each fighter has: real model name (styled as boxing alias), nickname/title, fake stats, fighter icon (spec-stated)
- Nicknames established in spec: Claude "The Eloquent Arsonist," GPT-4o "Old Reliable," Gemini "Google's Most Expensive Hobby," Llama 3 "The People's Champ," Mistral "Le Burner," Command R+ "The Corporate Raider" (spec-stated)
- Fake stats include: Win/Loss record, Avg Token Output, Verbosity Rating (HIGH/SEVERE/EXTREME/UNHINGED/MERCILESS), Cost Per Ramble, Signature Move (spec-stated)
- Each fighter has a unique color and border style for UI differentiation (code-derived)
- V1 roster: 4-6 models minimum (spec-stated)
- User must select exactly 2 different fighters per fight (spec-stated)
- Fighter 1 = Red Corner, Fighter 2 = Blue Corner (code-derived)
- A fighter cannot fight itself (code-derived)

## What's Assumed
- Fighter stats are cosmetic/fake for V1 — not derived from real performance data. Risk if wrong: Low
- The roster is hardcoded for V1, not dynamically discovered from API availability. Risk if wrong: Medium (API outages could show unavailable fighters)

## Key References
- **Source spec:** tokenburner-3000-concept-v2.md, section "1. PICK YOUR FIGHTERS"
- **Prototype:** tokenburner3000.html, FIGHTERS constant (line 76-82)

## Acceptance Criteria
- [ ] At least 4 fighters displayed with name, nickname, icon, and fake stats
- [ ] User can select exactly 2 different fighters
- [ ] Selected fighters are visually distinguished (corner labels, disabled state)
- [ ] Selection flows to arena select with both fighters confirmed

## Status
🔵 Not Started

## Open Questions
- Should fighter stats update based on actual leaderboard data in future versions?
