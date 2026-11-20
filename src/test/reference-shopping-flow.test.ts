import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = (relative: string) => readFileSync(new URL(relative, import.meta.url), "utf8");
const nav = source("../components/Shell.tsx");
const home = source("../routes/index.tsx");
const hero = source("../components/FeaturedDeviceHero.tsx");
const card = source("../components/ProductCard.tsx");
const device = source("../routes/product.$id.tsx");
const cart = source("../routes/cart.tsx");
const orders = source("../routes/orders.tsx");
const profile = source("../routes/settings.tsx");

describe("reference-first shopping journey", () => {
  it("removes generic promo decoration and uses one floating iPhone card", () => {
    expect(home).toContain("<FeaturedDeviceHero product={featured} />");
    expect(hero).toContain("Make space for something better.");
    expect(hero).not.toContain("Featured on Pocket Market");
    expect(hero).toContain("absolute -bottom-[23px]");
    expect(hero).toContain('to="/cart" onClick={addFeatured}');
    expect(device).toContain('p.featured ? "h-[min(64dvh,600px)]');
  });

  it("separates Cart and Orders in the five-tab navigation", () => {
    expect(nav).toContain('label: "Cart"');
    expect(nav).toContain('to: "/cart"');
    expect(nav).toContain('label: "Orders"');
    expect(nav).toContain('label: "Profile"');
    expect(nav).not.toContain('label: "My MTC"');
    expect(nav).toContain("cartCount");
  });

  it("makes the cash shopping bag open Cart, while contract selection stays separate", () => {
    expect(card).toContain('to="/cart" onClick={addOutright}');
    expect(card).toContain("Choose a contract for");
    expect(card).toContain('to="/product/$id"');
  });

  it("places cart items before optional request and delivery details", () => {
    expect(cart).toContain("Your cart is empty");
    expect(cart).toContain('<details ref={addressDetailsRef}');
    expect(cart).toContain("<CloudOrderRequest />");
    expect(cart.indexOf("{shipped.items.length > 0 && <section")).toBeLessThan(cart.indexOf("<CloudOrderRequest />"));
    expect(cart).toContain('search={{ tab: "previews" }}');
  });

  it("keeps Orders concise and Profile useful without fictional balances", () => {
    expect(orders).toContain('tab: "requests"');
    expect(orders).toContain('tab: "previews"');
    expect(orders).toContain("<CloudOrders />");
    expect(profile).toContain("Saved devices");
    expect(profile).toContain("Saved addresses");
    expect(profile).toContain("Notification preferences");
    expect(profile).not.toContain("15.4 GB");
  });
});
