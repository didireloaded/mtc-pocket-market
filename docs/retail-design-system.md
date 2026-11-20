# Pocket Market retail design system

This design layer uses the libraries already installed in the application.

- **shadcn/ui components** in `src/components/ui/` provide buttons, cards, badges and sheets.
- **Radix primitives** underpin keyboard-accessible tabs, selects, toggle groups and sliders.
- **Tailwind CSS 4** handles responsive layouts and the app's design tokens.
- **Lucide** supplies icons. Use real device product imagery from the catalogue rather than generic stock illustrations.

## Shared components

| Component | Path | Used for |
| --- | --- | --- |
| ProductCard | `src/components/ProductCard.tsx` | Device discovery, saved items and product actions |
| RetailPrimitives | `src/components/retail/RetailPrimitives.tsx` | Section headings, panels, prices, concept notices and image stages |
| ContractControls | `src/components/retail/ContractControls.tsx` | Budget, term and upfront contribution controls |
| ShopFilterSheet | `src/components/retail/ShopFilterSheet.tsx` | Mobile-first advanced filters |
| ContractBreakdown | `src/components/ContractBreakdown.tsx` | Monthly cost, upfront total and estimated full-term cost |

## Principles

1. Light, calm MTC-inspired colours. Use brand blue sparingly to direct attention.
2. Visual-first product imagery and consistent type scale. Body labels should generally be 14px or larger; tiny labels only for compact metadata.
3. Use 44px minimum interactive targets wherever practical. Keyboard focus states are visible.
4. Use accessible Radix controls instead of handwritten custom popovers and sliders.
5. Use editorial layout and balanced whitespace, not stacks of generic dashboard cards.
6. Avoid neon gradients, heavy glass effects, decoration-only icons and unnecessary animation.
7. Respect `prefers-reduced-motion` and lazy-load product-gallery images offscreen.
8. Shopping and contract experiences must never present demo values, approvals or stock availability as real MTC data.
9. Keep the current TanStack Start route architecture and reuse the existing app state. Do not edit the generated route tree directly.

## Applied surfaces

- `/` guest and returning-shopper Home
- `/shop` categories, filters, search and product tiles
- `/product/$id` device buying modes, plans, commitment breakdown and save/bag
- `/find` guided budget-first contract finder

## Review

Run `bun run test` and `bun run build`, then verify mobile appearance at 320px, 375px and 430px widths. Check focus navigation, filter sheet dismissal, product options, estimated prices, selected terms and back/forward navigation.

Pocket Market remains an independent concept. Authorised MTC integrations are needed for live financial offers, payments, accounts and inventory.
