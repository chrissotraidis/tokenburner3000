# Technical Specification

<!-- Updated 2026-04-05 to reflect implemented state. -->

## Stack

| Layer | Choice | Rationale | Source |
|-------|--------|-----------|--------|
| Language | TypeScript | Type safety across the app | (code-derived) |
| UI Framework | React 18 | Prototype built in React with component architecture | (code-derived) |
| Build | Vite | Fast dev server + HMR | (code-derived) |
| Styling | Tailwind CSS v4 | Utility-first with `@theme` custom properties | (code-derived) |
| Fonts | Chakra Petch + Space Mono | CRT/retro aesthetic, monospace for numbers/stats | (code-derived) |
| Storage (V1) | localStorage | Quickest to deploy, no backend dependency | (user-stated) |
| Storage (Future) | TBD — needs accounts/auth for online play | Future requirement, not V1 | (user-stated) |

## AI Providers (Fighter Roster)

14 fighters from 7 providers, each with real pricing and speed data:

| Provider | Fighters | Output $/1M Range | Speed Range |
|----------|----------|-------------------|-------------|
| Anthropic | Claude Opus 4, Sonnet 4, Haiku 4.5 | $5.00 - $25.00 | 60 - 175 t/s |
| OpenAI | GPT-4o, GPT-4o Mini, o3 | $0.60 - $10.00 | 45 - 135 t/s |
| Google | Gemini 2.5 Pro, Flash | $2.50 - $10.00 | 105 - 175 t/s |
| Meta | Llama 4 Maverick | $0.77 | 250 t/s |
| DeepSeek | DeepSeek V3, R1 | $0.28 - $2.19 | 55 - 100 t/s |
| xAI | Grok 3 | $15.00 | 90 t/s |
| Mistral | Mistral Large 3 | $6.00 | 90 t/s |
| Cohere | Command R+ | $10.00 | 70 t/s |

### Fighter Data Model

Each fighter has:
- `tokensPerSecond` — real-world throughput, controls streaming speed in fights
- `inputPer1M` / `outputPer1M` — real API pricing per 1M tokens
- `style` — personality style that affects Creativity scoring bonus
- `provider` — which AI company

## Architecture

Client-side-first for V1. The frontend handles fighter selection, arena selection, and runs parallel mock simulations. Both fighters stream text simultaneously at their respective speeds. When the 60-second timer expires, a scoring engine evaluates token volume and cost to determine the winner.

Fight results are stored in localStorage. The leaderboard is computed from aggregated fight records.

### Scoring Engine (`src/lib/scoring.ts`)

5 categories, each 1-10 points (50 total):

| Category | Key | Formula | What It Rewards |
|----------|-----|---------|-----------------|
| Verbal Devastation | dev | `5 + 5 * (myTokens / maxTokens) +/- 0.5` | Raw token volume |
| Theatrical Commitment | com | `5 + 5 * (myCost / maxCost) +/- 0.5` | Money burned |
| Creative Strategy | cre | `6 + styleBonus + random(-1, 1)` | Fighter personality |
| Token Efficiency | eff | `5 + 5 * (myTPD / maxTPD) +/- 0.5` | Tokens per dollar |
| Main Character Energy | mc | `5 + 2 * (myTokens / maxTokens) + random(0, 3)` | Crowd factor |

### Fight Simulation (`src/components/Fight.tsx`)

- Tick interval: `40000 / tokensPerSecond` (ms per tick)
- Tokens per tick: `random(0-2) + ceil(tokensPerSecond / 50)`
- Fights run the full 60 seconds — timer is the only end condition
- Mock word pools per fighter in `src/data/mockWords.ts` (40-60 phrases each)

## Visual Design

- **Palette:** Neon magenta (#ff00ff), cyan (#00ffff), green (#39ff14), orange (#ff5e00), red (#ff003c) on near-black (#050505)
- **Effects:** CRT scanlines overlay, flicker animations, hue-rotate on title, matrix dot grid background, typewriter cursor on streaming text
- **Typography:** Chakra Petch for headings/UI, Space Mono for numbers/stats/receipts
- **Aesthetic:** UFC broadcast meets crypto dashboard on fire

## Constraints

- Both model simulations run simultaneously, not sequentially (spec-stated)
- Responses stream in real-time with visible token counting (spec-stated)
- 60-second fight timer — the only way a fight ends (spec-stated, implemented)
- Cost calculation uses real published per-token pricing for each model (spec-stated)
- The site never breaks character — dead-serious combat sports voice at all times (spec-stated)

## Open Technical Questions

- How to handle API key management in a client-side app for live mode (user's keys vs hosted proxy?)
- Token counting accuracy with real APIs: use provider-specific tokenizers or estimate from stream chunks?
- Rate limiting strategy when multiple users fight simultaneously (future, post-V1)
