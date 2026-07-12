# Commentary Flow

## Who

A user watching an Exhibition fight with commentary enabled.

## The Happy Path

1. A fight event carries commentary tags.
2. The commentator matches event and fighter-lore templates.
3. A recent-line set removes repetitions.
4. The selected line appears in the broadcast ticker.
5. A compact commentary event is added to the timeline.

## What Could Go Wrong

### No matching template
- **When:** A new event has no specialized copy.
- **What happens:** A generic in-character event line is used.
- **Recovery:** Fight continues without missing information.

### Event burst
- **When:** Multiple events arrive in one second.
- **What happens:** High-priority rulings/signatures win; lower-priority lines queue briefly or drop.
- **Recovery:** The event timeline still records the underlying events.

## Acceptance Criteria

- [x] Priority rules prevent unreadable commentary bursts.
- [x] A generic fallback exists for every event category.
- [x] Hidden commentary produces no visible ticker updates.
