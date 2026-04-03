# Referee Scoring Flow

## Who
Automated — triggered after a fight ends.

## The Happy Path
1. Fight ends (timer or both models done)
2. Arena goes dark momentarily (dramatic pause, ~1.5 seconds per prototype)
3. Referee model is called with: arena type, Fighter A's full response, Fighter B's full response, scoring rubric
4. Referee returns structured JSON: scores for each of 5 categories (1-10) for each fighter, written verdict statement, winner declaration
5. Verdict screen displays with side-by-side score comparison
6. Winner announced with dramatic styling
7. Referee's written statement displayed prominently
8. Fight stats shown: total tokens, total cost, duration
9. Post-fight actions available (rematch, share, new fight)

## What Could Go Wrong
- **Referee API fails:** Retry once. If still fails, compute winner from token metrics (most tokens = "won by volume") with a canned verdict: "The referee has been incapacitated. Winner determined by computational brute force."
- **Referee returns malformed JSON:** Parse what's available, fill missing scores with 5/10, flag in UI.
- **Referee declares a tie:** Display "DRAW" — both fighters' scores equal. Prototype handles this (line 495).
- **Referee is biased toward one model:** This is actually funny and on-brand. Let it happen.

## Acceptance Criteria
- [ ] Dramatic pause before verdict appears
- [ ] All 5 categories scored and displayed for both fighters
- [ ] Winner clearly announced
- [ ] Written verdict statement is prominent and readable
- [ ] Fight statistics (tokens, cost, duration) displayed

## Source
Extracted from tokenburner-3000-concept-v2.md, section "4. THE SCORING"
