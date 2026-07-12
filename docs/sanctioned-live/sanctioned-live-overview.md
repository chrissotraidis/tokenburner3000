# Sanctioned Live

## What It Does

Runs a paid fight against real model APIs while keeping TokenBurner’s existing
fighters, arenas, portraits, scoring, verdict, and satire. Provider-reported
usage is the source of truth for the live token counter. (user-stated)

## Core Rules

- Exhibition remains the default, free, deterministic mode. (decided)
- Provider credentials never enter the bundle or persistent browser storage;
  they live only in a short-lived server-side session vault. (decided)
- OpenRouter is the universal route. Documented direct adapters are available
  for OpenAI, Anthropic, Google, xAI, DeepSeek, Z.ai, and Moonshot. (decided)
- Every fighter route names an explicit provider and model ID. A roster display
  name is never assumed to be a valid API model ID. (decided)
- A fighter is Live Ready only when its route is valid and that provider has a
  session credential. Restricted and retired roster rules still apply. (decided)
- Token totals come from the provider response: OpenAI `usage`, Anthropic
  `usage`, Gemini `usageMetadata`, or the OpenAI-compatible usage object. (decided)
- OpenRouter’s returned `usage.cost` is labeled provider-reported. Direct-provider
  cost is labeled estimated from configured input/output prices. (decided)
- Live bouts use three simultaneous exchanges with a timeout and user-defined
  spend guard. They do not pretend to be deterministic 60-second simulations.
  (decided)
- No API response means no invented tokens. Failed exchanges remain visible and
  may be retried or forfeited. (decided)

## Provider Coverage

| Provider route | Adapter | Authoritative usage |
|---|---|---|
| OpenRouter | OpenAI-compatible chat completions | prompt, completion, total, cache, reasoning, billed cost |
| OpenAI | Responses API | input, output, total, cached, reasoning |
| Anthropic | Messages API | input and output |
| Google | Gemini generateContent | prompt, candidates, thoughts, total, cache |
| xAI | OpenAI-compatible chat completions | prompt, completion, total |
| DeepSeek | OpenAI-compatible chat completions | prompt, completion, total, cache, reasoning |
| Z.ai | OpenAI-compatible chat completions | prompt, completion, total |
| Moonshot | OpenAI-compatible chat completions | prompt, completion, total |

Meta-hosted fighters may be routed through OpenRouter when listed. No direct
Meta adapter ships until an official public endpoint and response contract can
be verified. (decided)

## Acceptance Criteria

- [x] Settings expose credentials for every supported direct service plus OpenRouter.
- [x] Saved keys disappear from the form and never appear in localStorage or API responses.
- [x] Users can test, replace, and clear each session credential.
- [x] Every roster fighter exposes an editable provider/model route.
- [x] Live entry reports exactly which selected fighters are ready or blocked.
- [x] A live bout calls both configured models concurrently for each exchange.
- [x] Counters reconcile only from provider-reported token usage.
- [x] OpenRouter billed cost and direct estimated cost are labeled differently.
- [x] Timeouts, rate limits, provider errors, and budget stops produce recoverable UI.
- [x] Exhibition works unchanged with no backend credentials.

## Status

🟢 Implemented — ephemeral provider vault, routing matrix, metered three-round
bout, error recovery, spend guard, and Live receipt are active.
