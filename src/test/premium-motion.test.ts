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
const packageJson = JSON.parse(source("../../package.json")) as { dependencies: Record<string, string> };

describe("Premium, reduced-motion-aware retail interactions", () => {
  it("installs Framer Motion while keeping the existing shopping views", () => {
    expect(packageJson.dependencies["framer-motion"]).toBeTruthy();
    expect(home).toContain("<FeaturedDeviceHero product={featured} />");
    expect(shop).toContain("<ProductCard p={product} catalog />");
  });

  it("stagger-reveals only the visible first shop products and the Home carousel", () => {
    expect(home).toContain("revealGroup");
    expect(home).toContain("revealItem");
    expect(home).toContain("whileInView");
    expect(shop).toContain("index < 8 ? revealItem : undefined");
    expect(shop).toContain('initial={reduceMotion ? false : "hidden"}');
    expect(hero).toContain("reduceMotion ? false");
    expect(hero).not.toContain("Featured on Pocket Market");
  });

  it("uses tactile buttons and makes the bottom dock bounce only on cart additions", () => {
    expect(card).toContain("pressClass");
    expect(hero).toContain("pressClass");
    expect(device).toContain("pressClass");
    expect(store).toContain("setCartPulse((count) => count + 1)");
    expect(shell).toContain("cartPulse");
    expect(shell).toContain("cartCount > 0");
    expect(shell).toContain("useReducedMotion");
  });

  it("keeps the plan sheet accessible and derives real estimates from the existing calculator", () => {
    expect(device).toContain("<Drawer open={planOpen}");
    expect(device).toContain("<DrawerTitle");
    expect(device).toContain("<DrawerDescription");
    expect(device).toContain("<DrawerClose");
    expect(device).toContain("<ContractBreakdown");
    expect(device).toContain('setMode("contract"); setPlanOpen(false)');
    expect(device).toContain('Learn about official contract verification');
    expect(device).not.toContain("setTimeout");
  });

  it("uses card-shaped loading skeletons instead of fake payment progress", () => {
    expect(orders).toContain("Loading account requests");
    expect(orders).toContain("animate-pulse");
    expect(orders).not.toContain("Loader2");
    expect(orders).toContain("motion-reduce:animate-none");
  });
});
