import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");

describe("MTC branding", () => {
  it("bundles the supplied blue MTC artwork as a valid static WebP with transparency", () => {
    const image = readFileSync(new URL("../../public/mtc-brand-logo.webp", import.meta.url));
    expect(image.subarray(0, 4).toString("ascii")).toBe("RIFF");
    expect(image.subarray(8, 12).toString("ascii")).toBe("WEBP");
  });

  it("uses one shared logo instead of red logo tiles", () => {
    const logo = source("../components/MtcLogo.tsx");
    expect(logo).toContain('src="/mtc-brand-logo.webp"');
    for (const path of ["../routes/index.tsx", "../components/Welcome.tsx", "../components/AuthModal.tsx"]) {
      const screen = source(path);
      expect(screen).toContain("<MtcLogo");
      expect(screen).not.toContain("mtcLogo.url");
      expect(screen).not.toContain("mtc-logo.png.asset.json");
    }
  });
});
