/** Namibia's 14 administrative regions for delivery-address entry. */
export const NAMIBIA_REGIONS = [
  "Erongo",
  "Hardap",
  "ǁKaras",
  "Kavango East",
  "Kavango West",
  "Khomas",
  "Kunene",
  "Ohangwena",
  "Omaheke",
  "Omusati",
  "Oshana",
  "Oshikoto",
  "Otjozondjupa",
  "Zambezi",
] as const;

export type NamibiaRegion = (typeof NAMIBIA_REGIONS)[number];
export const isNamibiaRegion = (value: string | undefined): value is NamibiaRegion =>
  NAMIBIA_REGIONS.some((region) => region === value);
