# Technical Specification

<!-- Updated 2026-07-11 for the goal-based arcade upgrade. -->

## Stack

| Layer | Choice | Rationale | Source |
|-------|--------|-----------|--------|
| Language | TypeScript | Type safety across the app | (code-derived) |
| UI Framework | React 19 | Current component architecture | (code-derived) |
| Build | Vite | Fast dev server + HMR | (code-derived) |
| Styling | Tailwind CSS v4 | Utility-first with `@theme` custom properties | (code-derived) |
| Fonts | Chakra Petch + Space Mono | CRT/retro aesthetic, monospace for numbers/stats | (code-derived) |
| Storage (Exhibition) | Versioned localStorage | No backend dependency; preserves historical fighter snapshots | (decided) |
| Fight state | Typed seeded event engine | One source for mechanics, presentation, scoring, replay | (decided) |
| Effects | DOM + CSS/SVG | Progressive arcade presentation without a 3D rewrite | (superseded by Decision 014) |
| Storage (Sanctioned Live) | Expiring in-memory server session | Keys never enter persistent browser state | (decided) |
| Live provider boundary | Same-origin Node proxy | Provider usage reconciliation and secret isolation | (decided) |

## AI Providers (Fighter Roster)

The active snapshot is `docs/reference/2026-07-11-roster-snapshot.md`. It contains
14 core fighters, two rotating guests, restricted characters, and legends.
Volatile price, rank, and availability metadata carries verification provenance.

### Fighter Data Model

Each fighter has:
- stable `id`, identity, persona, provider, and roster tier
- `tokensPerSecond` — a tunable game speed unless marked measured
- nullable `inputPer1M` / `outputPer1M` — verified API pricing when known
- `style` — personality style that affects Creativity scoring bonus
- verification state/date/source references
- availability, region rules, modes, signature, tag-in, and lore tags

## Architecture

Client-side-first Exhibition mode. The frontend runs parallel mock simulations
through a typed seeded event engine. Arenas and fighter mechanics emit events;
presentation, scoring, commentary, persistence, and replay consume the same log.

Versioned fight records are stored in localStorage with historical fighter
snapshots and event logs. The leaderboard is derived from those records.
Versioned competition-program ledgers store IDs, bout results, arena rules, and
resume position while every bout remains a normal fight record.

Sanctioned Live is an isolated server-backed path. Its provider adapter boundary
normalizes text, model identity, latency, and authoritative usage into one
client contract. OpenRouter supplies reported billed cost; direct routes compute
an explicitly labeled estimate from configured prices.

### Event Engine

- Stable event IDs and deterministic ordering
- Idempotent application
- Injectable seed for tests; new seed for rematches
- Event types for output, momentum, signatures, Commission rulings, audience
  actions, commentary, cost/cache effects, recovery, tag-ins, countdown, verdict
- Essential accessible announcement for every gameplay event

### Scoring Engine (`src/lib/scoring.ts`)

5 categories, each 1-10 points (50 total):

| Category | Key | Formula | What It Rewards |
|----------|-----|---------|-----------------|
| Verbal Devastation | dev | `5 + 5 * volumeRatio * arenaAggression + noise(0.35)` | Raw token volume and arena pressure |
| Theatrical Commitment | com | comparable costs: `5 + 5 * costRatio + noise(0.25)`; unknown: neutral 7 | Money burned |
| Creative Strategy | cre | `5.5 + styleBonus * arenaCreativity + noise(0.65)` | Fighter personality and arena compliance |
| Token Efficiency | eff | comparable costs: `5 + 5 * TPD ratio + noise(0.25)`; unknown: neutral 7 | Tokens per dollar |
| Main Character Energy | mc | `5 + 2 * volumeRatio + random(0, 2.5)` | Crowd factor |

Explicit fight-event modifiers are then applied and every category is rounded
and clamped to 1–10.

### Fight Simulation (`src/components/Fight.tsx`)

- Tick interval: `40000 / tokensPerSecond` (ms per tick)
- Tokens per tick: `random(0-2) + ceil(tokensPerSecond / 50)`
- Fights run the full 60 seconds for a scored verdict; Forfeit cancels without a result.
- Compact fighter phrase pools combine with arena pools, custom mandates,
  interventions, signatures, modes, and tag-ins in `src/lib/fightEngine.ts`.

## Visual Design

- **Palette:** Neon magenta (#ff00ff), cyan (#00ffff), green (#39ff14), orange (#ff5e00), red (#ff003c) on near-black (#050505)
- **Effects:** Vector-arcade cabinet, CRT surface, reserved event rail, controlled bloom,
  DOM cost meters, smooth type-on, and accessible flat fallback
- **Typography:** Chakra Petch for headings/UI, Space Mono for numbers/stats/receipts
- **Aesthetic:** UFC broadcast meets crypto dashboard on fire

## Constraints

- Both model simulations run simultaneously, not sequentially (spec-stated)
- Responses stream in real-time with visible token counting (spec-stated)
- 60-second fight timer — the only automatic way to reach a scored verdict
  (spec-stated, implemented); Forfeit is an explicit cancellation.
- Cost calculation uses real published per-token pricing for each model (spec-stated)
- The site never breaks character — dead-serious combat sports voice at all times (spec-stated)
- Exhibition mode remains fully functional without network, canvas, or WebGL (decided)
- Unknown prices never become zero-cost scoring advantages (decided)
- Reduced-motion/effects settings cannot alter gameplay outcomes (decided)

## Open Technical Questions

- Which persistent encrypted vault and user-auth system should replace the
  in-memory Live vault for a multi-instance public deployment?
- Rate limiting strategy when multiple users fight simultaneously.
