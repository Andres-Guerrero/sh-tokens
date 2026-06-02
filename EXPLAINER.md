# Reading the Token Explorer — a guide for the team & stakeholders

## What you're looking at

A **design token** is a named decision — a color, a spacing value, a text size — stored once and reused everywhere. The explorer shows how those decisions connect, from the rawest value on the left to the finished component on the right.

It reads like a sentence, left to right:

> **a raw value → gains a meaning → becomes a reusable recipe → becomes a component's setting → shows up in a component.**

Five columns, one per step. Click anything in any column and the whole view filters to just that item's chain — so you can see, for example, every component that depends on "orange 500," or everything a modal is built from. That's the core idea: **nothing is a dead end; everything traces.**

---

## The five columns

### ① Tier 1 · Primitive — *the raw value*

The literal values: the exact hex colors, pixel spacings, stroke widths. `orange.500 = #F15C02`. These are never used directly by a component; they're the raw material everything else points at.

**Grouped by "ramp"** — color families (gray, blue, orange, red, green, yellow, brown), the spacing scale, stroke widths — because that's how raw values are naturally organized.

One thing to know: this column only shows primitives that are **actually in use**. The full palette is larger; we hide anything nothing references, so the list always reflects what the system truly relies on.

### ② Tier 2 · Foundation / Identity — *the meaning*

The first layer of meaning. Instead of "gray 800," you get **`text.default`** — same value, but now it says *what it's for*. This is the layer designers and developers actually agree on; it's the contract between them.

**Grouped by the kind of meaning:**

- **Foundations** — `text`, `bg`, `border`, `icon`, `focus` (the universal basics)
- **Identities** — `commerce` (the orange CTA) and `primary` (the blue action) — our two action "voices"
- **Communication** — `feedback` (toasts/alerts) and `status` (badges/labels)
- **Domain** — SupplyHouse-specific: `fulfillment` (TurboTrack, Pickup), `role`, `invite`

### ③ Tier 2 · Pattern — *the reusable recipe*

A **pattern** is a multi-state recipe shared by a whole family of components — for example `form-field` (default / hover / focus / error / disabled…) or `action-button` (the padding all three button types share). Define the recipe once; every component that behaves that way reuses it.

**Grouped by pattern name** (form-field, form-control, action-button, menu-item, navigation, selectable, selectable-card, removable, toggle, switch, breadcrumb, text). Patterns are built *from* column ②, so they sit one step to its right.

### ④ Tier 3 · Component token — *the component's own settings*

Where a specific component needs a value that no shared recipe provides — usually bespoke spacing or sizing — it gets its own token here. `modal.body.padding-x` is a Tier-3 token; it points at `spacing.30` in column ①.

**Grouped by component** (accordion, modal, tooltip, quantity-stepper). This layer is **new and still being built** — see the next section for why only some components appear.

### ⑤ Usage · Component — *where it shows up*

The actual components, grouped by family (button, badge, accordion, modal…). This column is **not tokens** — it's the "who uses this" map: the real-world consumers at the end of every chain. The small colored dot is just a representative color for that component.

---

## Why the chain sometimes skips a column

Not every item touches all five columns, and that's by design. A foundation in ② points straight at a primitive in ①. A Tier-3 spacing token in ④ also points straight at a primitive in ① (there's no shared "recipe" for one-off padding, so it skips ② and ③). When you trace a chain and a column shows "not in this chain," it simply means that step isn't part of *that* path — it's not a gap or an error.

---

## Why some components have Tier 3 and others don't

This is the question most people ask, so it's worth being clear.

**A token only exists when something genuinely needs it** (our "audit-first, no duplicates" rule). So a component gets a Tier-3 token *only* when it needs a value that isn't already covered by a shared Tier-2 pattern or foundation.

- **Buttons, radios, checkboxes, form fields, pills, chips** are fully served by shared recipes — buttons use the `action-button` padding pattern plus the `commerce`/`primary` colors, form fields use the `form-field` pattern, and so on. Giving them their own Tier-3 copies would just duplicate what already exists, so they don't have a Tier-3 entry. Their chain ends at Tier 2.
- **Accordion, modal, tooltip, quantity-stepper** have measurements that are unique to them — modal header/body/footer padding, tooltip insets, stepper widths — that no shared pattern provides. Those bespoke values are exactly what Tier 3 is for, so these components have Tier-3 tokens.

Two more things that shape what you see in column ④ today:

1. **This first Tier-3 pass is spacing and size only** — the padding/dimension information that was missing. The *colors* for accordion/modal/tooltip already flow through their Tier-2 usage, so we didn't re-create them at Tier 3 (that would be duplication). Color-level Tier-3 tokens would only be added later if a component ever needs to override a color specifically.
2. **Tier 3 is a work in progress.** It's intentionally "started," not finished — more components and aspects can join as the need is confirmed. An empty or short Tier-3 column for a component means "nothing component-specific needed yet," not "missing."

So a simple way to say it to stakeholders: **shared things live in Tier 2; one-off things live in Tier 3; and we only create a token when a real component actually needs it.**

---

## A few things easy to miss

- **Click-to-trace works both ways.** Select a *primitive* to see everything downstream that would change if you edited it (impact analysis). Select a *component* to see everything it's built from (a bill of materials). This is the explorer's most useful habit.
- **The payoff of the chain:** change a value once at the primitive and it propagates everywhere automatically — no hunting through components. The columns make that dependency visible.
- **A few values are deliberately raw numbers** (e.g., the switch track or stepper widths). When a measurement doesn't fit any scale, we keep it as an honest literal rather than forcing it onto the scale — those show as plain numbers and are flagged in the source.
- **Typography is shown separately**, in its own specimen section, because a text style is a *bundle* (font + size + weight + line-height + case) rather than a single value — so it's better shown as live samples than as one chain row.
- **The responsive type scale** is a separate foundation template: a recommended, designer-overridable set of sizes per breakpoint — a starting point, not a hard rule.
- **The page opens with the rationale** (what this is, how it was built, the tiers, open questions) so a first-time viewer gets the "why" before the detail. It stays one click away from anywhere via the top nav.

---

*Companion to `design-system-conventions.md`. The explorer is `index.html` in this folder.*
