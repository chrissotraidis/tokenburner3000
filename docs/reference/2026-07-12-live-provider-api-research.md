# Sanctioned Live Provider API Research — 2026-07-12

This is the implementation snapshot for real provider fights. Re-check model
IDs and endpoint behavior before a public release because the roster moves
faster than the cabinet firmware.

## Findings

1. Provider-reported usage is the only defensible source for an `ACTUAL` token
   counter. Visible text cannot reproduce provider tokenization, hidden reasoning,
   cache accounting, or multimodal tokens.
2. OpenRouter is the strongest universal route for this game. Its final response
   includes native prompt/completion/total tokens and a reported `usage.cost`.
3. Direct-provider responses report token usage but generally do not report the
   final billed dollar amount. Token counts are actual; cost must be labeled as
   an estimate from the configured price snapshot.
4. Keys cannot be a browser-only feature. OpenAI and Google explicitly warn
   against deploying keys client-side and require a backend proxy.
5. A roster name and API model ID are separate volatile facts. Routes must stay
   editable and unavailable models must never silently substitute.

## Implemented Contracts

| Provider | Official contract used | Usage source |
|---|---|---|
| OpenRouter | `POST /api/v1/chat/completions` | prompt, completion, total, cache, reasoning, billed cost |
| OpenAI | `POST /v1/responses` | input, output, total, cache, reasoning |
| Anthropic | `POST /v1/messages` | input, output, and cache fields |
| Google | `models/{model}:generateContent` | prompt, candidates, thoughts, cache, total |
| xAI | `POST /v1/chat/completions` | OpenAI-compatible usage |
| DeepSeek | `POST /chat/completions` | OpenAI-compatible usage plus cache/reasoning |
| Z.ai | `POST /api/paas/v4/chat/completions` | OpenAI-compatible usage |
| Moonshot | `POST /v1/chat/completions` | OpenAI-compatible usage |

## Verified OpenRouter Roster Routes

The public Models API listed routes for GPT-5.6 Sol, GPT-5.5, Claude Fable 5,
Claude Opus 4.8, Claude Sonnet 5, Claude Haiku 4.5, Gemini 3.1 Pro Preview,
Gemini 3.5 Flash, Grok 4.5, Grok 4.3, Grok 4.20 Multi-Agent, DeepSeek V4
Flash/Pro, GLM-5.2, Kimi K2.7 Code, and Llama 4 Maverick.

Muse Spark 1.1, Claude Mythos 5, and Gemini 3.5 Pro did not have verified public
OpenRouter routes during this check. Mythos and Gemini Pro are already restricted
in the game. Muse remains visible but `NEEDS ROUTE` in Live mode.

## Primary Sources

- OpenAI key safety: https://help.openai.com/en/articles/5112595-best-practices-for-api-key-safety
- OpenAI Responses usage: https://platform.openai.com/docs/api-reference/responses-streaming/response/completed
- OpenAI current models: https://developers.openai.com/api/docs/models
- Anthropic Messages API: https://platform.claude.com/docs/en/api/messages/create
- Anthropic API overview: https://platform.claude.com/docs/en/api/overview
- Google API-key security: https://ai.google.dev/gemini-api/docs/api-key
- Gemini generateContent/usageMetadata: https://ai.google.dev/api/generate-content
- OpenRouter usage accounting: https://openrouter.ai/docs/cookbook/administration/usage-accounting
- OpenRouter Models API: https://openrouter.ai/docs/guides/overview/models
- OpenRouter authentication: https://openrouter.ai/docs/api/reference/authentication
- xAI REST API: https://api.x.ai/docs/
- xAI usage and pricing: https://docs.x.ai/developers/advanced-api-usage/prompt-caching/usage-and-pricing
- DeepSeek chat completions: https://api-docs.deepseek.com/api/create-chat-completion
- Z.ai chat completions: https://docs.z.ai/api-reference/llm/chat-completion
