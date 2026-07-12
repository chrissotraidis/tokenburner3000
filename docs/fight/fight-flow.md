# Fight Flow

## Who
Any user who has selected two fighters and an arena.

## The Happy Path
1. User confirms fighter matchup and selects an arena
2. Tale of the Tape discloses seed, rules, costs, signatures, and Commission risk.
3. Exhibition starts two simultaneous seeded client-side simulations.
4. Responses stream in real-time on split-screen — left (Fighter 1) and right (Fighter 2).
5. Token counters tick up as tokens arrive; cost calculators update per published pricing
6. Timer counts down from 60 seconds
7. Timer counts down the full 60 seconds — both fighters stream for the entire duration
8. When timer hits zero, fight ends
9. The ordered event log and metrics transition to the referee/verdict flow.

## What Could Go Wrong
- **Simulation interval interruption:** Preserve emitted text and events; score only the completed 60-second record.
- **Unavailable tag-in:** Keep the original fighter streaming and degrade the event to recovery copy.
- **Unknown price:** Show Commission Review and use neutral price-dependent scores.
- **Timer expires while model is mid-token:** Cut the stream at 60s, use whatever arrived.

## Acceptance Criteria
- [x] Both simulations run simultaneously (not sequentially)
- [x] Streaming text appears chunk-by-chunk at model-specific speeds
- [x] Timer visible and counting down
- [x] Token count and cost update in real-time
- [x] Fight ends cleanly at timer expiry (full 60 seconds)
- [x] Forfeit returns to setup without recording a hidden result
- [x] Essential events remain readable with commentary and effects disabled

## Source
Extracted from tokenburner-3000-concept-v2.md, section "3. THE FIGHT"
