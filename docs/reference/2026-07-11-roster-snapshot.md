# July 11, 2026 Roster Snapshot

**Status:** Accepted planning baseline
**Last verified:** 2026-07-11
**Refresh cadence:** Re-check before every public release and at least monthly.

This snapshot separates product facts from game design. A fighter may be included
for its story even when a volatile field is still under review, but the UI must
never present an unverified value as fact.

## Provenance States

- **verified** — supported by a primary provider source or the named independent index.
- **game-stat** — deliberately tuned for play; not presented as measured throughput.
- **satirical** — fictionalized mechanic inspired by a sourced event or product behavior.
- **under-review** — not sufficiently supported by a primary source; shown as
  `COMMISSION REVIEW` instead of an invented value.

## Frozen Main Card

| Fighter | Tier | Output $/1M | Intelligence | Availability | Verification notes |
|---|---|---:|---:|---|---|
| Claude Fable 5 | main | 50 | 60 | active | Anthropic launch, pricing, fallback, suspension and restoration verified; AA index verified |
| Claude Opus 4.8 | main | 25 | 56 | active | Anthropic pricing and effort controls verified; AA index verified |
| Claude Sonnet 5 | main | 10 intro | 53 | active | Intro price through 2026-08-31 verified; tokenizer multiplier verified; AA index verified |
| Claude Haiku 4.5 | main | 5 | — | active | Anthropic pricing and fastest-model positioning verified |
| GPT-5.6 | main | 30 / 15 / 6 | — | limited | Sol/Terra/Luna names, prices, IDs, caching, limited preview and Cerebras target verified |
| GPT-5.5 | main | 30 | 55 | active | OpenAI price and AA index verified |
| Gemini 3.1 Pro | main | 12 | — | preview | Google preview status and standard price below 200K verified |
| Gemini 3.5 Flash | main | 9 | 50 | active | Google price and launch verified; current AA index is 50 under v4.1 |
| Grok 4.5 | main | 6 | 54 | active, EU pending | SpaceXAI price, 80 TPS claim, efficiency positioning, and EU restriction verified |
| Grok 4.3 | main | 2.50 | — | active | SpaceXAI API price and X search capability verified |
| Grok 4.20 Multi-Agent | main | 2.50 | — | beta | Four/16-agent orchestration and API price verified; named-agent lore is not verified |
| Muse Spark 1.1 | main | — | 51 | public preview | Meta launch and model API preview verified; price and `Contemplating` label remain under review |
| DeepSeek V4 Flash | main | 0.28 | — | active | Official price, cache price, model ID and 1M context verified |
| DeepSeek V4 Pro | main | 0.87 | — | active | Official price, model ID, open weights and 1M context verified |
| GLM-5.2 | guest | — | — | active/open | Z.ai launch, MIT license and 1M context verified; per-token price under review |
| Kimi K2.7 Code | guest | — | — | active | Official Moonshot announcement verified; pricing and 100-agent claim under review |

## Restricted and Legends

| Fighter | Tier | Status | Rules |
|---|---|---|---|
| Claude Mythos 5 | restricted | locked | Hidden Glasswing boss; not normally selectable |
| Gemini 3.5 Pro | restricted | no-show | Visible teaser card; cannot enter a sanctioned bout until availability is verified |
| Llama 4 Maverick | legend | retired | Historical records remain readable; available only through legends presentation |

## Source Ledger

Primary provider sources:

- OpenAI GPT-5.6 preview and pricing: https://openai.com/index/previewing-gpt-5-6-sol/
- OpenAI model catalog: https://developers.openai.com/api/docs/models
- OpenAI GPT-5.5: https://developers.openai.com/api/docs/models/gpt-5.5
- Anthropic Fable and Mythos: https://www.anthropic.com/news/claude-fable-5-mythos-5
- Anthropic Fable suspension: https://www.anthropic.com/news/fable-mythos-access
- Anthropic Fable restoration: https://www.anthropic.com/news/redeploying-fable-5
- Anthropic Opus 4.8: https://www.anthropic.com/news/claude-opus-4-8
- Anthropic Sonnet 5: https://www.anthropic.com/news/claude-sonnet-5
- Anthropic Haiku 4.5: https://www.anthropic.com/claude/haiku
- Google Gemini pricing: https://ai.google.dev/gemini-api/docs/pricing
- Google Gemini 3.5 Flash launch: https://blog.google/innovation-and-ai/technology/developers-tools/google-io-2026-developer-highlights/
- SpaceXAI Grok 4.5: https://x.ai/news/grok-4-5
- SpaceXAI pricing: https://docs.x.ai/developers/pricing
- SpaceXAI multi-agent docs: https://docs.x.ai/developers/model-capabilities/text/multi-agent
- Meta Muse Spark 1.1: https://ai.meta.com/blog/introducing-muse-spark-meta-model-api/
- DeepSeek pricing: https://api-docs.deepseek.com/quick_start/pricing
- DeepSeek V4 launch: https://api-docs.deepseek.com/news/news260424/
- Z.ai GLM-5.2: https://z.ai/blog/glm-5.2
- Moonshot K2.7 announcement index: https://forum.moonshot.ai/c/announcement/5

Independent seeding source:

- Artificial Analysis model index pages: https://artificialanalysis.ai/models

## Editorial Rules

- Government, cybersecurity, acquisition, and personnel claims require a direct
  source before they appear as factual UI copy.
- Game mechanics may fictionalize verified events, but the roster metadata must
  label them `satirical` and the product must remain in its dead-serious voice.
- Unknown prices are nullable. They are never coerced to zero.
- Speed is a tunable game stat unless explicitly labeled as measured throughput.
- Old fighter IDs remain resolvable so saved local fight history survives roster changes.
