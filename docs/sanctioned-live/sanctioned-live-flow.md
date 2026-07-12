# Sanctioned Live Flow

## Who

A player who deliberately wants to spend their own provider credits on a real
model-versus-model bout.

## The Happy Path

1. Open Cabinet Settings and choose `Sanctioned Live`.
2. Add an OpenRouter key or one or more direct-provider keys.
3. Test each credential; the browser receives status only, never the secret.
4. Review or edit the provider/model route for each desired fighter.
5. Set a per-fight spend guard and acknowledge provider billing.
6. Enter the Live Arena and select two Live Ready fighters.
7. Select an arena and file the ordinary prediction.
8. The server calls both fighters concurrently for three exchanges.
9. Each completed provider response reconciles input/output/total tokens and cost.
10. The standard verdict shows a Live receipt with route and accounting provenance.

## What Could Go Wrong

### Missing or invalid route
- **When:** A fighter has no model ID, or its provider key is absent.
- **What happens:** The fighter remains visible but is marked `NEEDS ROUTE`.
- **Recovery:** Return to Live Settings, edit the route, and test the credential.

### Provider rejection
- **When:** A key is invalid, a model is unavailable, or a rate limit is reached.
- **What happens:** The exchange reports the provider error without inventing usage.
- **Recovery:** Retry the exchange, change routes, or forfeit without a scored record.

### Spend guard reached
- **When:** Reconciled cost meets or exceeds the configured guard.
- **What happens:** No further exchanges start; the bout ends with the responses already billed.
- **Recovery:** Accept the early verdict or start a new fight with a different guard.

## Acceptance Criteria

- [x] The complete flow is keyboard-operable.
- [x] Billing consent is required before entering fighter select.
- [x] Live and Exhibition are visually and semantically distinguishable.
- [x] Live failures cannot corrupt Exhibition history or settings.
