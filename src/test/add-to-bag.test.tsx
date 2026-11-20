import type { MouseEventHandler, ReactNode } from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/lib/data";

const mocks = vi.hoisted(() => ({ add: vi.fn(), mode: "cash" }));
vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, to, params, onClick, "aria-label": ariaLabel }: {
    children: ReactNode; to: string; params?: { id: string }; onClick?: MouseEventHandler<HTMLAnchorElement>; "aria-label"?: string;
  }) => <a href={params ? to.replace("$id", params.id) : to} aria-label={ariaLabel} onClick={onClick}>{children}</a>,
}));
vi.mock("@/lib/store", () => ({
  useStore: () => ({ mode: mocks.mode, add: mocks.add, saved: [], toggleSave: vi.fn() }),
}));
afterEach(() => { cleanup(); vi.clearAllMocks(); mocks.mode = "cash"; });

describe("Pocket Market shopping actions", () => {
  it("makes the red bag button add the product and point to Cart", () => {
    const product = products[0]!;
    render(<ProductCard p={product} catalog />);
    const action = screen.getByRole("link", { name: `Add ${product.name} to cart and open cart` });
    expect(action.getAttribute("href")).toBe("/cart");
    fireEvent.click(action);
    expect(mocks.add).toHaveBeenCalledWith(expect.objectContaining({
      id: product.id, price: product.cash, mode: "cash", kind: "physical",
    }));
  });

  it("keeps the ordinary Add to cart action linked to Cart", () => {
    const product = products[0]!;
    render(<ProductCard p={product} />);
    const action = screen.getByRole("link", { name: `Add ${product.name} to cart and open cart` });
    fireEvent.click(action);
    expect(action.getAttribute("href")).toBe("/cart");
    expect(mocks.add).toHaveBeenCalledTimes(1);
  });

  it("does not add a cash device when a customer is choosing a contract", () => {
    const product = products.find((item) => item.contractable)!;
    mocks.mode = "contract";
    render(<ProductCard p={product} catalog />);
    const action = screen.getByRole("link", { name: `Choose a contract for ${product.name}` });
    expect(action.getAttribute("href")).toBe(`/product/${product.id}`);
    fireEvent.click(action);
    expect(mocks.add).not.toHaveBeenCalled();
  });
});
