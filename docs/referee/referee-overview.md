# Referee

## What It Does
After the fight ends, a dedicated judge model receives both responses and scores the fight across 5 categories, delivering a dramatic written verdict. The referee's statement is the punchline of the entire experience.

## Why It Matters
The verdict is the most shareable moment. A dramatic, opinionated, funny referee statement is what people screenshot and post.

## Core Rules
- Referee is a separate API call to a dedicated judge model (spec-stated)
- Referee model should be something funny/ironic — not the most serious model available (user-stated)
- Referee receives: arena type, Fighter A's full response, Fighter B's full response (spec-stated)
- 5 scoring categories, each 1-10 points (50 total) (spec-stated):
  - **Verbal Devastation** — Raw roast quality, wit, and burn severity
  - **Theatrical Commitment** — How fully they committed to the bit
  - **Creative Strategy** — Originality of approach, unexpected angles
  - **Token Efficiency Ratio** — Points per token (ironic: wasteful = funny but lower score)
  - **Main Character Energy** — Overall presence, confidence, "I meant to do that" energy
- Referee must deliver verdict "like a boxing judge who also moonlights as a theater critic" (spec-stated)
- Referee returns structured scores + a written verdict statement (spec-stated)
- Arena goes dark momentarily before verdict (dramatic pause) (spec-stated)
- The written statement should be dramatic, opinionated, and funny every time (spec-stated)

## What's Assumed
- Referee model returns valid JSON with scores and statement. Risk if wrong: Medium (needs structured output handling)
- A mid-tier model with good judgment and comedic timing is sufficient. Risk if wrong: Low

## Key References
- **Source spec:** tokenburner-3000-concept-v2.md, section "4. THE SCORING"
- **Prototype:** tokenburner3000.html, generateVerdict (lines 225-264), renderVerdict (lines 446-528)

## Acceptance Criteria
- [ ] Referee model called after fight ends with both full responses
- [ ] Returns scores across all 5 categories (1-10 each)
- [ ] Dramatic pause before verdict display
- [ ] Written verdict statement displayed prominently
- [ ] Winner declared based on total score
- [ ] Scores displayed in side-by-side comparison format

## Status
🔵 Not Started
