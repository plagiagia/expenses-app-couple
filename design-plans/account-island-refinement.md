# Make the account islands read as personal ledgers

Written against: unavailable (repository has no commits)

## Evidence chain

- Surface: `/` rendered by `app/page.tsx`, with the account-island styling in `app/globals.css`.
- Problem: the same island surface has two competing implementations. The original large pastel card treatment remains at `app/globals.css:63-173`, then a later override replaces parts of it at `app/globals.css:488-526`. Responsive rules also target both shapes at `app/globals.css:403-452` and `app/globals.css:526`.
- Design evidence: the user explicitly asked for vertical partner islands, then asked that the islands stop looking AI-generated. The current runtime path uses `PersonIsland` twice from `app/page.tsx:47,54`, proving one shared component governs both islands.
- Owner: `PersonIsland` in `app/page.tsx` and the island selectors in `app/globals.css`.
- Scope and affected surfaces: the landing dashboard only, including desktop, tablet, and mobile variants of both partner islands.
- Uncertainty: visual judgment needs a browser screenshot pass before accepting final spacing and line-port alignment.

## Design decision

Consolidate the islands into one quiet, ledger-like account primitive. Each island should use the existing paper surface, the existing rust or sage accent, one thin identity rule, account summary, and three personal-spending rows. Remove superseded decorative styles rather than overriding them later in the stylesheet. Preserve the shared ports so the two accounts still visibly feed the household flow.

## Reuse

- Existing tokens: `--paper`, `--ink`, `--muted`, `--rust`, `--sage`, `--line` in `app/globals.css`.
- Existing composition: `PersonIsland` in `app/page.tsx`.
- Existing responsive breakpoints: `1120px`, `880px`, and `600px` in `app/globals.css`.

## Changes

1. `app/page.tsx`
   - Change: keep `PersonIsland` as the sole account-island owner and retain the account chip, monthly amount, two account facts, personal ledger, quiet pattern note, and shared-expense port.
   - Preserve: Lena and Noah data, the shared-flow layout, hoverable category routes, receipt modal, and all existing navigation labels.
   - Verify: both islands have identical structural hierarchy, with only data and the approved accent changing.

2. `app/globals.css`
   - Change: merge the old and new island rules into one owner block; remove the retired aurora, portrait, week-card, and duplicate island overrides. Make the port align to the ledger's shared-account section at desktop and hide it when the grid collapses.
   - Preserve: the active-flow route emphasis, the calm light theme, and the existing compact mobile layout.
   - Verify: no later selector redefines `.island`, `.island.noah`, or `.island-ports` except inside an explicit responsive branch.

3. `app/globals.css`
   - Change: use named motion tokens for the toast, modal, route emphasis, and hover transitions. Keep constant activity only for the two demonstrative flow routes; the financial figures themselves must remain visually stable.
   - Preserve: button press feedback and reduced-motion compatibility.
   - Verify: interactive transitions use transform or opacity, are 160ms to 250ms, and respect `prefers-reduced-motion`.

## Scope

- Inherit: both `PersonIsland` instances.
- Verify: `/` at wide desktop, 880px tablet, and 600px mobile; line hover; receipt modal; toast feedback.
- Exclude: data model, OpenAI extraction, Neon persistence, authentication, and route structure.

## Validation

- Product: the accounts read as two personal ledgers connected to one shared household, without decorative illustration treatment.
- Interface: check the two islands, category-line hover state, receipt modal, and mobile collapse.
- System: confirm the shared component has one source of style truth and only consumes existing page tokens.
- Repository: `npm run build` and `npm run lint` both pass.

## Stop conditions

- Stop if one island needs a materially different information hierarchy, or if connecting the ports requires changing the central flow data model.

## Design documentation

- After acceptance and validation: add a short account-island ownership and motion rule to `DESIGN.md`; currently no such design document exists.
