# Compare Module — INTENT

## Layer 1 · Anchor

The matcher wizard answers **"which stroller is best for me"** by scoring
candidates against the user's stated preferences. That is a subjective,
weighted judgement.

The compare module answers a different question: **"objectively, side
by side, how do these N strollers compare on every spec we know?"** It
is the rational tiebreaker after the wizard's emotional first cut, and
the direct entry point for users who already have a 2-4 stroller
shortlist (typically being shared with a partner before purchase).

Compare is intentionally **opinion-light**. It surfaces the dataset's
own facts (price range, weight, wheels, terrain/fold/sun/style scores,
bassinet support, grade, notes, buy links) and highlights per-row
winners using simple, defensible rules — but it does not invent a
"compare score" the way the wizard invents a match score.

## Layer 2 · Constraints

### Cap and selection
- **Min comparison size**: 2 strollers.
- **Max comparison size**: 4 strollers (matches the wizard cap).
- **Below 2**: the "Compare" button is disabled with a tooltip
  prompting the user to pick at least 2.
- **Above 4**: a 5th selection is **refused** at the source (the
  checkbox or the search-add) with a toast explaining the cap.

### State
- Compare-selection state is **fully isolated** from wizard-pick state.
  No cross-flow in either direction.
- Selection on `/all` persists in **both** localStorage **and** the
  `/all` URL query. The URL is the canonical source when both exist
  (URL hydrates localStorage, not the other way round).
- An explicit **Clear all** action wipes both URL and localStorage.

### URL and shareability
- `/[locale]/compare?ids=slug-a,slug-b,...` is the canonical compare
  surface. Up to 4 slugs.
- Slugs are deterministic and stable across data refactors:
  - Lowercase
  - Brand and model joined by `-`
  - NFKD-normalized (so `²` → `2`, etc.)
  - Non-alphanumeric (except `-`) stripped
  - Whitespace collapsed to single `-`
- Invalid slugs are silently ignored (with a visible warning), not 500.
- More than 4 slugs in the URL: the first 4 are kept, the rest are
  dropped (with a visible notice).

### Layout and i18n
- Hebrew is the default; the table layout respects RTL on `/he/compare`.
- Spec labels stay sticky in the first column; stroller columns scroll
  horizontally on mobile.
- Brand and model strings stay in English regardless of locale (per
  project rule).
- All labels, button text, empty-state copy, warning toasts live in
  `messages/{he,en}.json` under a `compare.*` namespace.

### Best-in-row highlighting
- **Numeric "lower is better"**: `price` (compare on the lowest of
  the price range, not `priceMax`).
- **Numeric "higher is better"**: `terrainScore`, `foldScore`,
  `sunScore`, `styleScore`.
- **Numeric "lower is better" with fuzzy parse**: `weight`. Parse
  the first decimal number from the string. `~10kg` → 10, `10.4kg seat / 10.2kg bassinet` → 10.4. If the value is `—`, `Light`,
  or otherwise unparseable, that cell is excluded from the row's
  winner calculation (no highlight on that cell, but the row's other
  cells can still be compared).
- **Boolean "true is better"**: `bassinet`. If at least one cell is
  `true`, every `true` cell is highlighted "✓ Newborn-ready"; `false`
  cells are not.
- **Free-text rows** (`notes`, `gradeReason`, `wheels`): never
  highlighted.
- **Ties**: multiple cells share the highlight.
- **Insufficient data**: a row is only highlighted when **at least 2
  cells in that row** are parseable / comparable.

### Composition
- No new UI primitives. Compose from shadcn/ui (`checkbox`, `button`,
  `dialog`, `tooltip`, `badge`, `card`, `input`, `scroll-area`,
  `tabs`) and MagicUI for any accents.
- Compare must not import from the wizard's scoring code.
- Compare may import the dataset and shadcn/ui primitives only.

## Layer 3 · Examples

These rows become Gherkin scenarios in
`.bdd/features/compare/*.feature`. Each example is a contract.

### Selection on `/all`

| # | Given | When | Then |
|---|---|---|---|
| S1 | User on `/he/all`, 0 strollers selected | They tick the checkbox on the Cybex Priam 5 card | Sticky drawer appears, says "1 selected · Compare", **Compare button is disabled** with tooltip "בחרו לפחות 2" |
| S2 | User on `/he/all`, 1 stroller selected | They tick a 2nd card (Bugaboo Fox 5 Renew) | Drawer says "2 selected · Compare"; **Compare button is enabled** |
| S3 | User on `/he/all`, 4 strollers selected | They try to tick a 5th card | The 5th checkbox refuses to activate; a toast appears with text "מקסימום 4 עגלות להשוואה" |
| S4 | User on `/he/all`, 3 strollers ticked | They click "Compare" in the drawer | Browser navigates to `/he/compare?ids=` followed by the 3 slugs in the order they were ticked |
| S5 | User on `/he/all`, 3 strollers ticked | They click "Clear all" in the drawer | All checkboxes uncheck; localStorage compare key is removed; URL has no `?ids=`; drawer hides |

### Persistence

| # | Given | When | Then |
|---|---|---|---|
| P1 | User on `/he/all` with 3 strollers ticked | They reload the page | The same 3 strollers are still ticked; drawer still says "3 selected" |
| P2 | User on `/he/all` with 2 strollers ticked | They navigate away (to any other route) and back to `/he/all` | The same 2 strollers are still ticked (rehydrated from localStorage) |
| P3 | User opens `/he/all?ids=cybex-priam-5,bugaboo-fox-5-renew` directly | The page renders | Both Priam 5 and Fox 5 Renew checkboxes are pre-checked; drawer says "2 selected" |
| P4 | User has 2 strollers in localStorage but lands on `/he/all?ids=joolz-day5` | The page renders | Only Day5 is checked (URL wins over localStorage); localStorage is updated to match URL |

### Compare page

| # | Given | When | Then |
|---|---|---|---|
| C1 | Visitor opens `/he/compare` (no `ids`) | Page renders | **Empty state**: heading "בחרו 2-4 עגלות להשוואה", an autocomplete search input, and a link to `/he/all` |
| C2 | Visitor opens `/he/compare?ids=cybex-priam-5,bugaboo-fox-5-renew` | Page renders | Side-by-side spec table with sticky first column (spec labels), 2 stroller columns. RTL layout. |
| C3 | Visitor opens `/he/compare?ids=invalid-slug,cybex-priam-5` | Page renders | Only the Priam 5 column is shown + a warning notice "דגם אחד לא נמצא" |
| C4 | Visitor opens `/he/compare?ids=a,b,c,d,e` (5 slugs, all valid) | Page renders | Only the first 4 are shown; a notice explains the cap |
| C5 | Visitor on `/he/compare?ids=cybex-priam-5,bugaboo-fox-5-renew` | They type "donkey" in the search input and click the "Bugaboo Donkey 6" suggestion | URL updates to include `bugaboo-donkey-6`; a 3rd column appears |
| C6 | Visitor on `/he/compare?ids=cybex-priam-5,bugaboo-fox-5-renew,bugaboo-donkey-6` | They click the X on the Donkey 6 column | URL updates, removing `bugaboo-donkey-6`; the column is gone |
| C7 | Visitor opens `/he/compare?ids=invalid-1,invalid-2,invalid-3` | Page renders | Empty state appears with a banner "אף דגם לא נמצא" |

### Best-in-row highlighting

| # | Given | When | Then |
|---|---|---|---|
| H1 | Compare view with Cybex Priam 5 (12.9kg) and Joolz Aer² (6.5kg) | The weight row renders | The Aer² cell shows the "lightest" highlight; the Priam 5 cell does not |
| H2 | Compare view with Bugaboo Fox 5 Renew (price 5200) and Sport Line Cielo XL 2025 (price 2189) | The price row renders | The Cielo XL cell shows the "best price" highlight (uses `price`, not `priceMax`) |
| H3 | Compare view with two strollers tied on `terrainScore: 8` | The terrain row renders | Both cells show the "best terrain" highlight |
| H4 | Compare view with one stroller `weight: "~10kg"` and another `weight: "—"` | The weight row renders | The `~10kg` cell parses to 10. The `—` cell is excluded. The row is **not** highlighted because only 1 cell is parseable |
| H5 | Compare view with two strollers, both `bassinet: true` | The bassinet row renders | Both cells show "✓ Newborn-ready" |
| H6 | Compare view with one `bassinet: true` and one `bassinet: false` | The bassinet row renders | Only the `true` cell is highlighted |
| H7 | Compare view, free-text row (`notes`) | The notes row renders | No cell is highlighted |

### Wizard isolation

| # | Given | When | Then |
|---|---|---|---|
| W1 | Wizard step 1 has 2 strollers picked | User navigates to `/he/all` | `/all` checkboxes are **all empty** |
| W2 | `/he/all` has 3 strollers ticked | User opens the wizard from the home page | Wizard step 1 starts **empty** |

## Out of scope (this iteration)

- Editing the `strollers.ts` dataset
- Changing the wizard UI
- Comparing accessories or car seats
- "Save / email / PDF this comparison"
- Server-side rendering of compare pages with rich Open Graph cards
  (defer until shareable-card design)
- Compare-history (past comparisons)

## Acceptance — feature ships when

- All 22 acceptance examples above pass as Gherkin scenarios against
  `bun run dev` via Playwright.
- `bun run lint` is clean.
- `bun run build` succeeds with no new warnings.
- Stroller dataset count is unchanged.
- No source-code import path crosses from compare into wizard scoring
  or vice versa.
