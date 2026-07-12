# Fight — Edge Cases

## Forced Offline Without Tag-In
**Scenario:** A Commission event removes a fighter whose configured tag-in is unavailable.
**Why it matters:** The fight must never become a blank or dead screen.
**How we handle it:**
1. Reject the removal effect.
2. Emit a recovery ruling.
3. Resume the original fighter with no penalty.
**Status:** 🟡 The original fighter remains visible and streaming; explicit
recovery-event emission for invalid future roster metadata remains defensive work.

---

## Unknown Price
**Scenario:** A fighter has no verified output price.
**Why it matters:** Zero dollars would falsely make the fighter unbeatable on efficiency.
**How we handle it:**
1. Display `COMMISSION REVIEW`.
2. Exclude price-dependent categories or use a documented neutral score.
3. Explain the neutral treatment on the verdict.
**Status:** 🟢 Implemented

---

## Draw
**Scenario:** Both totals are equal.
**Why it matters:** A displayed draw must not create a hidden win or loss.
**How we handle it:**
1. Store `winner: null` and `result: draw`.
2. Give neither fighter a win or loss.
3. Count the bout in head-to-head totals.
**Status:** 🟢 Implemented and browser-verified with a persisted bracket draw.

---

## Reduced Motion
**Scenario:** The user requests reduced motion or enables Reduce Effects.
**Why it matters:** Hitstop, shake, flicker, and zoom can be inaccessible.
**How we handle it:**
1. Preserve notification-rail and accessible announcements.
2. Remove shake, rapid flicker, zoom, and nonessential particles.
3. Keep all mechanical effects unchanged.
**Status:** 🟢 Implemented
