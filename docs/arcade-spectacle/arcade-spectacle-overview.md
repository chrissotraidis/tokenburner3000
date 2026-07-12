# Arcade Spectacle

## What It Does

Turns the existing TokenBurner cabinet into an interactive fighting-game
spectacle across the full match journey: lobby, fighter select, arena select,
face-off, fight, and verdict.

## Core Rules

- The selected July 12 visual truth is the **Doomsday Datacenter Rave** concept:
  a token singularity, server-tunnel depth, magenta/cyan challenge energy, giant
  arcade typography, and a clear `ENTER THE ARENA` action. (user-stated)
- Visual energy escalates with the journey instead of peaking on the landing
  page: lobby < selection < face-off < live fight < final ten. (decided)
- Every primary interaction remains real, keyboard-operable, and readable over
  the spectacle layer. (decided)
- Generated raster backdrops provide the illustrated environments. WebGL adds
  reactive depth, particles, parallax, and event response; it does not replace
  content or controls. (decided)
- Reduce Effects, OS reduced motion, or WebGL failure keeps the complete game
  loop available with static art and restrained transitions. (decided)
- Automatic events remain in the reserved notification rail and do not become
  blocking popups or unsolicited sound stingers. (supersedes visual intensity,
  preserves Decision 014)

## Screen Contract

### Lobby

- The datacenter singularity is full-bleed and reacts to pointer position.
- The logo has dimensional depth, signal-break accents, and an overload meter.
- `ENTER THE ARENA` is the sole dominant action; programs and history remain
  secondary.
- Primary hover/focus states preserve the magenta cabinet treatment without
  bleaching, scanline artifacts, or text loss. (user-stated)
- Secondary lobby actions occupy a dedicated row and cannot collide with the
  primary action or side telemetry. (user-stated)

### Fighter Select

- A highlighted fighter owns a large versus-ready dossier.
- The roster behaves like a fighting-game grid with keyboard navigation,
  red/blue corner state, matchup energy, and immediate stat comparison.
- Provider and roster-tier filters remain available without returning to a long
  document.

### Arena Select

- Every arena has an illustrated environment preview and live scoring/rules
  treatment.
- The highlighted arena becomes the screen backdrop before confirmation.
- Freestyle remains a real prompt flow.

### Face-Off

- The selected fighters enter from opposing sides around the chosen arena.
- Each fighter uses a distinct generated arcade portrait near its name and core
  stats; the portrait is decorative identity, not a replacement for text. (user-stated)
- Prediction, risk disclosure, and start controls remain usable.
- The screen includes a user-triggered `HYPE` action that increases presentation
  energy without changing scoring.

### Fight

- Text remains fixed-height and independently scrollable.
- Visual phases change at 45, 30, and 10 seconds.
- Lead changes, signatures, Commission rulings, audience actions, and milestones
  drive non-blocking WebGL/CSS reactions and a visible momentum/crowd system.
- The final ten seconds become a distinct broadcast phase without obscuring text.

## Acceptance Criteria

- [x] Selected lobby matches the composition and energy of the chosen concept.
- [x] Fighter select reads as a game roster, not a catalog grid.
- [x] Arena select presents five visually distinct illustrated stages.
- [x] Face-off has a working user-triggered hype interaction.
- [x] Fight presentation changes with time, momentum, and major events.
- [x] Music loops and global mute/volume settings continue to work.
- [x] 1048×784 and 390×844 complete the primary loop without document overflow.
- [x] Reduce Effects and no-WebGL fallbacks preserve all controls and information.
- [x] Automated tests, lint, production build, browser console, and design QA pass.
- [x] Lobby hover and wide-screen action layouts remain legible and collision-free.
- [x] Every roster fighter has a distinct production portrait.
- [x] Portraits appear consistently in fighter select, face-off, and verdict.

## Status

🟢 Implemented — selected July 12 concept is live across the complete match loop.
