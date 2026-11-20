# MTC Pocket Market

A mobile-first concept for a connected digital retail and customer experience in Namibia.

**Purpose:** Help customers discover devices, explore and configure contracts, understand identity requirements, purchase or reserve through authorised channels, track orders, and manage services in one place.

**Project:** [Lovable editor](https://lovable.dev/projects/e459443e-2f89-4545-9e2a-d3a5dbb456e8) · [Published site](https://mtc-pocket-market.lovable.app)

## Experience

- **Home** adapts to new guests and signed-in Pocket Market users. Signed-in status does **not** imply a linked MTC mobile account.
- **Shop** includes searchable products, cash/contract estimate modes, filters, and category discovery.
- **Find My Contract** (`/find`) matches a budget, term, device type and data preference with illustrative combinations.
- **Compare devices** (`/compare`) compares cash prices, estimated monthly prices and available specifications.
- **My MTC** is currently a clearly marked sample service dashboard.
- **Orders** shows browser-local demo order history; no MTC fulfilment integration exists.
- **Account** holds locally saved shopping preferences and account settings.
- **Store collection** lists branch names from the product catalogue but makes no live stock or reservation claims.

The main navigation includes Home, Shop, My MTC, Orders and Account. Shopping Bag is accessible from Home, Shop and product details.

## Important demo boundaries

This is an **independent concept**, not an authorised MTC transaction system.

- Cash device records are a locally curated catalogue and need continuing verification.
- Financing calculations, contract term totals and package suitability are **illustrative**, not official quotes.
- Contract applications, MTC VERIFI identity checks, stock reservations, live account balances, real mobile-money/card processing, data recharges, SMS/email notifications, eSIM provisioning and shipping are **not connected to MTC**.
- A demo order is saved in browser storage only. It does not take payment, activate a service or ship a product.
- Never capture identity photos or simulate successful biometric verification as a real approval.
- No made-up business phone numbers, store opening hours, stock counts, promotional terms or activation codes should be presented as genuine.

## Stack

- TanStack Start / TanStack Router / React 19
- TypeScript, Vite, Tailwind CSS, Lucide
- Lovable Cloud and Supabase Auth for Pocket Market sign-in
- Browser-local cart, favourites, demo orders and preferences

## Main code

- `src/routes/index.tsx` — personalised Home
- `src/routes/find.tsx` and `src/lib/finder.ts` — device/plan matcher
- `src/routes/compare.tsx` — device comparison
- `src/routes/shop.tsx` — product discovery
- `src/lib/data.ts` — current seeded products, plans and illustrative quote engine
- `src/lib/checkout.ts` — separates one-time demo checkout amounts from recurring estimates
- `src/lib/store.tsx` — client-side shopping state and authentication session
- `src/routes/orders.tsx` — local demo orders
- `src/routes/kyc.tsx` and `src/routes/esim.tsx` — guidance only, no fake approval/provisioning

Use file-based routes in `src/routes`. Do not manually edit `src/routeTree.gen.ts` or generated database files.

## Development

```sh
bun install
bun run dev
bun run test
bun run build
```

GitHub `main` is connected to the Lovable project. Changes pushed to the active branch sync to the Lovable editor. **Publishing to the live URL is a separate step.** For changes involving MTC account integration or official transaction backends, obtain approval and verified interfaces first.

## Design direction

Keep the current light MTC-inspired palette, strong typography, real product imagery, generous touch targets and low-data mobile performance. Avoid cluttered dashboards, neon effects, generic stock illustrations and invented product details.
