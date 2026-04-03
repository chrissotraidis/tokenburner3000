# Landing Page

## What It Does
The entry point to TokenBurner 3000. Features the hero title, live burn ticker, "Enter The Arena" CTA, and sets the tone for the entire experience.

## Why It Matters
First impression. The landing page establishes the dead-serious combat sports tone and the neon CRT visual identity.

## Core Rules
- Hero section: TOKENBURNER 3000 title with glitch/flicker/hue-rotate effects, tagline, ENTER THE ARENA button (spec-stated)
- Live Burn Ticker: scrolling marquee showing total tokens burned, total $ wasted, VC funding countdown (spec-stated)
- LIVE indicator badge in top-left corner with ping animation (code-derived)
- "Enter The Arena" button navigates to fighter select (code-derived)
- Visual design: neon CRT aesthetic with scanlines, flicker, matrix background (code-derived)
- Full spec site map also calls for: Tonight's Fight Card (featured matchups), How It Works (3 steps), Hall of Shame (leaderboard preview), Sponsors strip (satirical), Footer (spec-stated, not all in prototype)

## What's Assumed
- Prototype in `docs/tokenburner3000.html` is the design reference for visual style. Risk if wrong: Low
- Some landing page sections (fight card, sponsors) are stretch for V1. Risk if wrong: Low

## Key References
- **Source spec:** tokenburner-3000-concept-v2.md, section "Landing Page"
- **Prototype:** tokenburner3000.html, renderLanding (lines 269-294), LiveTicker component (lines 107-140)

## Acceptance Criteria
- [ ] Hero title with neon glitch/flicker effects matching prototype aesthetic
- [ ] Live burn ticker scrolling with token count, dollar count, VC funding
- [ ] "Enter The Arena" CTA button navigates to fighter select
- [ ] Footer with dead-serious copyright line

## Status
🟡 In Progress — prototype exists, needs production implementation
