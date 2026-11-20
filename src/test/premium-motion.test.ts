import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = (file: string) => readFileSync(new URL(file, import.meta.url), "utf8");
const home = source("../routes/index.tsx");
const hero = source("../components/FeaturedDeviceHero.tsx");
const shop = source("../routes/shop.tsx");
const card = source("../components/ProductCard.tsx");
const device = source("../routes/product.$id.tsx");
const shell = source("../components/Shell.tsx");
const store = source("../lib/store.tsx");
const orders = source("../components/CloudOrders.tsx");
const css = source("../styles.css");
const dependencies = (JSON.parse(source("../../package.json")) as { dependencies: Record<string, string> }).dependencies;

describe("Premium, reduced-motion-aware retail interactions", () => {
  it("uses the existing installed drawer instead of an unresolved dependency", () => {
    expect(dependencies["vaul"]).toBeTruthy();
    expect(dependencies["framer-motion"]).toBeUndefined();
    expect(home).toContain("<FeaturedDeviceHero product={featured} />");
    expect(shop).toContain("<ProductCard p={product} catalog />");
  });

  it("reveal-animates Home and no more than the first eight Shop cards", () => {
    expect(home).toContain("carouselReveal");
    expect(home).toContain("pocket-reveal");
    expect(shop).toContain("index < 8");
    expect(shop).toContain("pocket-reveal-pending");
    expect(hero).toContain("pocket-reveal");
    expect(css).toContain("@keyframes pocket-rise");
    expect(css).toContain(".pocket-reveal-pending { opacity: 1; }");
  });

  it("uses tactile buttons and bounces the dock only on cart additions", () => {
    expect(card).toContain("pressClass");
    expect(hero).toContain("pressClass");
    expect(device).toContain("pressClass");
    expect(store).toContain("setCartPulse((count) => count + 1)");
    expect(shell).toContain("cartPulse");
    expect(shell).toContain("pocket-cart-bounce");
    expect(css).toContain("@keyframes pocket-badge-pop");
  });

  it("keeps the draggable plan sheet accessible and uses existing pricing", () => {
    expect(device).toContain("<Drawer open={planOpen}");
    expect(device).toContain("<DrawerTitle");
    expect(device).toContain("<DrawerDescription");
    expect(device).toContain("<DrawerClose");
    expect(device).toContain("<ContractBreakdown");
    expect(device).toContain('setMode("contract"); setPlanOpen(false)');
    expect(device).not.toContain("setTimeout");
  });

  it("uses card-shaped skeletons for real server loading states", () => {
    expect(orders).toContain("Loading account requests");
    expect(orders).toContain("animate-pulse");
    expect(orders).not.toContain("Loader2");
    expect(orders).toContain("motion-reduce:animate-none");
  });
});
