# Sanctioned Live — Edge Cases

## Credential exposure
**Scenario:** A user inspects client state, storage, or network responses.
**Why it matters:** Provider keys can create direct financial liability.
**How we handle it:**
1. Password input exists only until save completes.
2. The server stores the key in an expiring in-memory session keyed by an HttpOnly cookie.
3. Status endpoints return only configured/tested timestamps.
**Status:** 🟢 Handled

## Authoritative usage arrives only at completion
**Scenario:** Text is visible before a provider reports final usage.
**Why it matters:** A provisional number would undermine the real-counter promise.
**How we handle it:**
1. The fighter is marked `AWAITING PROVIDER METER` while the request runs.
2. The counter changes only when usage metadata arrives.
3. Missing usage makes the exchange unscored and visibly unaudited.
**Status:** 🟢 Handled

## Unknown or future model slug
**Scenario:** The roster name exists before a provider publishes a callable ID.
**Why it matters:** 2026 model IDs and availability change quickly.
**How we handle it:**
1. Routes are editable independently of fighter identity.
2. OpenRouter model IDs can be discovered from its models endpoint.
3. An unavailable route never silently substitutes a different model.
**Status:** 🟢 Handled

## Partial round
**Scenario:** One fighter succeeds and the other times out.
**Why it matters:** The successful call may already be billed.
**How we handle it:**
1. Preserve the successful response and its usage.
2. Show the failed corner and allow retry before the next round.
3. A forfeit creates no scored record unless the user accepts an early verdict.
**Status:** 🟢 Handled
