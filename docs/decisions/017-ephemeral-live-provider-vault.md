# 017 — Ephemeral Live Provider Vault

**Date:** 2026-07-12
**Status:** Accepted
**Decided by:** Product owner request plus official provider security guidance

## Decision

Sanctioned Live uses a same-origin server boundary. User-entered provider keys
are stored only in an expiring in-memory session identified by an HttpOnly,
SameSite=Strict cookie. The client can set, test, replace, and clear credentials
but can only read boolean status. Per-fighter routes are non-secret and may be
stored in browser settings.

OpenRouter is the universal adapter and source for provider-reported billed
cost. Direct adapters use fixed official hosts and provider usage metadata; they
do not accept arbitrary base URLs.

## Rejected

- localStorage, IndexedDB, or Vite environment variables for user keys
- sending provider calls directly from the browser
- arbitrary custom proxy URLs, which create SSRF and credential-forwarding risk
- estimated tokenization when provider usage is missing

## Consequences

- `npm run dev` and the production server both mount the same Live API routes.
- Restarting the server intentionally clears every key.
- A multi-instance deployment needs a shared encrypted vault and real user auth
  before Live sessions can roam between instances.
- Decision 013 remains the governing security boundary; this record selects its
  first implementation.
