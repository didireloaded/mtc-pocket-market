# 360° product photography for Pocket Market

The app now supports an actual **photographed turntable** on every product detail page. A single product PNG is not a 360° view. The existing catalogue currently has **no complete 360° photograph sequences**, so every product continues to show its ordinary photo gallery until a genuine set is added.

## Capture

1. Choose the exact retail device and colour/finish. Mount it vertically on a turntable. Keep the camera, lighting, product scale and background fixed.
2. Take **36 equal-angle photographs**, turning the product by **10 degrees between frames**. Take frame 001 as the front, and frame 019 as the back. Alternative sets of 24 (15 degrees) or 48 (7.5 degrees) are supported.
3. Retouch the whole series consistently. Preserve real ports, camera lenses, speaker holes and buttons. Do not mirror the front photograph or fabricate rear/side shots with generative tools.
4. Export same-size square WebP photos, suggested **900–1200 pixels** wide, ideally **60–140 KB per frame**. Maintain identical subject position across frames. Compression and image quality should be checked on the actual product.
5. A horizontal orbit shows front, back, left and right sides. To show the top and bottom surfaces, photograph additional dedicated detail images and add them to the ordinary product gallery. A horizontal orbit cannot reveal every face.

## Add one product

Place original frame sequence here, using these exact filenames:

```
public/products/360/iphone-18-pro-max-256gb/standard/frame-001.webp
public/products/360/iphone-18-pro-max-256gb/standard/frame-002.webp
...
public/products/360/iphone-18-pro-max-256gb/standard/frame-036.webp
```

Then edit `src/lib/product-spins.ts` and register:

```ts
export const productSpins: Readonly<Record<string, readonly ProductSpin[]>> = {
  "iphone-18-pro-max-256gb": [{
    productId: "iphone-18-pro-max-256gb",
    colour: "Standard",
    frames: makeSpinFrames("iphone-18-pro-max-256gb", "standard", 36),
    frontIndex: 0,
    backIndex: 18,
  }],
};
```

For devices with multiple listed finishes, photograph and register a separate sequence for **each finish**. The viewer only appears for a matching product-and-colour pair. Do not show the silver finish when the customer selects black.

Run `bun run test`, `bun run lint`, and `bun run build` and test dragging at 320px, 375px and 430px in iOS Safari and Android Chrome. The registry audit test checks that every listed frame physically exists. If a photo fails to load at runtime the viewer switches back to the ordinary gallery.

## Customer experience

- **360° view** is selected by default only when all required photos are declared.
- Drag the device left or right to rotate through the captured frames.
- Front, Back, Reset, keyboard arrows and Home/End work without touch.
- The **Photos** tab returns to the ordinary product-gallery photos.
- No frame downloads before the customer visits a product with a verified sequence. Neighbor-frame prefetch happens only after interaction, and is skipped on a connection in data-saver mode.
- Original image galleries, colour selectors, product prices, saved products, contracts and Cart actions remain unchanged.
- Do not put a fake 360° label on products whose authentic photo sequence is not available.

Start by photographing the real iPhone 18 Pro Max in the exact retail finish and run the full orbit end-to-end. The same viewer can then be enabled on every other device without more UI work.
