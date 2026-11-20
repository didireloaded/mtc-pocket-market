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
