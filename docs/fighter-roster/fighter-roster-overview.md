# Fighter Roster

## What It Does

Defines a dated, source-aware roster of AI fighters. Each fighter combines a
stable identity with volatile metadata such as price, availability, ranking,
and verification date. Fighters are organized as Main Card, Guest Bench,
Restricted, or Legends.

## Why It Matters

Fighter identity is the product's main source of strategy, satire, and replay.
The roster must remain current without deleting saved history or presenting
unverified claims as facts.

## Core Rules

- The July 11, 2026 snapshot is the active roster baseline. (user-stated)
- Main Card contains approximately 16 normally selectable fighters. (decided)
- Guest fighters rotate without changing the core selection contract. (decided)
- Restricted fighters begin locked but can earn local Exhibition clearance. (user-stated)
- Clearance is derived from completed local fight records, never purchased and
  never presented as real-world model availability. (decided)
- Gemini 3.5 Pro clears after three completed Exhibition bouts. (decided)
- Claude Mythos 5 clears after Exhibition wins in three distinct arenas. (decided)
- Legends preserve historical identity and saved records. (decided)
- GPT-5.6 is one Sol/Terra/Luna mode-switching fighter. (decided)
- Stable identity is separate from price, availability, verification, and rank. (decided)
- Every volatile fact has a verification state and last-verified date. (decided)
- Unknown price is represented as unknown, never zero. (decided)
- Speed is a tunable game stat unless explicitly labeled as measured throughput. (decided)
- Historical fighter snapshots remain renderable after retirement or renaming. (decided)
- A user selects exactly two eligible, different fighters. (implemented)

## Roster Presentation

- Default view shows the Main Card.
- Guest Bench, Restricted, and Legends are separate filterable sections.
- Every fighter has a distinct generated arcade-character portrait keyed by its
  stable fighter ID. Portraits share one visual direction but preserve persona,
  provider-era color, and signature-move lore. (user-stated)
- Roster tiles use portrait crops and full dossiers use the uncropped portrait;
  fighter names and eligibility remain text and are never baked into art. (decided)
- Under-review fields display `COMMISSION REVIEW`.
- Restricted cards explain their clearance trial, current progress, and whether
  Exhibition clearance has been earned.
- Fighter cards show persona, provider, speed, price state, seed, and signature.

## Acceptance Criteria

- [x] Main Card, Guest Bench, Restricted, and Legends are distinguishable.
- [x] Only normally eligible or locally cleared fighters can be selected.
- [x] Existing Exhibition history immediately counts toward both clearance trials.
- [x] Restricted cards expose exact, readable progress and an accessible lock state.
- [x] Clearance never changes provenance or implies a public API model exists.
- [x] GPT-5.6 appears as one fighter with three runtime modes.
- [x] Unknown prices display `COMMISSION REVIEW`, not `$0`.
- [x] Every fighter exposes verification state and verification date.
- [x] Retired fighter IDs remain resolvable in historical records.
- [x] Existing saved fights remain visible after the roster upgrade.
- [x] Exactly two different eligible fighters can be confirmed.
- [x] All current Main, Guest, Restricted, and Legend IDs resolve to a portrait.
- [x] Portrait loading does not alter selection, eligibility, or keyboard behavior.

## Related

- `docs/reference/2026-07-11-roster-snapshot.md`
- `docs/decisions/008-versioned-roster-tiers.md`
- `docs/decisions/009-gpt-5-6-tri-mode-fighter.md`

## Status

🟢 Implemented — versioned tiers, provenance, tri-mode GPT-5.6, historical
snapshots, and local Commission clearance trials are active.
