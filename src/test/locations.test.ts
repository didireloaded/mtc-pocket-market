import { describe, expect, it } from "vitest";
import { distanceKm, locations, nearbyLocations } from "@/lib/locations";
describe("official MTC store locator", () => {
  it("keeps the official Rehoboth street address", () => {
    expect(locations.find((s) => s.name === "Rehoboth")?.address).toBe("Shop 13, Rehoboth Mall, Swartkoppie Weg");
  });
  it("computes distances in kilometres", () => {
    expect(distanceKm({ lat: 0, lng: 0 }, { lat: 0, lng: 1 })).toBeCloseTo(111.195, 2);
  });
  it("sorts the nearest shop first without inventing missing coordinates", () => {
    const grove = locations.find((s) => s.name === "The Grove");
    if (!grove?.coordinates) throw new Error("Official Grove coordinates required");
    expect(nearbyLocations("", grove.coordinates)[0]?.name).toBe("The Grove");
    expect(nearbyLocations("Dune Mall", grove.coordinates)[0]?.distance).toBeNull();
  });
});