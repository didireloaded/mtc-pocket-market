/**
 * Genuine photo-turntable media. Every frame must depict the SAME physical
 * device/finish from consecutive equal-angle positions.
 *
 * No actual 360° image sequences have been supplied yet. Keep this registry
 * empty until a complete, licensed set has been placed in /public/products/360.
 *
 * Example after uploading 36 real WebP photographs:
 *
 * "iphone-18-pro-max-256gb": [
 *   {
 *     productId: "iphone-18-pro-max-256gb",
 *     colour: "Standard",
 *     frames: makeSpinFrames("iphone-18-pro-max-256gb", "standard", 36),
 *     frontIndex: 0,
 *     backIndex: 18,
 *   },
 * ],
 */

export type ProductSpin = {
  productId: string;
  colour: string;
  frames: readonly string[];
  frontIndex: number;
  backIndex: number;
};

export const FRAME_COUNTS = [24, 36, 48] as const;

export function makeSpinFrames(productId: string, colourSlug: string, count: 24 | 36 | 48): string[] {
  return Array.from({ length: count }, (_, index) =>
    `/products/360/${productId}/${colourSlug}/frame-${String(index + 1).padStart(3, "0")}.webp`,
  );
}

/** Use this manifest only for real, complete image sets that passed the file audit. */
export const productSpins: Readonly<Record<string, readonly ProductSpin[]>> = {};

export function isSpinReady(spin: ProductSpin | null | undefined): spin is ProductSpin {
  if (!spin || !FRAME_COUNTS.some((count) => count === spin.frames.length)) return false;
  if (!spin.productId || !spin.colour || !Number.isInteger(spin.frontIndex) || !Number.isInteger(spin.backIndex)) return false;
  if (spin.frontIndex < 0 || spin.frontIndex >= spin.frames.length || spin.backIndex < 0 || spin.backIndex >= spin.frames.length) return false;
  if (spin.backIndex === spin.frontIndex || new Set(spin.frames).size !== spin.frames.length) return false;
  return spin.frames.every((path) => path.startsWith("/products/360/") && path.endsWith(".webp") && !path.includes(".."));
}

export function findProductSpin(productId: string, colour: string): ProductSpin | null {
  return productSpins[productId]?.find((spin) => spin.colour === colour && isSpinReady(spin)) ?? null;
}

export function wrapFrame(index: number, count: number): number {
  if (count <= 0) return 0;
  return ((index % count) + count) % count;
}

/** Dragging to the left moves forward, to the right moves backward. */
export function spinFrameFromDrag(start: number, deltaX: number, count: number, pixelsPerFrame = 12): number {
  return wrapFrame(start - Math.trunc(deltaX / pixelsPerFrame), count);
}

export function spinViewLabel(frame: number, spin: ProductSpin): string {
  if (frame === spin.frontIndex) return "Front view";
  if (frame === spin.backIndex) return "Back view";
  const angle = wrapFrame(frame - spin.frontIndex, spin.frames.length) * (360 / spin.frames.length);
  return `${Math.round(angle)} degree view`;
}
