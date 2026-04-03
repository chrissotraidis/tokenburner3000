# Decision: 60-Second Fight Timer

**Date:** From initial spec
**Who Decided:** Per spec
**Status:** Accepted
**Source:** tokenburner-3000-concept-v2.md, section "3. THE FIGHT"

## The Situation
Fights need a fixed duration to create urgency and keep the experience snappy.

## What We Chose
60-second timer, single round. If a model finishes before time, its response sits while the opponent keeps going.

## What We Rejected
Not discussed in spec. Alternatives would include: variable timer, multi-round fights, no timer (wait for both to finish).

## Why
60 seconds is long enough for models to produce entertaining content but short enough to keep the experience punchy. The asymmetry of one model finishing early adds comedic tension.

## Consequences
- Models with faster inference have a natural advantage in token volume
- Very slow models might produce notably less content in the window
- Cost per fight is bounded by the time limit
