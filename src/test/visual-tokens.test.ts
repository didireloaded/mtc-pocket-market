import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const css = readFileSync(new URL("../styles.css", import.meta.url), "utf8");

const token = (name: string) => {
  const hex = css.match(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6})`))?.[1];
  if (!hex) throw new Error(`Missing retail colour token: ${name}`);
  return hex;
};

const luminance = (color: string) => {
  const rgb = [1, 3, 5].map((start) => parseInt(color.slice(start, start + 2), 16) / 255);
  const linear = rgb.map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return linear[0]! * 0.2126 + linear[1]! * 0.7152 + linear[2]! * 0.0722;
};
const contrast = (first: string, second: string) => {
  const a = luminance(first), b = luminance(second);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
};

describe("Pocket Market premium retail tokens", () => {
  it("keeps the approved brand decisions consistent", () => {
    expect(token("primary")).toBe("#DD2A1B");
    expect(token("foreground")).toBe("#202E39");
    expect(token("stage")).toBe("#EEF1F3");
  });

  it("keeps white text on crimson actions readable at WCAG AA normal-text contrast", () => {
    expect(contrast(token("primary"), token("primary-foreground"))).toBeGreaterThanOrEqual(4.5);
  });

  it("keeps charcoal headings and muted body text legible on the app canvas", () => {
    expect(contrast(token("foreground"), token("background"))).toBeGreaterThanOrEqual(7);
    expect(contrast(token("muted-foreground"), token("background"))).toBeGreaterThanOrEqual(4.5);
  });
});
