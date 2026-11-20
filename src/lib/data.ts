export type Category = "Headphones" | "Laptops" | "Wearables" | "Audio" | "Phones";
export type Product = {
  id: string; name: string; tagline: string; category: Category; cash: number; contract: number;
  image: string; colors: string[]; specs: { label: string; value: string }[]; isNew?: boolean; featured?: boolean;
};
const u = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=80`;
export const products: Product[] = [
  { id: "sonic-pro-anc", name: "Sonic Pro ANC", tagline: "Silence, perfected.", category: "Headphones", cash: 6299, contract: 349, image: u("photo-1505740420928-5e560c06d30e"), colors: ["Midnight", "Silver"], featured: true,
    specs: [{ label: "Battery", value: "40 hrs" }, { label: "Connectivity", value: "BT 5.3" }, { label: "ANC", value: "Adaptive" }, { label: "Weight", value: "250 g" }] },
  { id: "creator-15", name: "Creator Series 15", tagline: "Built for makers.", category: "Laptops", cash: 28999, contract: 1199, image: u("photo-1496181133206-80ce9b88a853"), colors: ["Graphite"], isNew: true,
    specs: [{ label: "Battery", value: "18 hrs" }, { label: "Chip", value: "12-core" }, { label: "Display", value: '15" OLED' }, { label: "Storage", value: "1 TB" }] },
  { id: "creator-13", name: "Creator Series 13", tagline: "Power, pocketed.", category: "Laptops", cash: 21999, contract: 949, image: u("photo-1517336714731-489689fd1ca8"), colors: ["Silver"], isNew: true,
    specs: [{ label: "Battery", value: "20 hrs" }, { label: "Chip", value: "10-core" }, { label: "Display", value: '13" Retina' }, { label: "Storage", value: "512 GB" }] },
  { id: "pulse-watch", name: "Pulse Watch 3", tagline: "Your health, on time.", category: "Wearables", cash: 5499, contract: 299, image: u("photo-1523275335684-37898b6baf30"), colors: ["White", "Black"],
    specs: [{ label: "Battery", value: "5 days" }, { label: "Connectivity", value: "LTE + GPS" }, { label: "Water", value: "5 ATM" }, { label: "Sensors", value: "ECG, SpO2" }] },
  { id: "boom-speaker", name: "Boom Go Speaker", tagline: "Bass that travels.", category: "Audio", cash: 2199, contract: 129, image: u("photo-1608043152269-423dbba4e7e1"), colors: ["Teal", "Black"],
    specs: [{ label: "Battery", value: "24 hrs" }, { label: "Connectivity", value: "BT 5.2" }, { label: "Rating", value: "IP67" }, { label: "Output", value: "30 W" }] },
  { id: "air-buds", name: "Air Buds Lite", tagline: "Light. Loud. Ready.", category: "Audio", cash: 1799, contract: 99, image: u("photo-1590658268037-6bf12165a8df"), colors: ["White"], isNew: true,
    specs: [{ label: "Battery", value: "30 hrs" }, { label: "Connectivity", value: "BT 5.3" }, { label: "ANC", value: "Yes" }, { label: "Rating", value: "IPX4" }] },
  { id: "nova-x", name: "Nova X 5G", tagline: "Flagship speed.", category: "Phones", cash: 18999, contract: 799, image: u("photo-1511707171634-5f897ff02aa9"), colors: ["Obsidian", "Mint"],
    specs: [{ label: "Battery", value: "5000 mAh" }, { label: "Network", value: "5G + eSIM" }, { label: "Camera", value: "200 MP" }, { label: "Storage", value: "256 GB" }] },
  { id: "studio-max", name: "Studio Max", tagline: "Studio sound, anywhere.", category: "Headphones", cash: 8999, contract: 449, image: u("photo-1484704849700-f032a568e944"), colors: ["Black"],
    specs: [{ label: "Battery", value: "30 hrs" }, { label: "Connectivity", value: "BT 5.3" }, { label: "Drivers", value: "50 mm" }, { label: "ANC", value: "Pro" }] },
];
export const plans = [
  { id: "aweh-24", name: "Aweh Super 24", months: 24, data: "10 GB", mins: "500 min", extra: 0 },
  { id: "go-36", name: "MTC Go 36", months: 36, data: "25 GB", mins: "Unlimited", extra: 150 },
  { id: "max-24", name: "Max Unlimited", months: 24, data: "Unlimited", mins: "Unlimited", extra: 450 },
];
export const bundles = [
  { id: "b1", name: "1 GB Daily", price: 25, data: "1 GB", validity: "24 hrs" },
  { id: "b2", name: "5 GB Weekly", price: 79, data: "5 GB", validity: "7 days" },
  { id: "b3", name: "20 GB Monthly", price: 249, data: "20 GB", validity: "30 days" },
  { id: "esim", name: "Travel eSIM 10 GB", price: 199, data: "10 GB", validity: "30 days" },
];
export const nad = (n: number) => `N$${n.toLocaleString("en-US")}`;
export const getProduct = (id: string) => products.find((p) => p.id === id);
