# Competition Modes

## What It Does

Packages the existing sanctioned fight loop into replayable local programs. All
programs reuse fighter selection, arena rules, the shared event engine, scoring,
the verdict, and fight-record persistence.

## Modes

- **Best of Three:** two selected fighters repeat until one reaches two wins.
- **Provider Card:** three pairings are generated from two selected providers;
  provider wins determine the card result.
- **Four-Fighter Bracket:** the top four eligible seeded fighters contest two
  semifinals and one final.
- **Daily Featured Matchup:** a deterministic date seed selects one pairing for
  the local calendar day.
- **Exhibition:** remains the default free single-fight path.

Eight-fighter brackets remain outside this upgrade cycle. (user-stated)

## Core Rules

- A program stores fighter IDs and outcome summaries, never live fighter object
  references. (decided)
- A drawn program bout does not advance a bracket or award a series/card win; it
  must be replayed. (Arnold-inferred)
- The active program record is saved locally after every completed bout.
- New bouts reuse the existing arena and rules until the user exits the program.
- Daily selection is stable for the date and does not require a network call.

## Acceptance Criteria

- [x] Best-of-three stops once one fighter has two wins.
- [x] Provider cards contain up to three valid cross-provider matchups.
- [x] A four-fighter bracket advances real fight winners into one final.
- [x] A drawn program bout is replayed rather than silently advanced.
- [x] Program progress survives refresh and can be resumed.
- [x] Every program bout produces a normal versioned fight record and event log.

## Status

🟢 Implemented — all four local programs use the Exhibition fight loop and a
versioned resumable ledger.
