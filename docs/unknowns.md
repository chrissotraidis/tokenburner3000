# Unknowns & Open Questions

Extracted from tokenburner-3000-concept-v2.md on 2026-04-03.

## Open Questions

### How should API keys be managed in a client-side app?
- **Owner:** TBD
- **Why it matters:** The app needs to call multiple AI provider APIs. Client-side means keys could be exposed. A proxy/backend adds complexity but protects keys.
- **Current thinking:** V1 could use user-provided API keys (stored locally) or a lightweight proxy. Full backend comes later with accounts.
- **Decide by:** Before building the fight feature

### What exact model should be the referee?
- **Owner:** TBD
- **Why it matters:** Referee quality directly impacts the punchline of every fight. Needs to be funny/ironic per user direction.
- **Current thinking:** Test a few candidates during implementation. See `docs/decisions/006-referee-model.md`.
- **Decide by:** During fight feature implementation

### What exact model should be the commentator?
- **Owner:** TBD
- **Why it matters:** Commentary personality drives shareability of individual quips.
- **Current thinking:** Grok or similar sassy model. See `docs/decisions/007-commentator-model.md`.
- **Decide by:** When commentary feature is built (stretch)

### How accurate does token counting need to be?
- **Owner:** TBD
- **Why it matters:** Cost display is a core part of the comedy. Wildly wrong numbers undermine the bit.
- **Current thinking:** Count from stream chunks for display, potentially reconcile with provider-specific tokenizers post-fight.
- **Decide by:** During fight feature implementation

### What does the account/login system look like post-V1?
- **Owner:** TBD
- **Why it matters:** Users will want persistent identity for leaderboards and history when the app goes online.
- **Current thinking:** Anonymous local storage for V1. Some form of login for future versions. Details TBD.
- **Decide by:** Before building global leaderboard
