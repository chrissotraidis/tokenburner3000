# App Shell

## What It Does

Provides a persistent command bar, global navigation drawer, compact audio/effects
settings, view identity, and a stable viewport frame for every TokenBurner screen.

## Core Rules

- The command bar remains visible without covering the ticker or screen content. (user-stated)
- A menu icon exposes Home, Exhibition, Fight Programs, and Hall of Shame from every screen. (user-stated)
- Volume and Reduce Effects live in the menu; the bar shows only a compact mute control. (decided)
- The document itself does not scroll during a fight. (user-stated)
- Dense setup/history screens scroll within a labeled content region, not behind the command bar. (decided)
- Automatic notifications never render as fixed popups or play automatic sounds. (user-stated)
- Type used for primary content is at least 14px on compact screens and 15px on desktop. (user-stated)
- Dense operational labels and values remain at least 11px on compact screens
  and 12px on desktop. (user-stated)

## Acceptance Criteria

- [x] Menu is keyboard-operable, labeled, and available on every view.
- [x] Command bar and settings never overlap content at 390px through desktop widths.
- [x] Navigation changes views without requiring a trip back to the landing screen.
- [x] Background audio can be muted from the bar and adjusted in the menu.
- [x] Opening and closing the menu preserves the current screen state.
- [x] All primary views fit the viewport frame; any required overflow is inside a named panel.
- [x] Supporting copy, tabs, values, and controls meet the shared readability floor.

## Status

🟢 Implemented — fixed shell behavior and the shared readability floor are
browser-verified at desktop and 390×844.
