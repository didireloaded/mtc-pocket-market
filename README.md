# Mtc Pocket Market

Build a premium, high-end mobile-first e-commerce web application for MTC Namibia (a major telecom operator). The app blends physical device retail (phones, laptops, audio) with digital telecom services (data bundles, eSIMs, contract plans).

1. Design System & Aesthetic (matching the attached reference image):
- Vibe: Premium, sleek, futuristic, dark mode only.
- Background: Deep charcoal (#0A0F14).
- Surface/Cards: Slightly lighter charcoal (#151C23) with smooth rounded corners (border-radius: 20px).
- Primary Accent: Alizarin Crimson (#DD2A1B) for primary actions or brand accents, paired with vibrant Mint/Teal (#2DD4BF) for featured tags, active tabs, highlights, and secondary CTAs as shown in the screenshot.
- Typography: Inter/Sans-serif with clean bold headers and light gray secondary text (#9CA3AF).

2. App Architecture & Bottom Navigation:
- Home: Discovery, horizontal category pills (Headphones, Laptops, Wearables, Audio), featured hero device card with circular '+' button, and New Arrivals carousel.
- Shop: Full product catalog with filterable categories, search, and cash vs. contract price toggle.
- MyMTC: Telecom account dashboard with data balance, airtime, active contracts, and quick bundle top-up.
- Cart: Shopping bag with quantity pill controls (- 1 +), item removal, promo code input, order summary, and checkout.

3. Detailed Screens & Flows:
- Home Screen: Greeting header, notification icon, category pills, Hero featured card (e.g. Sonic Pro ANC, $349 / N$), and "New Arrival" section (The Creator Series Laptops).
- Product Detail Page (PDP): Large hero image with bottom gradient fade, back and share overlay buttons, product title, price pill, tab toggle between "OVERVIEW" (specs grid: battery, connectivity, etc.) and "PLANS" (monthly contract options), plus sticky bottom bar with Save/bookmark and "Add to Cart".
- Shopping Bag (Cart): Cart item list with thumbnail, title, color/variant, price, trash icon, qty pill selector, promo code section with Apply, subtotal/shipping/total breakdown, and sticky "Pay Now" button with Apple Pay option.
- Core Telecom Logic:
  - Cash Price vs. Contract Price toggle on product cards and PDP.
  - Cart separation for physical items (delivery) and digital items (eSIM / data bundles).
  - Mock eSIM activation flow that displays a realistic QR code for scanning.
  - Mock VERIFI KYC flow for contract applications (National ID capture simulation and selfie verification).
  - Onboarding / Auth modal with Phone + OTP login or "Browse as Guest".

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://mtc-pocket-market.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/e459443e-2f89-4545-9e2a-d3a5dbb456e8).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
