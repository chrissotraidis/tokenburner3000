# Sanctioned Live Operator Guide

## Purpose

Sanctioned Live calls real model APIs and reconciles provider-reported usage.
Use it only after Exhibition is working. Provider charges are real, model access
varies by account and region, and the in-app spend guard cannot replace limits
configured with the provider.

## Start the Live Boundary

During development, `npm run dev` mounts the local Live proxy through Vite. For
a production-like local check:

```bash
npm run build
npm start
```

Open `http://127.0.0.1:4173`.

## Configure a Provider

1. Open the cabinet menu and choose **Sanctioned Live**.
2. Add an OpenRouter key or a supported direct-provider key.
3. Test the credential. The client receives status, never the submitted secret.
4. Review the provider and model ID assigned to each desired fighter.
5. Correct any stale or unavailable model ID before entering the Live arena.
6. Set a conservative spend guard and acknowledge provider billing.

Supported routes are OpenRouter, OpenAI, Anthropic, Google Gemini, xAI,
DeepSeek, Z.ai, and Moonshot. Meta-hosted fighters use OpenRouter until a direct
public contract is verified.

## What the Receipt Means

| Receipt field | Authority |
|---|---|
| Input/output/total tokens | Provider response usage object |
| OpenRouter cost | Provider-reported billed cost when returned |
| Direct-provider cost | Estimate from actual tokens and configured prices |
| Missing usage | Unknown; the cabinet never manufactures a count |
| Failed exchange | Visible provider error; no invented tokens or score |

Live bouts use three concurrent exchanges rather than the deterministic
60-second Exhibition clock. A spend guard stops later exchanges after reconciled
cost reaches the threshold; it cannot undo requests already accepted upstream.

## Secret Handling Contract

- Keys are submitted to the same-origin server boundary.
- Keys live only in an expiring in-memory session vault.
- The session identifier is an HttpOnly, SameSite=Strict cookie.
- Keys are never written to localStorage, fight records, logs, or the client bundle.
- Restarting the server clears the vault.
- Hosted multi-instance use requires real authentication and encrypted shared
  secret storage before it is production-ready.

## Safe Verification

1. Use a restricted provider key with a low provider-side budget.
2. Test one route before configuring the whole roster.
3. Confirm the selected fighters show **Live Ready**.
4. Run a low-guard bout and inspect the Receipt tab.
5. Clear the credential from Settings after the session.
6. Search logs and browser storage if validating a new adapter; no secret value
   should appear.

## Failure Recovery

- **Needs Route:** supply a valid model ID and configured provider.
- **Unauthorized:** replace and retest the credential.
- **Rate Limited:** wait, change route, or return to Exhibition.
- **Timeout:** retry the exchange or forfeit; completed usage remains visible.
- **Budget Stop:** accept the early result or start a new bout with a deliberate limit.

## Related

- `docs/sanctioned-live/sanctioned-live-overview.md`
- `docs/sanctioned-live/sanctioned-live-flow.md`
- `docs/sanctioned-live/sanctioned-live-edge-cases.md`
- `docs/reference/2026-07-12-live-provider-api-research.md`
- `docs/decisions/017-ephemeral-live-provider-vault.md`

## Status

🟢 Implemented for local single-instance use. Public hosted accounts remain a
separate production-infrastructure decision.
