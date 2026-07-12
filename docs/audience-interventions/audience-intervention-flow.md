# Audience Intervention Flow

## Who

A user watching an active Exhibition fight.

## The Happy Path

1. User opens the intervention tray.
2. User chooses an action and a target when required.
3. The action locks immediately and consumes one charge.
4. A fight event applies the effect to the next eligible exchange.
5. UI and commentary acknowledge the result.
6. The event is preserved for the verdict timeline.

## What Could Go Wrong

### No eligible target
- **When:** Target is offline or the fight has ended.
- **What happens:** The action is rejected before charge consumption.
- **Recovery:** User may choose another action while time remains.

### Repeated activation
- **When:** Double click or key repeat fires the same command.
- **What happens:** Idempotency key accepts only the first event.
- **Recovery:** Exactly one charge is consumed.

## Acceptance Criteria

- [x] Invalid actions do not consume a charge.
- [x] Accepted actions apply to the next eligible exchange.
- [x] Duplicate command IDs are ignored.
