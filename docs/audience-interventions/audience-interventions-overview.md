# Audience Interventions

## What It Does

Gives the viewer two limited charges to bend the next exchange and its scoring.

## Core Rules

- Each fight starts with two intervention charges. (user-stated)
- Initial actions: Demand Rebuttal, Raise Temperature, Fact-Check, Force Analogy,
  Double Down, and Throw Tomato. (user-stated)
- Every action changes the next chunk or score; none are cosmetic-only. (decided)
- An action emits exactly one event and consumes exactly one charge. (decided)
- Rapid clicking cannot duplicate an action. (decided)

## Acceptance Criteria

- [x] Two charges are visible and keyboard-operable.
- [x] Each intervention has immediate feedback and a measurable consequence.
- [x] Charges cannot become negative or be consumed twice.
- [x] Interventions are disabled after time expires.
- [x] Intervention events appear in commentary and the final timeline.

## Status

🟢 Implemented — all six actions affect the next exchange and/or scoring through
one idempotent event and consume one of two charges.
