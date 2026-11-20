import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const readSource = (file: string) => readFileSync(new URL(file, import.meta.url), "utf8");
const home = readSource("../routes/index.tsx");
const shop = readSource("../routes/shop.tsx");
const product = readSource("../routes/product.$id.tsx");
const card = readSource("../components/ProductCard.tsx");
const shell = readSource("../components/Shell.tsx");

describe("reference-led device retail screens", () => {
  it("keeps Home focused on a single featured device and one discovery carousel", () => {
    expect((home.match(/<section\b/g) ?? [])).toHaveLength(3);
    expect(home).toContain('aria-label="Featured device"');
    expect(home).toContain("Make space for something better.");
    expect(home).toContain('id="arrivals-heading"');
    expect(home).not.toContain('to="/find"');
    expect(home).not.toContain('to="/adviser"');
  });

  it("provides two-column catalogue tiles while keeping all buying tools in Shop", () => {
    expect(shop).toContain("grid-cols-2");
    expect(shop).toContain("p={product} catalog");
    expect(shop).toContain("<ShopFilterSheet");
    expect(shop).toContain('to="/find"');
    expect(shop).toContain('to="/compare"');
    expect(card).toContain("if (catalog)");
    expect(card).toContain("toggleSave(p.id)");
  });

  it("preserves a full device journey with quantity and illustrative plan pricing", () => {
    expect(product).toContain("Decrease quantity");
    expect(product).toContain("Increase quantity");
    expect(product).toContain("<ContractBreakdown");
    expect(product).toContain('to="/stores"');
    expect(product).toContain("No live MTC purchase");
    expect(product).toContain('to: "/cart"');
  });

  it("keeps five accessible navigation destinations", () => {
    expect(shell).toContain("grid-cols-5");
    expect(shell).toContain('aria-label="Main navigation"');
    expect(shell).toContain('to: "/mymtc"');
    expect(shell).toContain('to: "/orders"');
    expect(shell).toContain('to: "/settings"');
  });
});
