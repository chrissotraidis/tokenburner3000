# Release Runbook

## Purpose

Defines the smallest proof set required to call a TokenBurner 3000 release
ready. It protects the deterministic fight contract, the provider-key boundary,
the fixed cabinet layout, and the public documentation surface.

## Automated Gate

```bash
npm run lint
npm test
npm run build
git diff --check
```

All four commands must pass from the intended release commit.

## Browser Gate

Verify at desktop and 390×844:

- Lobby actions do not overlap in default and hover states.
- Fighter, arena, Face Off, fight, verdict, Hall of Shame, and Live Settings
  remain inside the cabinet viewport.
- Transcript output scrolls inside each fighter panel.
- Operational type remains at least 12px desktop and 11px compact.
- Reduced Effects removes optional canvas and aggressive motion.
- Restricted clearance shows correct progress from existing history.
- Historical fighter portraits resolve without broken-image placeholders.
- Verdict Summary, Scores, Timeline, and Receipt are readable and complete.

## Live Safety Gate

- No provider credential is present in tracked files, the client bundle,
  localStorage, API status responses, or saved fights.
- A missing or invalid credential fails visibly without invented usage.
- Provider-reported and estimated cost labels remain distinct.
- The spend guard is described as a stop condition, not a billing guarantee.
- A dummy or test credential is cleared before screenshots or publication.

## Documentation Gate

- README screenshots represent the current interface.
- Roster facts retain a dated source snapshot and verification labels.
- Changed behavior is reflected in its feature overview and `docs/status.md`.
- Significant architectural choices have a decision record.
- Remaining work is explicit rather than implied complete.

## Publication Gate

1. Review `git status` and stage only intended files.
2. Commit from a release branch.
3. Push and open a reviewable pull request.
4. Merge only after the automated and browser gates pass.
5. Update local `main` and prove `HEAD` matches `origin/main`.

## Acceptance Criteria

- [x] Release verification is reproducible from repository commands.
- [x] Visual, accessibility, and credential checks have explicit coverage.
- [x] The runbook distinguishes local Live readiness from hosted production readiness.

## Status

🟢 Active release contract.
