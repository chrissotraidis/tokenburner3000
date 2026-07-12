# Competition Modes Flow

1. Player opens Fight Programs from the landing screen.
2. Player chooses a program.
3. Best-of-three uses normal fighter selection. Provider Card asks for two
   providers. Bracket and Daily generate their disclosed pairings.
4. Player selects one arena and ruleset for the program.
5. Each bout runs through Tale of the Tape, Fight, and Verdict.
6. The verdict updates and persists the program ledger.
7. If another bout is required, Continue loads its matchup and returns to Tale
   of the Tape with a new seed.
8. On completion, the verdict names the program winner and offers a new program
   or ordinary Exhibition.

## Recovery

- Refresh: the active ledger appears as a resumable card in Fight Programs.
- Missing/retired fighter: resolve through the legacy fighter snapshot map; if
  no eligible fighter remains, end the program with a clear recovery notice.
- Draw: preserve the ledger and replay the same bout with a new seed.
