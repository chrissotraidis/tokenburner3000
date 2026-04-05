# Fight Flow

## Who
Any user who has selected two fighters and an arena.

## The Happy Path
1. User confirms fighter matchup and selects an arena
2. Pre-fight: arena goes to fight view, timer initializes at 60 seconds
3. Both model APIs are called simultaneously with their system prompts
4. Responses stream in real-time on split-screen — left (Fighter 1) and right (Fighter 2)
5. Token counters tick up as tokens arrive; cost calculators update per published pricing
6. Timer counts down from 60 seconds
7. Timer counts down the full 60 seconds — both fighters stream for the entire duration
8. When timer hits zero, fight ends
9. Transition to referee/verdict flow

## What Could Go Wrong
- **API timeout/failure for one fighter:** Show error state for that fighter, other fighter's response still valid. Could declare TKO (Technical Knowledge Overflow) for the remaining fighter.
- **API timeout/failure for both fighters:** Show error, offer retry/rematch.
- **Model returns empty or very short response:** Still scored — referee can roast them for it.
- **Stream interruption mid-fight:** Display what was received, note truncation, proceed to scoring with partial response.
- **Timer expires while model is mid-token:** Cut the stream at 60s, use whatever arrived.

## Acceptance Criteria
- [x] Both simulations run simultaneously (not sequentially)
- [x] Streaming text appears chunk-by-chunk at model-specific speeds
- [x] Timer visible and counting down
- [x] Token count and cost update in real-time
- [x] Fight ends cleanly at timer expiry (full 60 seconds)

## Source
Extracted from tokenburner-3000-concept-v2.md, section "3. THE FIGHT"
