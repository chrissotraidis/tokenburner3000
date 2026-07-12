# Unknowns & Open Questions

Extracted from tokenburner-3000-concept-v2.md on 2026-04-03.

## Open Questions

### Which unverified roster fields can ship as satire?
- **Owner:** Product owner
- **Why it matters:** Meta pricing/mechanic details and guest-model prices are not yet supported by primary sources.
- **Current thinking:** Ship the fighter with `COMMISSION REVIEW` for unknown price and label mechanics as satirical.
- **Decide by:** Before public roster release

### What is the public-release visual performance budget?
- **Owner:** Engineering
- **Why it matters:** Canvas particles and CRT effects must not degrade fight controls or text streaming.
- **Current thinking:** Set a desktop and mobile frame-time budget during the visual spike and cap effects adaptively.
- **Decide by:** Before visual-system acceptance

### Which jurisdiction modifiers should Exhibition mode expose?
- **Status:** Resolved 2026-07-11
- **Owner:** Product owner
- **Why it matters:** Region Lock needs explicit venue context and should not surprise users.
- **Decision:** Global and EU Exhibition are implemented; other jurisdictions are omitted until sourced and designed.
- **Decide by:** Before Commission implementation is marked complete

### How should API keys be managed in a client-side app?
- **Status:** Resolved for architecture; implementation remains later
- **Owner:** Engineering
- **Why it matters:** The app needs to call multiple AI provider APIs. Client-side means keys could be exposed. A proxy/backend adds complexity but protects keys.
- **Decision:** Sanctioned Live requires a trusted server-side proxy. Provider
  keys may not enter the client bundle. See `docs/decisions/013-live-mode-requires-a-secure-proxy.md`.
- **Decide by:** Resolved before Live implementation

### What exact model should be the referee?
- **Status:** Resolved for Exhibition
- **Owner:** Product
- **Why it matters:** Referee quality directly impacts the punchline of every fight. Needs to be funny/ironic per user direction.
- **Decision:** Exhibition uses the local seeded referee. A separate real referee
  is a later Sanctioned Live decision.
- **Decide by:** Resolved 2026-07-11

### What exact model should be the commentator?
- **Status:** Resolved for Exhibition
- **Owner:** Product
- **Why it matters:** Commentary personality drives shareability of individual quips.
- **Decision:** Exhibition uses tagged local templates. A real model is deferred
  to Sanctioned Live.
- **Decide by:** Resolved 2026-07-11

### How accurate does token counting need to be?
- **Status:** Resolved 2026-07-12
- **Owner:** Engineering
- **Why it matters:** Cost display is a core part of the comedy. Wildly wrong numbers undermine the bit.
- **Decision:** Exhibition uses seeded simulation ticks and labels game speed.
  Live uses only provider-reported usage metadata; missing usage is unscored and
  never replaced with an estimate. Cost may be estimated for direct providers
  but must be labeled separately from OpenRouter billed cost.
- **Decide by:** Resolved before Sanctioned Live implementation

### What does the account/login system look like post-V1?
- **Owner:** TBD
- **Why it matters:** Users will want persistent identity for leaderboards and history when the app goes online.
- **Current thinking:** Anonymous local storage for V1. Some form of login for future versions. Details TBD.
- **Decide by:** Before building global leaderboard
