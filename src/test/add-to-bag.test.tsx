import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/lib/data";

const mocks = vi.hoisted(() => ({ add: vi.fn(), navigate: vi.fn(), mode: "cash" }));
vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => mocks.navigate,
  Link: ({ children, to, params }: { children: React.ReactNode; to: string; params?: { id: string } }) =>
    <a href={params ? to.replace("$id", params.id) : to}>{children}</a>,
}));
vi.mock("@/lib/store", () => ({ useStore: () => ({ mode: mocks.mode, add: mocks.add, saved: [], toggleSave: vi.fn() }) }));
afterEach(() => { cleanup(); vi.clearAllMocks(); mocks.mode = "cash"; });

describe("catalog add-to-bag flow", () => {
  it("adds the selected cash device then opens the bag", () => {
    const product = products[0];
    if (!product) throw new Error("Catalog must contain a device");
    render(<ProductCard p={product} />);
    fireEvent.click(screen.getByRole("button", { name: `Add ${product.name} to bag at cash price` }));
    expect(mocks.add).toHaveBeenCalledWith(expect.objectContaining({ id: product.id, price: product.cash, mode: "cash" }));
    expect(mocks.navigate).toHaveBeenCalledWith({ to: "/cart" });
    const addOrder = mocks.add.mock.invocationCallOrder[0];
    const navigateOrder = mocks.navigate.mock.invocationCallOrder[0];
    if (addOrder === undefined || navigateOrder === undefined) throw new Error("Both actions must run");
    expect(addOrder).toBeLessThan(navigateOrder);
  });

  it("opens the selected device for contract choice without adding a cash item", () => {
    const product = products.find((p) => p.contractable);
    if (!product) throw new Error("Catalog must contain a contract device");
    mocks.mode = "contract";
    render(<ProductCard p={product} />);
    expect(screen.getByRole("link", { name: /Choose plan/ }).getAttribute("href")).toBe(`/product/${product.id}`);
    expect(mocks.add).not.toHaveBeenCalled();
  });
});