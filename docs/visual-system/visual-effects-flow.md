# Visual Effects Flow

## Who

A user watching a fight with full or reduced effects.

## The Happy Path

1. App reads the saved effects preference and OS reduced-motion setting.
2. Fight events map to a defined visual cue and optional audio cue.
3. Restrained DOM/CSS effects render behind or around the content.
4. The effect ends without changing gameplay state.
5. Accessible text announces the event independently.

## What Could Go Wrong

### Advanced graphics unavailable
- **When:** The device is constrained or enhanced effects are disabled.
- **What happens:** Nonessential glow and motion stay hidden.
- **Recovery:** DOM notification rail, meters, and text remain complete.

### Rapid repeated events
- **When:** Several events arrive close together.
- **What happens:** Effects are pooled and intensity is capped.
- **Recovery:** Event text remains ordered and readable.

## Acceptance Criteria

- [x] Effects are driven by events, not private gameplay timers.
- [x] Disabling effects does not alter score or event ordering.
- [x] Rapid events do not create unbounded DOM objects.
- [x] A flat fallback remains visually coherent.
