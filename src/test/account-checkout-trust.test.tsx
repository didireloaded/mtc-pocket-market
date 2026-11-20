import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { NamibiaAddressFields } from "@/components/NamibiaAddressFields";
import { NAMIBIA_REGIONS } from "@/lib/namibia";
import { orderRequest } from "@/lib/operations";

const source = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");

describe("Namibian checkout and honest account states", () => {
  it("offers the 14 Namibian administrative regions as address options", () => {
    expect(NAMIBIA_REGIONS).toHaveLength(14);
    expect(NAMIBIA_REGIONS).toContain("Khomas");
    expect(NAMIBIA_REGIONS).toContain("Erongo");

    const html = renderToStaticMarkup(<NamibiaAddressFields prefix="test" onChange={() => {}}
      value={{ name: "Nandi", street: "1 Main Street", town: "Windhoek", region: "Khomas", phone: "0811234567" }} />);
    expect(html).toContain('id="test-name"');
    expect(html).toContain("Choose a region");
    expect(html).toContain("Khomas");
    expect(html).toContain("Contact number");
  });

  it("accepts a structured region in actual Cloud order requests", () => {
    const request = { items: [{ id: "test", qty: 1 }], address: {
      name: "Nandi", street: "1 Main", town: "Windhoek", region: "Khomas", phone: "0811234567",
    } };
    expect(orderRequest.safeParse(request).success).toBe(true);
    expect(orderRequest.safeParse({ ...request, address: { ...request.address, region: "Imaginary" } }).success).toBe(false);
  });

  it("does not display invented MTC balances or fake verified status", () => {
    const screen = source("../routes/mymtc.tsx");
    expect(screen).toContain("Not connected");
    expect(screen).toContain("MTC connection required");
    expect(screen).toContain('to="/orders"');
    expect(screen).not.toContain("15.4 GB");
    expect(screen).not.toContain("Out for Delivery");
    expect(screen).not.toContain("iPhone 15 Pro - 256GB");
  });

  it("does not start a simulated payment or invent wallet funds", () => {
    const cart = source("../routes/cart.tsx");
    const rules = source("../lib/checkout.ts");
    expect(cart).toContain("Payments will be available only after an approved checkout integration.");
    expect(cart).toContain("Save shopping preview");
    expect(cart).not.toContain("Confirm & Pay");
    expect(cart).not.toContain("setTimeout");
    expect(rules).not.toContain("MTCSUMMER");
    expect(rules).not.toContain("SHIPPING_FEE = 99");
  });
});
