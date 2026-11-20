import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { ConceptNotice, Eyebrow, PriceRow, ProductStage, RetailPanel } from "@/components/retail/RetailPrimitives";

describe("retail design system", () => {
  it("renders explicit labels and monetary amounts for a transparent quote", () => {
    const html = renderToStaticMarkup(<PriceRow label="Full-term estimate" value="N$22,500" emphasis />);
    expect(html).toContain("Full-term estimate");
    expect(html).toContain("N$22,500");
  });

  it("labels concept and demo information as a note", () => {
    const html = renderToStaticMarkup(<ConceptNotice>Illustrative pricing only.</ConceptNotice>);
    expect(html).toContain('role="note"');
    expect(html).toContain("Illustrative pricing only.");
  });

  it("gives product photographs an accessible name and lazy loading", () => {
    const html = renderToStaticMarkup(<ProductStage src="https://example.test/device.png" alt="Sample phone" />);
    expect(html).toContain('alt="Sample phone"');
    expect(html).toContain('loading="lazy"');
  });

  it("shares clear content hierarchy across retail panels", () => {
    const html = renderToStaticMarkup(<RetailPanel><Eyebrow>Shop</Eyebrow><p>Devices</p></RetailPanel>);
    expect(html).toContain("Shop");
    expect(html).toContain("Devices");
  });
});
