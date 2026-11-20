import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { ProductCard } from "@/components/ProductCard";
import { nad, products } from "@/lib/data";

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children }: { children: React.ReactNode }) => <a href="#preview">{children}</a>,
  useNavigate: () => () => Promise.resolve(),
}));
vi.mock("@/lib/store", () => ({
  useStore: () => ({
    mode: "cash", add: () => {}, saved: [], toggleSave: () => {},
  }),
}));

const homeSource = readFileSync(new URL("../routes/index.tsx", import.meta.url), "utf8");
const shopSource = readFileSync(new URL("../routes/shop.tsx", import.meta.url), "utf8");

describe("progressive-disclosure retail experience", () => {
  it("renders a minimal Home product tile without shopping controls and specs", () => {
    const p = products.find((product) => product.isNew) ?? products[0]!;
    const html = renderToStaticMarkup(<ProductCard p={p} minimal />);
    expect(html).toContain(p.name);
    expect(html).toContain(nad(p.cash));
    expect(html).not.toContain("Add to bag");
    expect(html).not.toContain("Explore plans");
    expect(html).not.toContain("Save");
  });

  it("keeps exactly three editorial sections on the Home page", () => {
    expect((homeSource.match(/<section\b/g) ?? [])).toHaveLength(3);
    expect(homeSource).toContain('aria-label="Featured device"');
    expect(homeSource).toContain('id="quick-categories-heading"');
    expect(homeSource).toContain('id="arrivals-heading"');
    expect(homeSource).not.toContain('<Link to="/find"');
    expect(homeSource).not.toContain('<Link to="/compare"');
    expect(homeSource).not.toContain('<Link to="/adviser"');
  });

  it("keeps contract finding and optional adviser access in Shop", () => {
    expect(shopSource).toContain('<Link to="/find"');
    expect(shopSource).toContain('to="/adviser"');
    expect(shopSource).toContain('c === "Phones"');
  });
});
