# 016 — Individual Fighter Portrait Library

**Date:** 2026-07-12
**Status:** Accepted
**Decided by:** Product owner screenshot feedback

## Decision

Every current roster fighter receives an individual generated raster portrait.
Portraits use a shared neon arcade-combat art direction, contain no model logos or
text, and are addressed by stable fighter ID under `public/art/fighters/`.
Selection, accessibility, historical identity, and gameplay continue to use the
typed fighter record; portrait art is presentation only.

## Rejected

- Reusing provider logos or generic line icons as the fighter character.
- One sprite sheet with approximate crops.
- Embedding names, prices, or volatile model metadata into portrait art.
- Adding portrait URLs to saved historical snapshots.

## Consequences

- New roster IDs need a portrait before their presentation is considered complete.
- Portrait assets are optimized for browser delivery after generation.
- Text labels and icon fallbacks remain available to assistive technology and
  asset-failure recovery.
