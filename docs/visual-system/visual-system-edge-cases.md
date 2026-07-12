# Visual System — Edge Cases

## Reduced Motion Changes Mid-Fight
**Scenario:** The user changes the effects setting during a bout.
**Why it matters:** Active animations must stop without losing game state.
**How we handle it:**
1. Update the root effects attribute immediately.
2. Clear nonessential transient particles.
3. Preserve notification-rail and accessible event announcements.
**Status:** 🟢 Implemented

---

## Low Frame Rate
**Scenario:** Rendering falls below the performance budget.
**Why it matters:** Visual flair must not delay controls or text streaming.
**How we handle it:**
1. Reduce glow, flicker, and shake layers.
2. Preserve DOM rendering and timer accuracy.
3. Offer the persistent Reduce Effects control.
**Status:** 🟢 Fight presentation is DOM/CSS-only, and Reduce Effects removes
nonessential animation. Physical target devices remain ordinary pre-release
spot checks.
