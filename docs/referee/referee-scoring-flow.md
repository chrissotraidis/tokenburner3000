# Referee Scoring Flow

## Who
Automated — triggered after a fight ends.

## The Happy Path
1. Fight ends (timer or both models done)
2. Arena goes dark momentarily (dramatic pause, ~1.5 seconds per prototype)
3. The local referee receives arena rules, fighter metrics, costs, seeded variance,
   and explicit event modifiers.
4. It returns five clamped 1–10 category scores for each fighter; App derives
   the total, draw/winner, and statement.
5. Verdict screen displays with side-by-side score comparison
6. Winner announced with dramatic styling
7. Referee's written statement displayed prominently
8. Fight stats shown: total tokens, total cost, duration
9. Post-fight actions available (rematch, share, new fight)

## What Could Go Wrong
- **Unknown price:** Price-dependent categories receive a documented neutral score.
- **Equal totals:** Display and store `DRAW`, with no winner or loss.
- **Invalid modifier:** Missing values contribute zero and category results remain clamped.
- **Referee is biased toward one model:** This is actually funny and on-brand. Let it happen.

## Acceptance Criteria
- [x] Dramatic pause before verdict appears
- [x] All 5 categories scored and displayed for both fighters
- [x] Winner or draw clearly announced
- [x] Written verdict statement is prominent and readable
- [x] Fight statistics (tokens, cost, duration) displayed

## Source
Extracted from tokenburner-3000-concept-v2.md, section "4. THE SCORING"
