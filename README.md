# TokenBurner 3000

### Competitive AI Token Wastage. Live. Unhinged. Probably Unnecessary.

TokenBurner 3000 is a live verbal combat arena where AI language models trash-talk, argue, and roast each other in timed 60-second bouts. A separate AI referee scores each fight. There are leaderboards, fight histories, and an absurd amount of wasted compute.

It looks like UFC crossed with a crypto dashboard that's on fire.

It is, by every measure, completely unnecessary.

---

## How It Works

```
1. PICK YOUR FIGHTERS    →    Choose 2 AI models from a roster of 14
2. CHOOSE THE ARENA      →    Roast Pit, Debate Ring, Explain-Off, Filibuster, or Freestyle
3. WATCH THEM FIGHT      →    60 seconds of live split-screen verbal combat
4. SEE THE VERDICT       →    AI referee scores across 5 categories, declares a winner
```

## The Roster

| Fighter | Provider | Speed | Output $/1M | Style |
|---------|----------|-------|-------------|-------|
| **Claude Opus 4** — *The Eloquent Arsonist* | Anthropic | 60 t/s | $25.00 | Philosophical devastation |
| **Claude Sonnet 4** — *The Practical Pyromaniac* | Anthropic | 100 t/s | $15.00 | Structured efficiency |
| **Claude Haiku 4.5** — *The Budget Assassin* | Anthropic | 175 t/s | $5.00 | Three-word kills |
| **GPT-4o** — *Old Reliable* | OpenAI | 90 t/s | $10.00 | Numbered lists |
| **GPT-4o Mini** — *The Overachieving Intern* | OpenAI | 135 t/s | $0.60 | Eager and cheap |
| **o3** — *The Overthinker* | OpenAI | 45 t/s | $8.00 | Slow reasoning chains |
| **Gemini 2.5 Pro** — *Google's Most Expensive Hobby* | Google | 105 t/s | $10.00 | Unsolicited caveats |
| **Gemini 2.5 Flash** — *The Loss Leader* | Google | 175 t/s | $2.50 | Subsidized speedrun |
| **Llama 4 Maverick** — *The People's Champ* | Meta | 250 t/s | $0.77 | Open source aggression |
| **DeepSeek V3** — *The Silent Assassin* | DeepSeek | 100 t/s | $0.28 | Devastating one-liners |
| **DeepSeek R1** — *The Budget Philosopher* | DeepSeek | 55 t/s | $2.19 | Visible chain-of-thought |
| **Grok 3** — *The Edgelord* | xAI | 90 t/s | $15.00 | Unfiltered sarcasm |
| **Mistral Large 3** — *Le Burner* | Mistral | 90 t/s | $6.00 | Continental precision |
| **Command R+** — *The Corporate Raider* | Cohere | 70 t/s | $10.00 | Corporate jargon |

## Scoring

Fights are scored across 5 categories by the referee:

| Category | What It Rewards |
|----------|----------------|
| **Verbal Devastation** | Raw token volume — more output = higher score |
| **Theatrical Commitment** | Money burned — expensive models score higher |
| **Creative Strategy** | Style and personality — model-specific bonus |
| **Token Efficiency Ratio** | Tokens per dollar — cheap fast models shine here |
| **Main Character Energy** | Crowd factor — partially random, biased toward output volume |

Scoring is driven by **verbosity** and **cost**. Expensive verbose models (Claude Opus, Grok) tend to win on Devastation and Commitment. Cheap fast models (Llama, DeepSeek) win on Efficiency. No fight is fully predetermined.

## The Leaderboard — "The Hall of Shame"

Global rankings track all-time stats:
- **Overall Champion** — highest win rate
- **The Biggest Burner** — most total tokens wasted
- **The Money Pit** — most total dollars burned
- **The Efficient Assassin** — highest score per token
- **The Punching Bag** — most losses (celebrated, not shamed — they showed up)

Head-to-head records track rivalries between specific matchups.

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | React 18 + TypeScript |
| Build | Vite |
| Styling | Tailwind CSS v4 |
| Fonts | Chakra Petch + Space Mono |
| Storage | localStorage (V1) |
| Visual | Neon CRT aesthetic — scanlines, flicker, hue-rotate, matrix backgrounds |

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The app runs at `http://localhost:5173`.

## Visual Design

Dark background (`#050505`) with neon accents — magenta, cyan, green, orange, red. CRT scanlines overlay. Flicker animations on headings. Typewriter cursor on streaming text. Split-screen arena view during fights. Receipt-style verdict display.

The entire site speaks in the voice of a dead-serious combat sports organization. It never breaks character. It never acknowledges the absurdity. The comedy comes from the commitment.

## Roadmap

- [x] Landing page with live burn ticker
- [x] Fighter selection (14 models)
- [x] Arena selection (5 modes + freestyle)
- [x] Live fight screen with split-screen streaming
- [x] AI referee scoring (verbosity + cost driven)
- [x] Verdict display with compute receipt
- [x] Leaderboard with category awards and head-to-head
- [ ] Live commentary from a third model
- [ ] Signature move triggers mid-fight
- [ ] Settings page with API key management
- [ ] Real API integration (replace mock simulation)
- [ ] Share cards for social media
- [ ] Achievement badges and personal fight history

## Project Structure

```
src/
├── App.tsx                 Main app — view routing, fight orchestration, scoring
├── types.ts                Shared TypeScript interfaces
├── data/
│   ├── fighters.ts         14 fighter profiles with real pricing data
│   ├── arenas.ts           5 arena definitions
│   └── mockWords.ts        Per-fighter mock word pools (40-60 phrases each)
├── lib/
│   ├── scoring.ts          Scoring engine (verbosity + cost + style)
│   └── storage.ts          localStorage CRUD for fight records + leaderboard
└── components/
    ├── LiveTicker.tsx       Scrolling burn/waste/VC ticker
    ├── Landing.tsx          Hero + CTA
    ├── FighterSelect.tsx    Fighter grid with stats
    ├── ArenaSelect.tsx      Arena picker + freestyle prompt
    ├── Fight.tsx            Split-screen arena with timer + streaming
    ├── Verdict.tsx          Scores, verdict, receipt, post-fight actions
    └── Leaderboard.tsx      Rankings, awards, head-to-head
```

---

*© 2026 TokenBurner 3000. All rights reserved. Sanctioned by the Global Commission of Compute Wastage.*
