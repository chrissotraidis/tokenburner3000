# Shared Fight-Event System

## Who

The fight simulation, presentation, scoring engine, commentator, persistence
layer, and post-fight replay.

## The Happy Path

1. A fight starts with a unique ID, schema version, and random seed.
2. The scheduler emits timestamped fighter-output and countdown events.
3. Arena, fighter, Commission, and audience rules emit additional events.
4. Reducers apply mechanical effects exactly once.
5. Presentation maps events to the reserved rail, restrained effects, and live-region copy.
6. Scoring consumes explicit score modifiers and fight metrics.
7. The final ordered event log is stored with the fight record.
8. Verdict and replay views derive their timeline from that log.

## Event Contract

Each event contains an ID, timestamp, type, actor, headline, detail, mechanical
effect, score modifiers, visual cue, audio cue, commentary tags, and accessible
announcement. Fields may be empty only when they do not apply.

## What Could Go Wrong

### Duplicate event
- **When:** React effects remount or a timer fires twice.
- **What happens:** The event ID is ignored after first application.
- **Recovery:** Fight continues using the first accepted event.

### Invalid target
- **When:** A tag-in or intervention references an unavailable fighter.
- **What happens:** Emit a Commission recovery event with no score penalty.
- **Recovery:** Original fighter resumes.

### Reload during a fight
- **When:** The page reloads before the verdict.
- **What happens:** In-progress state is not treated as a completed record.
- **Recovery:** User returns to setup with an in-character notice.

## Acceptance Criteria

- [x] Events have stable unique IDs and deterministic ordering.
- [x] Applying the same event twice has no additional effect.
- [x] One signature event can drive mechanics, visuals, commentary, scoring, and replay.
- [x] Every essential event has accessible text.
- [x] Stored event logs can reconstruct the post-fight timeline.
- [x] Rematches use a new seed while tests can inject a fixed seed.

## Related

- `docs/decisions/010-shared-fight-event-engine.md`
