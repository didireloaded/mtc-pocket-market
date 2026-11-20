<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

- Browser baskets and legacy demo orders remain local; real order requests, staff fulfilment events, identity-reference reviews and returns use Cloud via authenticated operations server functions, keeping demo and real records separate.
- Catalog and contract plans in `src/lib/data.ts` mirror mtc.com.na (real names, cash prices, image URLs); contract prices come only from `quote()` so every screen shows the same split.
- Delivery progress and order notifications both derive from `timeline()` in `src/lib/timeline.ts`; checkout totals/validation come only from `summarize()` in `src/lib/checkout.ts`.
- Sign-in uses Lovable Cloud auth (email/password, Google, Lovable); store.tsx derives `user` from the auth session, never from localStorage, so accounts can't be faked.
- Shopping advice uses a public server function with AI Gateway; validate model-selected IDs and contract eligibility against the catalog, and render prices only from catalog/quote helpers to prevent invented offers.
- Add-to-bag controls add the item before navigating to `/cart`; contract catalog tiles open plan selection instead of silently adding at cash price, so the selected purchase mode is respected.
- Official store-directory addresses and coordinates are stored separately from collection names; distance uses geolocation and straight-line calculations, never fabricated branch coordinates.
- Staff authority comes only from protected user_roles; transactional database functions enforce fulfilment and case transitions, and only a future verified payment integration may mark payments paid or refunded.

## Mobile App Builder standard — Pocket Market PWA

Apply the user's Mobile App Builder skill to every mobile-facing change. This application is a **mobile web/PWA built with TanStack Start, React, shadcn/ui, Radix and Tailwind**. Do not introduce React Native, Expo or a new design system to solve a web-specific problem.

- **Inspect first.** Read current route, state, server function, data source and existing design tokens. Preserve user work and Lovable-managed code boundaries.
- **Deliver complete journeys.** Every important action needs useful loading, empty, validation, failure, offline and confirmation states. Success means the authoritative operation succeeded, not that a timer fired.
- **Keep demo and real operations visibly separate.** Local cart/history and sample pricing cannot masquerade as verified MTC purchases, fulfilment, payment, identity checks, stock or active mobile accounts. Never invent courier updates, activation codes or payment confirmations.
- **Design for actual phones.** Respect notch, home indicator, status bars, keyboard, focus order, browser Back, deep links and narrow widths. Provide touch targets around 44–48px, readable 14–16px control text and useful labels rather than icon-only controls.
- **Prefer calm, product-specific surfaces.** Retain MTC branding and real product assets. Avoid generic dashboard-card overload, glass, neon, decorative motion, unverified statistics, fake reviews or generic filler copy.
- **Connect behaviour to its owner.** Pricing from `quote()`, checkout validation from `summarize()`, authoritative Cloud results from server functions, and auth from Supabase session. Never rely solely on frontend visibility for authorization.
- **Minimise bandwidth.** Lazy-load offscreen imagery, avoid decorative video and bloated dependencies, preserve small-screen performance and label unsupported offline capabilities rather than claiming background sync.
- **Protect customers.** No private keys, credentials, ID documents or sensitive customer data in the browser bundle or git. Avoid raw backend error disclosure; handle retries and duplicate submissions.
- **Verify and report truthfully.** Run `bun run test`, `bun run lint`, and `bun run build`; perform phone-width visual and keyboard checks on iOS Safari and Android Chrome when accessible. If unavailable, mark that check NOT RUN, never PASS. Do not publish solely because Lovable says its preview is ready.
- **Source for the expanded standard.** See `docs/mobile-app-builder-standard.md` (adapted for the Pocket Market mobile web/PWA target).

## Premium retail visual standard

Keep the current light mobile-first retail experience. Do not switch back to dark mode or add stock UI imagery just for decoration. The shared theme lives in `src/styles.css`.

- Palette: primary CTAs use MTC crimson `#DD2A1B`, typography uses charcoal `#202E39`, product stages use soft grey `#EEF1F3`, secondary information/navigation may use MTC-inspired blue `#275F84`.
- Prices are prominent and tabular. Product imagery must remain the main visual, with one primary action per catalogue tile. Use catalogue photography, not generated placeholder assets.
- Use a strict 20px page inset, consistent 16px product grid gaps, readable 14–16px supporting copy, and large enough touch areas for smartphones.
- Avoid nesting a white card inside a white card. Prefer open sections, separators, subtle one-pixel borders, and unboxed information. Only floating overlays may use stronger shadows.
- Use shadcn and Radix for functioning accessible controls, Lucide icons at consistent sizes and stroke weights. Never add Material UI/Chakra to this existing stack.
- No gradient heroes, neon effects, glassmorphism or redundant CTA buttons. Prefer flat surfaces, grounded spacing, real images, clear selected states, usable focus outlines and reduced-motion support.
- Preserve price source/eligibility, demo/official disclaimers, cart/auth/navigation state and backend boundaries when changing appearance. Never imply that illustrative contracts are real offers.
- See `docs/premium-retail-ui.md` for component and page-specific rules.

## Progressive disclosure and calm Home

Treat Home as the lightest part of the experience, not a directory of every feature. Its information budget is **one top bar, one featured-device hero, five quick categories and one new-arrivals carousel**. A short independent-concept disclaimer may appear below.

- Keep the header limited to the existing MTC logo, Search and Bag. Notifications belong to My MTC, and profile/settings remain in Account.
- Do not add a contract builder, comparison form, AI adviser section, account preview, upsell grid, second carousel or competing CTAs to Home.
- Discovery product cards on Home show **photo, name and outright price only**. Shop and Product Details own richer controls and technical specifications.
- Contract browsing lives in Shop and the `/find` flow; comparison appears after a relevant category is selected, while the AI adviser is reached through the discreet Shop action.
- Maintain generous vertical whitespace between these three sections and avoid gratuitous cards, borders and shadows.
- Keep routes and functionality available through the main tabs. A simpler Home must not delete fulfilment, saved products, contract estimation or account features.
- Ground all marketing and device imagery in the real catalogue. Do not advertise a discount or benefit unless verified by MTC.

## Reference-led mobile retail UI

For the three primary shopping surfaces, follow the user's supplied mobile commerce reference image, adapted to MTC (rather than copying its green furniture branding).

- **Home**: one dark charcoal featured-device presentation with a large real product image on a white stage and one pill CTA; retain exactly one category row and one personalised discovery carousel below.
- **Catalog / Shop**: a calm two-column grid of white, gently rounded product tiles; prominent studio-style image, save control, short name and cash/illustrative monthly price. Top controls are small search, filter, category chips, price mode and sorting. Advanced tools stay deeper in the journey.
- **Device details**: very large neutral image stage, simple back/favourite controls, overlapping rounded white product information sheet, visible price, real colour options where listed, quantity control for outright products and one dark purchase-bar action. Specs, official collection guidance and illustrative contract configuration live below the primary details.
- **Navigation**: five compact accessible icons in a floating rounded dock. Preserve labels for assistive technologies, safe areas, clear active state and keyboard handling.
- Keep the current independent-concept disclaimers, actual MTC catalogue images, contract calculator and routes. Never present order payments, identity verification, stock or eSIM activation as connected when they aren't.
- Use charcoal #202E39, crimson #DD2A1B and off-white neutral surfaces; do not introduce the reference's furniture imagery, bright green or fictitious discount badges.
- Avoid new card-heavy sections. Never bring the full contract builder, adviser or comparisons back onto Home.

## Reference card overlap and background

The Shop catalogue uses the user's image-first floating-product card reference.

- The app canvas is a soft gray `#F4F5F7`. Catalogue cards are white with approximately `0 8px 30px rgba(0,0,0,0.04)` diffuse shadow and large, deliberate corner rounding.
- Use the actual MTC catalogue images in `src/components/ProductCard.tsx`; the product image rises above the card edge. Never add fake product photography, random Unsplash items or made-up price reductions.
- A save control and shopping-bag action float across each card's bottom edge. Cash uses `addOutright()`; monthly mode must open the product's contract configuration before adding a selected plan.
- Selected category and purchase-mode pills use MTC crimson `#DD2A1B`. Home's dark featured section may use a restrained charcoal gradient but do not apply a heavy dark theme to all forms, checkout and My MTC by default.
- Maintain image `object-contain`, accessible button labels, minimum 44px control targets, contract-estimate disclaimers, and comfortable vertical gaps so floating buttons never overlap the next row.
