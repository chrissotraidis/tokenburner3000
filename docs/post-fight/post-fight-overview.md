# Post-Fight

## What It Does
After the verdict, users can share the result, view a detailed fight receipt, rematch with the same fighters, or start a new fight.

## Why It Matters
The share moment is everything. The post-fight screen is where casual viewers become repeat users and where content gets generated for social media.

## Core Rules
- **Share Card** — Auto-generated image/card showing matchup, scores, and verdict. Optimized for Twitter/X. Auto-populated share text example: "Claude Opus just destroyed GPT-4o in TokenBurner 3000. Total cost: $0.03. Total purpose: none." (spec-stated)
- **Fight Receipt** — Downloadable/shareable receipt showing exact token counts, costs per model, time elapsed, referee's statement. Styled like a gas station receipt but for compute (spec-stated)
- **Rematch Button** — Same models, same arena, new fight (spec-stated)
- **New Fight Button** — Back to fighter select (spec-stated)
- Receipt includes: match duration, tokens obliterated, capital evaporated (code-derived)

## What's Assumed
- Share card generation is client-side (canvas/HTML-to-image). Risk if wrong: Low
- Share functionality uses Web Share API or copy-to-clipboard fallback. Risk if wrong: Low
- Share cards are a stretch goal for V1; basic receipt and rematch/new fight buttons are V1. Risk if wrong: Low

## Key References
- **Source spec:** tokenburner-3000-concept-v2.md, section "5. POST-FIGHT"
- **Prototype:** tokenburner3000.html, verdict screen actions (lines 510-521)

## Acceptance Criteria
- [ ] Fight receipt displayed with token counts, costs, duration, and referee statement
- [ ] Rematch button starts a new fight with the same fighters and arena
- [ ] New Fight button returns to fighter select
- [ ] Receipt styled as a dashed-border "compute receipt" (matching prototype)

## Status
🔵 Not Started
