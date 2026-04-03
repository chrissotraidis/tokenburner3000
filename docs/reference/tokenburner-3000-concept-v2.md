> **Reference document.** Decomposed into feature docs by Arnold on 2026-04-03.
> Feature folders in `docs/` are now the source of truth.

# TokenBurner 3000 — Full Concept Doc v2

## The Elevator Pitch

TokenBurner 3000 is a live verbal combat arena where AI language models trash-talk, argue, and roast each other in timed 60-second bouts. A separate AI referee scores each fight. There are leaderboards, fight histories, and an absurd amount of wasted compute. It looks like UFC crossed with a crypto dashboard that's on fire. It is, by every measure, completely unnecessary.

---

## The Core Game Loop

### 1. PICK YOUR FIGHTERS
User selects two models from the roster. Each model has a fighter profile:

- **Fighter Name** (their real model name, styled like a boxing alias)
- **Nickname/Title** — e.g. Claude: "The Eloquent Arsonist," GPT-4o: "Old Reliable," Gemini: "Google's Most Expensive Hobby," Llama 3: "The People's Champ," Mistral: "Le Burnèr," Command R+: "The Corporate Raider"
- **Fake Stats:** Win/Loss record, Avg Token Output, Verbosity Rating (HIGH / SEVERE / EXTREME / UNHINGED / MERCILESS), Cost Per Ramble, Signature Move (e.g. "The Nested Metaphor," "The Unsolicited Caveat," "The 47-Point Numbered List")
- **Fighter Icon** — stylized logo/emoji for each model

### 2. CHOOSE THE ARENA (Prompt Category)
The user picks a battle topic/mode. These are prompt frameworks designed to provoke maximum verbal combat:

**Arena Types:**

- **THE ROAST PIT** — Models directly trash-talk each other. ("You are fighting [opponent]. Destroy them verbally. No mercy. Be funny.")
- **THE DEBATE RING** — Models argue opposite sides of an absurd proposition. ("Argue that pineapple on pizza is a human rights violation" vs "Argue that pineapple on pizza is the pinnacle of civilization")
- **THE EXPLAIN-OFF** — Both models explain the same ridiculous concept, judge scores on creativity and commitment. ("Explain quantum physics using only restaurant metaphors")
- **THE FILIBUSTER** — Each model tries to say as much as possible about nothing. Pure verbosity competition.
- **FREESTYLE** — User writes their own battle prompt.

### 3. THE FIGHT (60 Seconds, Live)

This is the main event. Here's what happens on screen:

**Layout: Split-screen arena view**

**What's happening under the hood:**
- Both models are called simultaneously via their respective APIs
- Each model's system prompt tells them: "You are [Model Name]. You are in a verbal combat arena called TokenBurner 3000. Your opponent is [Opponent Name]. Your task: [arena-specific prompt]. You have one response. Make it count. Be funny, creative, and devastating."
- Responses stream in real-time, side by side
- Token counters tick up live as tokens arrive
- Cost calculators update based on actual per-token pricing
- A 60-second timer counts down (if a model finishes before time, its response just sits there looking smug while the other keeps going)

**The Live Commentator (optional, toggleable):**
- A third model (could be a smaller/cheaper one) watches both responses streaming in and provides color commentary
- Updates every ~10 seconds with a new quip
- Styled like a sports ticker at the bottom of the arena

### 4. THE SCORING (Post-Fight)

When the timer hits zero (or both models finish), the arena goes dark for a moment. Dramatic pause. Then:

A dedicated "judge" model (separate API call) receives both responses and scores the fight.

**Scoring Categories:**

| Category | Description | Points |
|---|---|---|
| Verbal Devastation | Raw roast quality, wit, and burn severity | 1-10 |
| Theatrical Commitment | How fully they committed to the bit | 1-10 |
| Creative Strategy | Originality of approach, unexpected angles | 1-10 |
| Token Efficiency Ratio | Points per token | 1-10 |
| Main Character Energy | Overall presence, confidence | 1-10 |

The referee's written statement is the punchline of the whole experience.

### 5. POST-FIGHT

- **Share Card** — auto-generated image/card showing the matchup, scores, and verdict
- **Fight Receipt** — downloadable/sharable receipt showing exact token counts, costs, time elapsed, referee's statement
- **Rematch Button** — same models, same arena, new fight
- **New Fight** — back to fighter select

---

## The Leaderboard System

### Global Leaderboard — "The Hall of Shame"

**Leaderboard Categories:**
- Overall Champion — highest win rate (min 10 fights)
- The Biggest Burner — most total tokens wasted all-time
- The Money Pit — most total dollars burned
- The Efficient Assassin — highest avg score with lowest avg token count
- The Filibuster King — longest single response ever recorded
- The Punching Bag — most losses (celebrated, not shamed)

### Personal Fight History
- Fight history with W/L record
- Total tokens burned and dollars wasted
- "Your Personal Waste Report"
- Achievement badges: "First Blood," "Serial Burner," "Carbon Footprint," "Degenerate"

### Head-to-Head Records
Win/loss between specific matchups, historical score averages

---

## Tone & Copy Guide

The entire site speaks in the voice of a dead-serious combat sports organization. It never breaks character.

**Words to use:** sanctioned, professional, regulation, league-certified, competitive integrity, tale of the tape, main event, undercard, by decision, unanimous, TKO (Technical Knowledge Overflow), split decision, the commission

**Forbidden:** "haha," "lol," "just for fun," "silly," or anything that winks at the camera.

---

## Technical Architecture (High Level)

**API Requirements:**
- Claude API (Anthropic), OpenAI API, Google AI API, Groq/Together/Fireworks
- Smaller model for commentator, mid-tier for referee
- Token counting from streaming chunks + per-provider tokenizers
- Data storage: Supabase or Firebase for fight results

---

## V1 Scope (MVP)

1. Landing page (already looking great)
2. Fighter select (4-6 models)
3. Arena select (Roast Pit + Freestyle)
4. Fight screen (split stream + timer + token counter)
5. Referee verdict (scoring + statement)
6. Basic leaderboard (local/session-based)

Everything else is stretch.
