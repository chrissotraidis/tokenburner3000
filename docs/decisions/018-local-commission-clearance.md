# 018 — Local Commission Clearance

**Date:** 2026-07-12
**Status:** Accepted
**Who Decided:** User direction, refined during implementation

## Decision

Restricted fighters remain visibly separate from the normal roster but can earn
satirical Exhibition clearance from local fight history:

- Gemini 3.5 Pro unlocks after three completed Exhibition bouts.
- Claude Mythos 5 unlocks after wins in three distinct Exhibition arenas.

Progress is derived from versioned fight records whenever the roster opens. No
new currency, account, backend, or persistent unlock flag is introduced. A
cleared fighter may enter Exhibition and may enter Sanctioned Live only when the
user has also configured a valid provider route.

The UI calls this `EXHIBITION CLEARANCE`. It does not change source provenance,
claim real-world availability, or make an unverified model ID appear verified.

## Rejected

- A hidden keyboard code: funny but undiscoverable and inaccessible.
- A manual unlock toggle: removes the game goal and makes the vault meaningless.
- A paid unlock: conflicts with the local-first Exhibition contract.
- A new XP ledger: duplicates information already present in fight history.

## Consequences

- Existing fight history can unlock a fighter immediately.
- Clearing browser storage removes progress because Exhibition identity remains local.
- Unlock rules are deterministic and unit-testable without UI state.
