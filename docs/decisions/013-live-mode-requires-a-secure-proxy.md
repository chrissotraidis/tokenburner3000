# 013 — Sanctioned Live Requires a Secure Proxy

**Date:** 2026-07-11
**Status:** Accepted
**Decided by:** Product owner plan

## Decision

Real provider credentials must never be embedded in the client bundle or stored
as application-managed browser state. Sanctioned Live will require a trusted
server-side proxy (or equivalent server-owned provider adapter boundary) with
per-fight cost ceilings, streaming cancellation, timeouts, usage reconciliation,
availability reporting, and rate-limit recovery.

## Rejected

- Shipping provider keys in Vite environment variables.
- Treating user-entered browser keys as a secure production design.
- Coupling Live failures to the free Exhibition engine.

## Consequences

- Real API fighter calls are isolated in the server-backed Sanctioned Live path
  selected by Decision 017.
- Exhibition requires no keys, backend, account, or network.
- Provider adapter contracts, the proxy boundary, usage reconciliation, and cost
  warning flow ship together.
