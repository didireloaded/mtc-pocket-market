import directory from "./locations.json";
export type Coordinates = { lat: number; lng: number };
export type Location = { id: string; name: string; town: string; address: string; phone: string; hours: string[]; source: string; coordinates?: Coordinates };
export const locations: Location[] = directory;
export function distanceKm(a: Coordinates, b: Coordinates) {
  const rad = (n: number) => n * Math.PI / 180;
  const h = Math.sin(rad(b.lat - a.lat) / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(rad(b.lng - a.lng) / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}
export function nearbyLocations(query: string, origin: Coordinates | null) {
  return locations.filter((s) => `${s.name} ${s.town} ${s.address}`.toLowerCase().includes(query.trim().toLowerCase()))
    .map((s) => ({ ...s, distance: origin && s.coordinates ? distanceKm(origin, s.coordinates) : null }))
    .sort((a, b) => origin ? (a.distance ?? Infinity) - (b.distance ?? Infinity) : a.town.localeCompare(b.town) || a.name.localeCompare(b.name));
}
export const directionsUrl = (s: Location) => `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(s.coordinates ? `${s.coordinates.lat},${s.coordinates.lng}` : `MTC ${s.name}, ${s.address}, ${s.town}, Namibia`)}`;