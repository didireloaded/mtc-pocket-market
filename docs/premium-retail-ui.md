# Premium retail UI rules

MTC Pocket Market is a phone-first shopping experience, not a generic template dashboard.

## Design direction

Continue the light theme, with **MTC crimson #DD2A1B** for primary actions, **charcoal #202E39** for headings and prices, **neutral #EEF1F3** for product photography stages, and **blue #275F84** for secondary wayfinding. Avoid arbitrary decorative colour. These are project-level design decisions; they do not replace official MTC brand approval.

Use the shared tokens in `src/styles.css`. Keep one source of truth for buttons in `src/components/ui/button.tsx` and retail layout in `src/components/retail/RetailPrimitives.tsx`.

## Product card

`src/components/ProductCard.tsx`

- Real catalogue photo, clean background, no outer white tile with nested boxes
- One save control and one clear primary action: Add to bag or Explore plans
- Brand, device name, and **bold price** in that order
- Two-column grid uses equal 16px gutters and uniform product stages
- No secondary full-width View Details button when image and title already link to details
- Keep all cart, saved and contract eligibility behaviours

## Home

`src/routes/index.tsx`

- Editorial featured product, clear search affordance and direct shopping adviser access
- Categories represented by the actual catalogue imagery
- Contract finder as an open, high-hierarchy section with one crimson CTA
- Compare, locations and orders as readable link rows with dividers
- Separate account sign-in or account overview based on authenticated state
- Recently viewed, wishlist and new arrivals remain accessible

## Shop

`src/routes/shop.tsx`

- Clear product category underline tabs rather than rows of oversized pills
- Accessible filter sheet and sorting retained
- Comparison and plan discovery as clean inline actions rather than stacked cards
- Grid uses `gap-x-4` and `gap-y-7`, list uses separators and larger device names/prices
- Honest labels for digital services, contract estimates and unverified availability

## Product details

`src/routes/product.$id.tsx`, `src/components/ContractBreakdown.tsx`

- Image gallery is an open grey stage; gallery indicators are clickable controls
- Price is prominent, not squeezed into a small badge by the heading
- Specifications use labelled rows instead of separate rounded boxes
- Cash and contract options, plan selection, colours and upfront contributions stay interactive
- Share supports native share when available or copy link otherwise
- Contract estimate shows upfront, device instalment, plan fee, monthly and full-term totals
- Fixed purchase bar is opaque and respects mobile safe areas

## General quality

- Real product images only. Never use generic placeholder photography in a production retail flow.
- Border or background tint before drop shadow. Shadow is reserved for floating sheets, dialogs, menus and overlays.
- One icon set: Lucide at approximately 20px and consistent 1.9–2 stroke width.
- Main body text 14–16px, price 22–30px; reserve 11–13px for metadata only.
- Distinct hover, active, focus and disabled states. Respect reduced motion.
- Keep all demonstrations explicitly marked. No live MTC purchases, account balances, stock, VERIFI or fulfilment are implied without approved data and integrations.

## Validation checklist

Review Home, Shop grid/list, Product Details, contract estimate, cart and account states at 320px, 375px and 430px widths. Check labels, long names, product-image clipping, empty search, keyboard and touch, reduced motion, focus, saved products, Add to bag and plan selection.

Run project tests, lint and build. Do not publish the live URL based solely on a successful GitHub import.
