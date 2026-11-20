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

## My MTC and checkout trust standard

The supplied My MTC and checkout snippets are **visual references, not production MTC APIs**.

- Keep the polished dark My MTC account card, clear quick actions and real Pocket Market authentication. Show MTC mobile data, airtime, phone ownership, KYC and active contracts only when official connected customer data exists. Until then, show honest empty/unlinked states, never invented numbers or Verified badges.
- Cloud order requests must use authenticated server functions. Browser shopping previews are local records and must never be displayed as shipped, out-for-delivery, paid, or activated.
- The cart already persists via the existing `StoreProvider` local-storage state. Do not add duplicate `mtc_cart` storage or a second cart provider.
- Use `NamibiaAddressFields` with a town and one of the 14 Namibian regions. Preserve the region in saved browser addresses and in Cloud request address JSON without requiring database schema changes.
- Do not add fictional bank/wallet balances, unverified supported payment providers, coupon programmes or delivery charges. Payment methods can be shown as unavailable until authorised. A two-second `setTimeout` is **not** proof of payment or order submission.
- Give real server requests genuine pending/success/error states. Local shopping preview saves may confirm only that local data was saved.
- Avoid excessive repeated prototype labels, but retain concise disclosures wherever a customer could mistake an illustration for a transaction, service entitlement or live MTC data.
- Do not call the flow `Secure Checkout` until security, provider integration and payment controls have been evaluated and verified.

## Current navigation and reference-led shopping journey (November 2026)

The bottom navigation is exactly **Home, Shop, Cart, Orders, Profile**, in that order. The My MTC experimental account dashboard can remain accessible by an old route, but must **not** replace Cart in the main dock.

- **Home:** no “Featured on Pocket Market” label, small red dot or generic promo eyebrow. The iPhone is presented in a full-bleed dark editorial field with a large image breaking out of its white card, the device name and cash price, a circular bag action and a separate white explore-device pill. The circular bag action adds an outright device and opens Cart. Preserve categories and one carousel below.
- **Product detail:** especially for the featured iPhone, make the actual product image large with a subtle grounded image stage and overlapping white information sheet. Colour, price, quantity and one prominent Add to Cart button stay obvious. Advanced contract configuration is disclosed only when monthly pricing is selected.
- **Shop:** the red bag on outright catalogue products adds the exact item to the persistent Cart and routes to /cart. In contract mode use a distinct device/plan action; do not show a bag symbol when the action only opens a configurator.
- **Cart:** has products, quantities, totals and delivery/request tools. Not a history screen. Show products first, with shipping and unavailable payments behind disclosure, not a wall of text. Never imply payment success.
- **Orders:** separate account-linked server requests from locally saved previews using two tabs. Keep cards brief and show detailed timeline/notes only on expansion. Do not fabricate shipment events.
- **Profile:** account status, working Cart and Orders shortcuts, real saved product images, addresses, saved numbers, notification preferences and support. Avoid empty generic dashboard cards and unconnected MTC balance widgets as primary content.
- Match the user's three-screen reference by **composition, scale, overlap and spacing**, not merely corner radius or colour. Do not add generated photos or unverifiable promotional claims. Keep 44px touch controls, safe area/keyboard behaviour and truthful integration boundaries.

## Premium motion system (November 2026)

- Use the installed React/Tailwind/Vaul stack for motion, without external animation packages that are not present in the frozen Bun lockfile. Shared small visibility and press helpers live in `src/lib/retail-motion.ts`; CSS keyframes live in `src/styles.css`.
- Keep UI animations roughly 200–300 ms. Use opacity and transform rather than layout animation. No endless loops or heavy glass effects.
- Reveal Home cards once when scrolled into view. Limit initial Shop stagger to eight cards to avoid expensive cascades and reanimation on every search keystroke.
- Use the `prefers-reduced-motion` media query to make all hidden/revealing content immediately visible without motion. Maintain touch targets and keyboard behaviour.
- The Cart dock pulse uses the existing `StoreProvider.add()` through a non-persisted `cartPulse` counter. Do not animate cart hydration or fake an item addition.
- The monthly plan selection uses the installed Vaul drawer with accessible title, close button, focus handling and swipe-down dismissal. Preserve the original contract calculations and user selection; do not create fictional MTC approval or payment states.
- Use skeleton placeholders only for actual server fetches, not timed fake loading of the static catalogue.

## Genuine 360° product photography

Pocket Market now has a reusable real-photo turntable viewer in `src/components/Product360Viewer.tsx`, with media registry in `src/lib/product-spins.ts`. Read `docs/product-360-photography.md` before enabling it for any product.

- Never label a static front photograph, a CSS-rotated rectangle or AI-generated imaginary side/rear views as a real 360° spin.
- Only register complete **24, 36 or 48-frame** sequences from authentic photographs, with correct `frontIndex`, `backIndex`, product and colour. The tests check that all registered image assets exist on disk.
- An unavailable or failed sequence must fall back to the standard product gallery, with no misleading 360° button.
- The viewer supports horizontal pointer drag, left/right keyboard rotation, Front/Back/Reset controls and a Photos mode toggle. Vertical page scrolling must continue to work on mobile.
- Keep frame resources compact, defer neighboring prefetch until a real interaction and skip that prefetch when data-saver is enabled. Never preload every catalogue product's spin images.
- Preserve all existing catalogue data, pricing, product/cart actions, purchases and contract verification boundaries. Do not add fake payment, stock, or colour availability as part of this visual feature.
