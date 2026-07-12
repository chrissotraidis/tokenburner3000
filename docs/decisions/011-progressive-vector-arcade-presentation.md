# Decision: Progressive Vector-Arcade Presentation

**Date:** 2026-07-11
**Who Decided:** User direction, refined by technical planning
**Status:** Accepted

## The Situation

The existing application is DOM-based. A full Three.js rewrite would add risk
merely to obtain CRT effects.

## What We Chose

Keep the React DOM interface, add a vector-arcade cabinet shell, CSS/SVG CRT
effects, and a lightweight canvas layer for particles and burning-money effects.
WebGL enhancements are progressive, never required for gameplay.

## What We Rejected

- Rebuilding the entire application in React Three Fiber
- Essential information communicated only through effects
- Shipping without reduced-motion and low-effects modes

## Consequences

- Visual effects must have a flat fallback.
- Performance and accessibility are acceptance gates.
- Canvas effects consume fight events rather than owning gameplay state.
