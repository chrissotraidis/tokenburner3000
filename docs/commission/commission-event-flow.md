# Commission Event Flow

## Who

A user watching an Exhibition fight with Commission rules enabled.

## The Happy Path

1. Tale of the Tape discloses eligible rulings.
2. The seeded scheduler evaluates one low-frequency ruling window.
3. A valid ruling emits a Commission event.
4. The fight updates the reserved notification rail and accessible announcement.
5. The configured recovery or tag-in is applied.
6. Commentary reacts to the ruling.
7. The verdict timeline explains its effect.

## What Could Go Wrong

### No valid recovery
- **When:** Required tag-in metadata is absent.
- **What happens:** The ruling is converted to a harmless review warning.
- **Recovery:** The original fighter continues.

### Incompatible ruleset
- **When:** An event is scheduled in Pure Competition.
- **What happens:** The event is discarded before emission.
- **Recovery:** No user-visible interruption.

## Acceptance Criteria

- [x] At most one disruptive Commission ruling occurs per fighter per bout.
- [x] Rulings are deterministic under a fixed fight seed.
- [x] A failed ruling degrades to a harmless event.
- [x] Event effects and recovery are visible in the timeline.
