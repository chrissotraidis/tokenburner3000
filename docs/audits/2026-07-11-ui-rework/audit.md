# UI Rework Audit — 2026-07-11

## Scope

Combined UX and accessibility audit of the shared app shell, fight broadcast,
Hall of Shame, and responsive controls, grounded in the user-provided screenshots
and fresh local runtime captures.

## User Goal

Move through the product and watch a fight without fighting the page: no modal
event interruptions, no document-height transcript growth, minimal page scrolling,
readable type, clear navigation, compact controls, smoother streaming, and a
restrained cost-burn treatment.

## Evidence

1. `user-01-fight-overflow.png` — user capture of the transcript forcing the
   fight page beyond the viewport.
2. `user-02-leaderboard-density.png` — user capture of the vertically stacked,
   undersized Hall of Shame.
3. `user-03-controls-collision.png` — user capture of sound/effects controls
   covering the ticker and nearby UI.
4. `01-current-shell.png` — fresh 1275×934 landing capture; hero overflows the
   viewport and the floating controls collide with the ticker.
5. `02-current-leaderboard.png` — fresh Hall of Shame capture; the screen is
   1081px tall in a 934px viewport and achieves near-fit only through tiny type.
6. `03-current-roster.png` — fresh roster capture; document height is 2377px in
   a 934px viewport.
7. `04-current-fight.png` — fresh early-fight capture; the initial empty panes
   fit correctly.
8. `05-current-fight-streaming.png` — fresh late-fight capture; document height
   grows to 1600px and each transcript grows to 1291px instead of scrolling in
   its 934px viewport.
9. `06-rebuilt-landing.png` — rebuilt desktop shell; command bar, ticker, and
   hero occupy one 1048×784 viewport with no overlap or document overflow.
10. `07-rebuilt-menu.png` — persistent navigation drawer with labeled primary
    destinations, volume, and Reduce Effects controls.
11. `08-rebuilt-roster.png` — fourteen main-card fighters visible as compact
    comparison cards inside the fixed frame.
12. `09-rebuilt-fight.png` and `10-rebuilt-fight-late.png` — rebuilt fight at
    start and after sustained output. Document height remains 784px; late panes
    remain 398px high while their contents reach 1390px and 1411px, with each
    pane auto-scrolled independently.
13. `13-rebuilt-mobile-landing.png` and `14-rebuilt-mobile-fight-live.png` —
    390×844 captures with no horizontal document overflow. Mobile fight panes
    remain 273px high, use 14px text, and independently contain 667px/586px of
    streamed content.
14. `15-rebuilt-mobile-leaderboard.png` — Hall of Shame uses section tabs and
    an internal data panel instead of stacking every section down the document.

## Strengths

- The red/blue fight framing, timer, roster provenance, and dead-serious arcade
  tone are recognizable and worth preserving.
- Semantic buttons, headings, tabs, tables, and live regions give the rework a
  useful accessibility foundation.
- The fight already tracks enough event and cost data to support a restrained
  notification rail and compact status presentation.

## UX Risks

1. **Critical — fight containment fails after sustained output.** The early
   fight fits, but the late capture proves `.fighter-stream` is sizing to its
   content. Auto-scroll therefore moves the document experience instead of a
   stable transcript viewport.
2. **Critical — automatic events interrupt instead of inform.** Fixed banners
   cover the fight and automatic synthesized stingers make routine milestones
   feel like errors. Notifications need a permanent, non-modal home.
3. **High — navigation is fragmented.** Back buttons and landing-page CTAs are
   the only route map. A persistent menu is needed on every screen.
4. **High — dense screens solve fit with tiny type.** The Hall of Shame and
   roster put every secondary fact on one page, shrinking labels and values
   below comfortable reading size.
5. **High — the roster requires 2.5 viewport heights.** Fourteen large cards
   make comparison and selection slow; the selected matchup and confirmation
   controls can leave the viewport.
6. **Medium — streaming arrives as full repeated sentences.** Phrase-sized
   appends make the broadcast jump rather than flow.
7. **Medium — the burn visualization dominates without looking credible.** The
   animated fire blobs consume valuable vertical space and distract from the
   cost difference they are meant to communicate.
8. **Medium — the floating settings cluster covers content.** It collides with
   the ticker, lacks a menu hierarchy, and is especially fragile at narrow widths.

## Accessibility Risks

- Several labels and data values render near 9–11px in the screenshots.
- Fixed overlays can obscure the reading target and create unexpected motion
  and sound; reduced effects does not address the automatic sound.
- Document growth changes spatial context while users are reading the fight.
- Narrow layouts rely on hiding controls instead of reflowing them into a usable
  settings surface.

## Rework Contract

- The application owns one fixed viewport frame; the document does not scroll
  during fights and dense screens scroll only inside named content panels.
- A persistent 56px command bar contains brand, view status, menu, and one
  compact audio control. Detailed sound/effects controls live in the menu drawer.
- Automatic events use a reserved notification rail and never open a modal-like
  banner or play a sound.
- Fight transcripts have fixed, independently scrolling regions and remain at
  least 15px on desktop and 14px on compact screens.
- Generated phrases enter a character queue and reveal in short, frequent slices.
- Cost burn becomes a quiet horizontal heat meter; animated flame art is removed.
- Roster and Hall of Shame use tabs/compact cards to keep the primary task within
  one viewport while preserving access to detail.
- At 390px, fighters stack into two fixed transcript rows or a clear switchable
  presentation without horizontal document overflow.

## Evidence Limits

Screenshots establish visual hierarchy, containment, and likely readability
risks. Keyboard traversal, screen-reader announcements, and responsive reflow
must be verified against the implemented DOM after the rework.

## Implementation Result

- The application document is locked to the viewport; the fight, roster,
  leaderboard, and verdict own their necessary internal overflow.
- The command bar and keyboard-operable drawer replace floating settings and
  expose global navigation from every view.
- Automatic fight events now update a 38–44px reserved notification rail.
  The synthesized event stinger path and fixed event/replay banners were removed.
- Mock output is queued and revealed in 28ms character slices instead of being
  appended one complete phrase at a time.
- The flame canvas and CSS flame stack were removed. Cost is communicated with
  per-fighter load meters and exact numeric totals.
- Hall of Shame and verdict content are separated into task-focused tabs; roster
  cards show comparison essentials in a compact grid.
- Runtime verification found zero document overflow at both tested viewports;
  menu navigation also remained available during an active bout.

## Verification

- `npm test`: 13/13 tests passed.
- `npm run lint`: passed.
- `npm run build`: TypeScript and Vite production build passed.
- Browser console: no errors or warnings during the verified fight flow.
