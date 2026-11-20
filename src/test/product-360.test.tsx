import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Product360Viewer } from "@/components/Product360Viewer";
import {
  findProductSpin, isSpinReady, makeSpinFrames, productSpins,
  spinFrameFromDrag, spinViewLabel, wrapFrame, type ProductSpin,
} from "@/lib/product-spins";
import { existsSync, statSync } from "node:fs";
import { join } from "node:path";

const phone: ProductSpin = {
  productId: "iphone-18-pro-max-256gb",
  colour: "Standard",
  frames: makeSpinFrames("iphone-18-pro-max-256gb", "standard", 36),
  frontIndex: 0,
  backIndex: 18,
};

afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe("genuine 360-degree photography media", () => {
  it("creates an ordered 36-frame orbit and gives useful orientation labels", () => {
    expect(phone.frames[0]).toBe("/products/360/iphone-18-pro-max-256gb/standard/frame-001.webp");
    expect(phone.frames[35]).toBe("/products/360/iphone-18-pro-max-256gb/standard/frame-036.webp");
    expect(isSpinReady(phone)).toBe(true);
    expect(spinViewLabel(0, phone)).toBe("Front view");
    expect(spinViewLabel(18, phone)).toBe("Back view");
    expect(spinViewLabel(9, phone)).toBe("90 degree view");
    expect(wrapFrame(-1, 36)).toBe(35);
    expect(spinFrameFromDrag(0, -120, 36)).toBe(10);
    expect(spinFrameFromDrag(0, 120, 36)).toBe(26);
  });

  it("rejects short, duplicated or wrongly indexed photo sequences", () => {
    expect(isSpinReady({ ...phone, frames: phone.frames.slice(0, 4) })).toBe(false);
    expect(isSpinReady({ ...phone, backIndex: 36 })).toBe(false);
    expect(isSpinReady({ ...phone, frames: phone.frames.map(() => phone.frames[0]!) })).toBe(false);
    expect(isSpinReady({ ...phone, frames: phone.frames.map((path) => path.replace("/products/360/", "/fake/")) })).toBe(false);
  });

  it("only enables real spin sets explicitly registered for the correct colour", () => {
    expect(findProductSpin(phone.productId, phone.colour)).toBeNull();
    expect(findProductSpin(phone.productId, "Other")).toBeNull();
    for (const [productId, spins] of Object.entries(productSpins)) {
      for (const spin of spins) {
        expect(spin.productId).toBe(productId);
        expect(isSpinReady(spin)).toBe(true);
        for (const frame of spin.frames) {
          const filename = join(process.cwd(), "public", frame.slice(1));
          expect(existsSync(filename), `Missing 360 photo: ${frame}`).toBe(true);
          expect(statSync(filename).size).toBeGreaterThan(0);
        }
      }
    }
  });

  it("supports keyboard rotation plus front, back and reset controls", () => {
    render(<Product360Viewer productName="iPhone 18 Pro Max" spin={phone} onUnavailable={vi.fn()} />);
    const slider = screen.getByRole("slider", { name: /Rotate iPhone 18 Pro Max/ });
    expect(slider.getAttribute("aria-valuenow")).toBe("0");
    fireEvent.keyDown(slider, { key: "ArrowRight" });
    expect(slider.getAttribute("aria-valuenow")).toBe("1");
    fireEvent.click(screen.getByRole("button", { name: "Back" }));
    expect(slider.getAttribute("aria-valuenow")).toBe("18");
    fireEvent.click(screen.getByRole("button", { name: "Reset to front view" }));
    expect(slider.getAttribute("aria-valuenow")).toBe("0");
    fireEvent.keyDown(slider, { key: "ArrowLeft" });
    expect(slider.getAttribute("aria-valuenow")).toBe("35");
    fireEvent.keyDown(slider, { key: "Home" });
    expect(slider.getAttribute("aria-valuenow")).toBe("0");
  });

  it("allows finger or mouse dragging to select successive angles", () => {
    render(<Product360Viewer productName="Phone" spin={phone} onUnavailable={vi.fn()} />);
    const slider = screen.getByRole("slider");
    fireEvent.pointerDown(slider, { pointerId: 1, isPrimary: true, clientX: 180, clientY: 100 });
    fireEvent.pointerMove(slider, { pointerId: 1, clientX: 60, clientY: 105 });
    expect(slider.getAttribute("aria-valuenow")).toBe("10");
    fireEvent.pointerUp(slider, { pointerId: 1 });
  });

  it("falls back to the ordinary gallery when a displayed frame fails", () => {
    const unavailable = vi.fn();
    render(<Product360Viewer productName="Phone" spin={phone} onUnavailable={unavailable} />);
    fireEvent.error(screen.getByRole("img", { name: /Phone, Front view/ }));
    expect(unavailable).toHaveBeenCalledTimes(1);
  });
});
