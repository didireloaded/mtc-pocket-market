# Mobile App Builder standard for MTC Pocket Market

This is the project-level implementation companion to the user's supplied **Mobile App Builder** skill, adapted to **mobile web and PWA**, not native React Native, SwiftUI or Jetpack Compose.

## Target and principles

- Product: MTC Pocket Market, an independent digital retail concept for Namibia
- Stack: React 19, TanStack Start, TypeScript, Tailwind 4, shadcn/ui, Radix and Lucide
- Targets: iOS Safari, Android Chrome, install-capable PWA where supported, desktop browser
- Auth: Supabase session for Pocket Market identities. Linked MTC mobile-account access is not yet implemented.
- Data: local browser cart/saved items and demo purchases; Cloud server functions for signed-in order requests and support/fulfilment. Explicitly distinguish them.
- Primary journeys: guest discovery, Shop search and filters, device details, guided contract estimate, cart, account sign-in and account request history.
- Do not claim production readiness, official MTC payments, real stock, activation, identity approval, offline sync or device compatibility without evidence.

## UX quality gate

Review each screen before implementing and during acceptance.

1. What is the customer's immediate task? Is the primary next action clear?
2. Is content prioritised for a small phone rather than a desktop dashboard?
3. Does every touch target work without hover and meet a practical 44–48px minimum?
4. Can someone navigate with VoiceOver/TalkBack, an external keyboard and large text?
5. Can the software keyboard obscure an action, field, bottom tab or error? Are safe areas respected?
6. Are first-use, populated, loading, empty, invalid, error, offline, disabled and success states distinguishable?
7. Does browser Back, refresh and direct URL navigation restore sensible state?
8. Does a failed service action preserve input and provide a clear retry?
9. Is a confirmation based on a true server operation, or explicitly marked as local demo?
10. Are imagery, copy, brand and controls specific to the MTC retail journey rather than generic template UI?

## Behaviour ownership

| Customer action | Source of truth | Truthful completion |
| --- | --- | --- |
| Save device | Browser-local saved products | Saved to this browser, not to linked MTC account |
| Add to bag | Browser-local cart | Item is in bag |
| See a contract estimate | Verified catalogue fields with `quote()` calculator | Estimate only, never official offer |
| Save demo order | Browser storage | Local demo order, never paid/shipped |
| Submit Cloud order request | Authenticated server function | Server confirms request saved, no payment |
| View Cloud order | Authenticated server response | Real stored request status, if available |
| Sign in | Supabase auth | Session is confirmed |
| Check phone balance | Future authorised MTC integration | Unavailable until linked account exists |
| Pay, reserve, activate, VERIFI | Future authorised providers | No fake success or fabricated states |

## Mobile behaviour requirements

- Use semantic buttons, links, labels and form controls; preserve real routes and browser history.
- Keep min 16px form input text on iOS Safari to avoid automatic zoom. Main body labels should generally be at least 14px.
- Respect `env(safe-area-inset-*)`, home indicator, browser chrome and small viewport heights with `dvh`.
- Avoid global fixed-height screens and inaccessible fixed action bars while the keyboard is open.
- Use accessible Radix dialogs and sheets for temporary interactions. Keep dismiss and escape handling predictable.
- Disable repeated server mutations while a request is pending; don't silently retry payments or order creation.
- Provide a clear offline message without promising offline persistence or synchronisation.
- Lazy-load offscreen device imagery, reduce unnecessary UI motion and honour `prefers-reduced-motion`.
- Keep motion to meaningful state transitions and avoid background video or decorative loops.
- Preserve all existing source data, routes, Cloud schema and code outside the requested change.

## Review matrix

| Area | Required checks |
| --- | --- |
| Functional | Guest entry, search, category selection, comparison, contract estimates, cart, invalid checkout, auth, account requests |
| Mobile | 320px, 375px, 430px widths; orientation, scrolling, fixed navigation, open keyboard, long device names |
| Accessibility | Accessible names, focus, touch targets, contrast, reduced motion, dynamic text and reader announcements |
| Resilience | Offline/reconnect, validation, retry, duplicate tapping, refresh, back button, storage disabled |
| Engineering | Build, lint, unit tests, integration tests, no secret leakage, safe Cloud authorization |
| Business trust | No invented stock, store service, pricing, shipment, payment, promotions or verification |

## Reporting

Always report separately:

- **Implemented**: exact behaviour or files changed.
- **Verified**: tests/lint/build plus browser or physical device checks marked PASS / FAIL / NOT RUN.
- **Remaining**: risks, dependencies and missing provider integrations.

A Lovable preview status of "ready" confirms the editor accepted a sync, but **does not alone prove that all mobile journeys passed QA**.
