# Restricted Vault, Motion, and Readability Audit

## Scope

Combined UX and accessibility review of fighter selection, restricted-vault
progress, Hall of Shame portraits, Killbox selection, face-off, Reduced Effects,
and 390×844 compact reflow.

## User Goal

Understand how restricted fighters unlock, recognize every historical fighter,
choose an arena that feels alive, and read the full combat interface without
squinting or losing controls.

## Flow Evidence

1. **Roster before — needs work.** Supporting labels and matrix text rendered
   below 12px. See `01-roster-before.png`.
2. **Restricted vault before — blocked.** Fighters were disabled with no visible
   unlock goal or progress. See `02-restricted-before.png`.
3. **Hall before — broken imagery.** Historical Claude IDs requested missing
   image files and displayed broken-image placeholders. See `03-hall-before.png`.
4. **Killbox before — visually strong but static.** The backdrop and stage card
   did not react beyond image replacement. See `04-arena-before.png`.
5. **Face-off before — visually strong but quiet.** Portrait scale was good, but
   key labels measured 7–10px and the versus core had limited life. See
   `05-faceoff-before.png`.
6. **Restricted vault after — healthy.** Both trials show exact progress,
   clearance state, progress bars, and selectable cleared cards. See
   `06-restricted-after.png`.
7. **Hall after — healthy.** Historical Claude IDs resolve to 1024×1024 cabinet
   portraits with no failed images. See `07-hall-after.png`.
8. **Killbox after — healthy.** Progressive WebGL depth, slow camera drift,
   stage-card arrival, and selected-stage energy are active. See
   `08-arena-after.png`.
9. **Face-off after — healthy.** Opposing portrait drift, corner charge, identity
   glow, reactive versus core, and a 12px operational type floor are active. See
   `09-faceoff-after.png`.
10. **Compact face-off — healthy.** The page remains exactly 390×844 with no
    document overflow and no visible text below 11px. See
    `10-mobile-faceoff-after.png`.
11. **Compact clearance — healthy.** Both trials and roster tiles remain readable
    within the fixed cabinet. See `11-mobile-restricted-after.png`.
12. **Compact Live settings — healthy.** Provider keys and per-fighter provider
    plus model-ID routing remain visible without page or panel-sideways overflow.
    See `12-mobile-live-settings-after.png`.

## Confirmed Strengths

- The existing fighter and arena artwork already provides a coherent identity.
- Fixed viewport framing, internal scrolling, semantic buttons/tabs, and visible
  focus styles survived the changes.
- Reduced Effects removes the stage canvas and all new motion while preserving
  art, rules, layout, and selection.

## Resolved Risks

- Undiscoverable unlocks became explicit local clearance trials.
- Broken legacy thumbnails now resolve through a tested alias map.
- Desktop operational text now has a 12px floor on the reviewed flows; compact
  text has an 11px floor.
- Arena and face-off motion remain decorative and pointer-inert.

## Evidence Limits

Screenshots and computed-style checks do not prove complete WCAG conformance.
Screen-reader announcement quality, browser zoom beyond the captured viewport,
and physical low-end GPU behavior still require dedicated testing.
