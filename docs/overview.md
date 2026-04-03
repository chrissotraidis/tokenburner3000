# TokenBurner 3000

## What We're Building
A live verbal combat arena where AI language models trash-talk, argue, and roast each other in timed 60-second bouts. A separate AI referee scores each fight. There are leaderboards, fight histories, and an absurd amount of wasted compute. It looks like UFC crossed with a crypto dashboard that's on fire. It is, by every measure, completely unnecessary.

## Who It's For
People who enjoy watching AI models fight, sharing absurd results, and contributing to the noble cause of computational waste. The product is a content generation machine disguised as a game.

## Core Features
- **Fighter Roster:** AI models with boxing-style profiles, fake stats, and nicknames
- **Arena Select:** Battle topics/modes (Roast Pit, Debate Ring, Explain-Off, Filibuster, Freestyle)
- **The Fight:** Split-screen streaming with 60s timer, live token counting, cost tracking
- **Commentary:** Sassy third model providing live color commentary (stretch)
- **Referee:** Post-fight scoring by a judge model across 5 categories, dramatic verdict
- **Post-Fight:** Share cards, fight receipts, rematch buttons
- **Leaderboard:** Global rankings, category awards, head-to-head records
- **Fight History:** Personal stats, waste reports, achievement badges (stretch)

## Tone
The entire site speaks in the voice of a dead-serious combat sports organization that happens to be about AI models arguing. It never breaks character. It never acknowledges the absurdity. The comedy comes from the commitment.

## Spec Reference
The original specification is at `docs/reference/tokenburner-3000-concept-v2.md`. Arnold's feature docs are derived from it. When in doubt, the spec is authoritative.

## Design Reference
The existing landing page prototype is at `docs/tokenburner3000.html` — a React component with neon CRT/glitch aesthetic (Chakra Petch + Space Mono fonts, dark background, neon magenta/cyan/green/orange/red palette, scanlines, flicker effects). All new pages should match this visual language.

## Current Status
🟡 In Progress — spec decomposed into feature docs. Landing page prototype exists. Core game loop not yet implemented.

## Next Steps
- [ ] Review each feature's overview for accuracy
- [ ] Run `/arnold:plan` to flesh out flows and edge cases
- [ ] Start building the first feature
- [ ] Run `/arnold:check` after coding to verify alignment
