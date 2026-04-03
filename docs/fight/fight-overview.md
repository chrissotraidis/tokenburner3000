# Fight

## What It Does
The main event. Two AI models are called simultaneously, their responses stream in real-time on a split-screen arena view with a 60-second countdown timer, live token counters, and cost calculators.

## Why It Matters
This is the core product experience. The live streaming split-screen is what makes it feel like a real fight broadcast.

## Core Rules
- Both models are called simultaneously via their respective APIs (spec-stated)
- Responses stream in real-time, side by side (spec-stated)
- 60-second countdown timer (spec-stated)
- If a model finishes before time, its response sits while the other keeps going (spec-stated)
- Token counters tick up live as tokens arrive (spec-stated)
- Cost calculators update based on actual per-token pricing (spec-stated)
- Each model's system prompt tells them their identity, opponent, and arena-specific task (spec-stated)
- System prompt template: "You are [Model Name]. You are in a verbal combat arena called TokenBurner 3000. Your opponent is [Opponent Name]. Your task: [arena-specific prompt]. You have one response. Make it count. Be funny, creative, and devastating." (spec-stated)
- Fight ends when timer hits zero OR both models finish (spec-stated)

## What's Assumed
- API keys are available client-side or through a proxy for V1. Risk if wrong: High (blocks entire feature)
- All provider streaming APIs are compatible enough to display uniformly. Risk if wrong: Medium
- Token counting from stream chunks is accurate enough for display purposes. Risk if wrong: Low

## Key References
- **Source spec:** tokenburner-3000-concept-v2.md, section "3. THE FIGHT"
- **Prototype:** tokenburner3000.html, fight engine simulation (lines 189-223), renderFight (lines 384-444)

## Acceptance Criteria
- [ ] Both model APIs called simultaneously, not sequentially
- [ ] Responses stream visibly in real-time in split-screen layout
- [ ] 60-second timer counts down and is visible
- [ ] Token count and cost update live during streaming
- [ ] Fight ends when timer expires or both models finish
- [ ] Early-finishing model's response remains visible while opponent continues

## Status
🔵 Not Started
