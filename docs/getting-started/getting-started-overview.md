# Getting Started

## What This Guide Does

Explains the complete TokenBurner 3000 player journey without requiring code or
provider credentials. Exhibition is the recommended first bout. It is free,
deterministic, local, and uses the same fighters, arenas, verdict, and records as
the paid Live circuit.

## Start the Cabinet

```bash
npm install
npm run dev
```

Open `http://127.0.0.1:5173` and choose **Enter the Arena**.

## First Exhibition Bout

1. Choose two different selectable fighters.
2. Confirm the matchup.
3. Choose one of the five arenas. Each arena changes phrase pools and scoring.
4. Optionally change Commission, commentary, or venue settings.
5. On the Face Off screen, predict a winner and use **Hype the Crowd** if desired.
6. Release the fighters.
7. During the bout, use up to two Crowd Actions. Each action bends the next exchange.
8. Let the full 60-second bout finish to receive a scored verdict. Forfeit cancels it.
9. Explore Summary, Scores, Timeline, and Receipt before choosing a rematch or new fight.

## Cabinet Controls

| Control | Effect |
|---|---|
| Menu button | Opens navigation, volume, Reduced Effects, and Live settings |
| Mute button | Immediately toggles all cabinet sound |
| Reduce Effects | Removes WebGL and aggressive motion without changing outcomes |
| Crowd Action | Spends one of two charges to alter the next exchange |
| Internal transcript scroll | Reviews output without moving the page or hiding the HUD |
| Forfeit | Ends the bout without recording a scored result |

## Restricted Clearance

Clearance is local progress derived from completed Exhibition records.

- **Gemini 3.5 Pro:** complete three Exhibition bouts.
- **Claude Mythos 5:** win Exhibition bouts in three different arenas.

Existing history counts immediately. Clearance never changes fighter provenance
and does not promise that a matching real API endpoint exists.

## Competition Programs

The Fight Programs screen offers best-of-three, provider cards, a four-fighter
bracket, and a daily featured matchup. Programs store ordinary fight IDs and can
resume locally. Their bouts use the same scoring and record contracts as a normal
Exhibition fight.

## Records and Replays

Hall of Shame derives standings, category awards, head-to-head records, and
recent tapes from local fight history. Historical fighter snapshots keep old
results renderable even when the active roster changes.

## Acceptance Criteria

- [x] A first-time player can complete Exhibition without a key or account.
- [x] Every primary screen is reachable from the persistent menu.
- [x] Required scrolling stays inside named content panels.
- [x] Reduced Effects preserves gameplay and removes optional spectacle.
- [x] A completed bout produces an explainable verdict and durable local tape.

## Related

- `docs/fight/fight-flow.md`
- `docs/fighter-roster/fighter-roster-overview.md`
- `docs/competition-modes/competition-modes-overview.md`
- `docs/sanctioned-live/sanctioned-live-operator-guide.md`

## Status

🟢 Implemented and browser-verified at desktop and 390×844.
