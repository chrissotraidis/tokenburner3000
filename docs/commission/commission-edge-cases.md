# Commission — Edge Cases

## Both Fighters Become Ineligible
**Scenario:** Two scheduled rulings would remove both fighters.
**Why it matters:** The bout would stop being a fight.
**How we handle it:**
1. Accept the first valid ruling only.
2. Convert the second to a warning.
3. Continue the bout.
**Status:** 🟢 Implemented by scheduling at most one disruptive ruling total.

---

## Ruling Fires Near Time Expiry
**Scenario:** A ruling is scheduled in the last three seconds.
**Why it matters:** There is no time for the recovery to be understood.
**How we handle it:**
1. Suppress disruptive rulings after the final-ten countdown begins.
2. Allow commentary-only warnings.
**Status:** 🟢 Implemented; disruptive rulings schedule before the final-ten window.
