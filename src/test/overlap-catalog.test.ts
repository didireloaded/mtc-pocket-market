import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");
const card = source("../components/ProductCard.tsx");
const shop = source("../routes/shop.tsx");
const home = source("../routes/index.tsx");
const css = source("../styles.css");

describe("floating product-card retail treatment", () => {
  it("uses the reference's image and action overlap without fake discount figures", () => {
    expect(card).toContain("if (catalog)");
    expect(card).toContain("-top-10");
    expect(card).toContain("absolute inset-x-0 bottom-0");
    expect(card).toContain("shadow-[0_8px_30px_rgba(0,0,0,0.04)]");
    expect(card).toContain("{p.badge}");
    expect(card).not.toContain("discount: '-5%'");
  });

  it("preserves different purchase paths for cash and contract shopping", () => {
    expect(card).toContain("onClick={addOutright}");
    expect(card).toContain('aria-label={`Choose a contract for ${p.name}`}');
    expect(card).toContain("toggleSave(p.id)");
    expect(card).toContain("mode: \"cash\"");
    expect(shop).toContain("p={product} catalog");
  });

  it("uses a soft gray background with MTC red selected controls", () => {
    expect(css).toContain("--background: #F4F5F7;");
    expect(css).toContain("--primary: #DD2A1B;");
    expect(shop).toContain('c === name ? "bg-primary text-white"');
    expect(home).toContain("from-[#263842]");
  });
});
