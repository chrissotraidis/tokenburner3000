# TokenBurner 3000

## What We're Building
A vector-arcade combat game where current AI model storylines become fighter
mechanics. Models battle in timed 60-second Exhibition bouts governed by arena
rules, signature moves, Commission rulings, audience interventions, commentary,
and an explainable referee. Cost burn is the central visual spectacle. Optional
real-provider fights run in an isolated, server-backed Sanctioned Live mode.

## Who It's For
People who enjoy watching AI models fight, sharing absurd results, and contributing to the noble cause of computational waste. The product is a content generation machine disguised as a game.

## Core Features
- **Fighter Roster:** Versioned Main Card, Guest, Restricted, and Legends tiers
- **Arena Select:** Rule sets that change generation, events, and scoring
- **The Fight:** Split-screen simulation driven by a shared deterministic event log
- **The Commission:** Rare, recoverable regulatory satire events
- **Commentary:** Event-driven local color commentary
- **Audience Interventions:** Two charged actions that bend the next exchange
- **Referee:** Local seeded scoring across five categories, judge cards, and dramatic verdict
- **Post-Fight:** Explainable verdict, timeline, replay, receipt, and share card
- **Leaderboard:** Local rankings, category awards, head-to-head records, and tapes
- **Fight History:** Personal stats, waste reports, achievement badges (stretch)
- **Vector Arcade:** Progressive CRT cabinet, restrained cost meters, and fixed broadcast frame

## Tone
The entire site speaks in the voice of a dead-serious combat sports organization that happens to be about AI models arguing. It never breaks character. It never acknowledges the absurdity. The comedy comes from the commitment.

## Spec Reference
The original specification is at `docs/reference/tokenburner-3000-concept-v2.md`. Arnold's feature docs are derived from it. When in doubt, the spec is authoritative.

## Design Reference
The existing neon CRT prototype remains a visual ancestor. The active direction
is the progressive vector-arcade system in `docs/visual-system/`.

## Field Guides

- `docs/getting-started/getting-started-overview.md` — complete player journey,
  cabinet controls, clearance, programs, and records
- `docs/sanctioned-live/sanctioned-live-operator-guide.md` — provider setup,
  accounting semantics, secret handling, and failure recovery
- `docs/release/release-overview.md` — automated, browser, Live safety, and
  publication gates for maintainers

## Current Status
🟢 Arcade upgrade and Sanctioned Live implemented — the sourced July 2026 roster, shared event
engine, arena mechanics, Commission, commentary, interventions, vector cabinet,
post-fight replay/sharing, local competition programs, ephemeral provider vault,
and provider-metered Live bouts are active. Physical device spot checks and
production account/secret infrastructure remain release follow-ups.

## Next Steps
- [x] Freeze a sourced July 11 roster snapshot
- [x] Record roster, GPT-5.6, event-engine, and presentation decisions
- [x] Implement foundation fixes and storage compatibility
- [x] Implement the shared event engine
- [x] Implement arena, signature, Commission, commentary, and audience rules
- [x] Implement the progressive vector-arcade presentation
- [x] Implement Tale of the Tape, timeline, sharing, and local competition programs
- [x] Run `/arnold:check` and live acceptance verification
- [x] Pass a constrained full-effects runtime budget; repeat as physical-device release QA
- [x] Design and implement optional Sanctioned Live through a secure server-side proxy
