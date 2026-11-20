// Catalog mirrors https://www.mtc.com.na/shop (cash prices and images as listed there). Do not add items MTC doesn't sell.
export type Category = "Phones" | "Wearables" | "Laptops" | "Tablets" | "Data devices" | "Accessories";
export const CATEGORIES: Category[] = ["Phones", "Laptops", "Tablets", "Wearables", "Data devices", "Accessories"];
export type Product = {
  id: string; name: string; tagline: string; category: Category; cash: number; contract: number;
  image: string; colors: string[]; specs: { label: string; value: string }[]; isNew?: boolean; featured?: boolean;
  brand: string; network: "4G" | "5G" | "None"; storage?: string; stock: { warehouse: number; stores: string[] }; gallery?: string[];
  contractable: boolean; badge?: string; source: string;
};
const img = (f: string) => `https://www.mtc.com.na/uploads/shop/items/${f}`;
const SHOP = "https://www.mtc.com.na/shop";
/** Collection stores as listed on MTC product pages ("Choose store for collection"). */
export const MTC_STORES = ["Daniel Munamava (Windhoek)", "Divundu", "Dune Mall (Walvis Bay)", "Eenhana", "Eveline (Windhoek)", "Gobabis", "Grootfontein", "Hosea Kutako (Windhoek)", "HTTP NUST (Windhoek)", "Katima Mulilo", "Katutura (Windhoek)", "Keetmanshoop Main", "Klein Windhoek", "Lüderitz", "Maerua Mall (Windhoek)", "Mariental", "Nkurenkuru", "Okahandja", "Okuryangava (Windhoek)", "Olympia (Windhoek)", "Omuthiya", "Ondangwa Express", "Ondangwa Main", "Ongwediva", "Opuwo", "Oranjemund", "Oshakati Main", "Oshikango", "Otjiwarongo", "Outapi", "Rehoboth", "Rundu", "Swakopmund Main", "Swakopmund Platz am Meer", "The Grove (Windhoek)", "Tsumeb", "Walvis Bay", "Wernhill (Windhoek)"];
type Seed = Omit<Product, "contract" | "colors" | "stock" | "contractable"> & Partial<Pick<Product, "colors" | "stock" | "contractable">>;
const seed: Seed[] = [
  // Phones
  { id: "iphone-18-pro-max-256gb", name: "iPhone 18 Pro Max 256GB", tagline: "Apple's biggest Pro.", category: "Phones", brand: "Apple", cash: 32999, image: img("iPhone-18-pro-max_(1).png"), network: "5G", storage: "256 GB", isNew: true, featured: true, badge: "Brand new", source: `${SHOP}/phone/iphone-18-pro-max-256gb`, specs: [{ label: "Storage", value: "256 GB" }, { label: "Network", value: "5G" }] },
  { id: "iphone-18-pro-256gb", name: "iPhone 18 Pro 256GB", tagline: "Pro, in your pocket.", category: "Phones", brand: "Apple", cash: 29999, image: img("iPhone-18-pro.png"), network: "5G", storage: "256 GB", isNew: true, badge: "Brand new", source: `${SHOP}/phone/iphone-18-256gb`, specs: [{ label: "Storage", value: "256 GB" }, { label: "Network", value: "5G" }] },
  { id: "iphone-air-256gb", name: "iPhone Air 256GB", tagline: "The thinnest iPhone.", category: "Phones", brand: "Apple", cash: 20999, image: img("iphone-air.png"), network: "5G", storage: "256 GB", badge: "eSIM only", source: `${SHOP}/phone/iphone-17-air-256gb`, specs: [{ label: "Storage", value: "256 GB" }, { label: "SIM", value: "eSIM only" }] },
  { id: "galaxy-s26-256gb", name: "Samsung Galaxy S26 256GB", tagline: "Galaxy AI, compact.", category: "Phones", brand: "Samsung", cash: 21999, image: img("samsung-galaxy-s26.jpg"), network: "4G", storage: "256 GB", isNew: true, source: `${SHOP}/phone/galaxy-s26-256gb`, specs: [{ label: "Memory", value: "256GB · 12GB RAM" }, { label: "Screen", value: '6.3"' }, { label: "Front camera", value: "12 MP" }, { label: "Dual SIM", value: "Yes" }] },
  { id: "galaxy-s25-ultra-256gb", name: "Samsung Galaxy S25 Ultra 256GB", tagline: "200MP. S Pen. Ultra.", category: "Phones", brand: "Samsung", cash: 25999, image: img("samsung-galaxy-s25-plus-256gb1.png"), network: "4G", storage: "256 GB", source: `${SHOP}/phone/galaxy-s25-ultra-256gb`, specs: [{ label: "Memory", value: "256GB · 12GB RAM" }, { label: "Screen", value: '6.9"' }, { label: "Rear camera", value: "200+50+50+10 MP" }, { label: "Front camera", value: "12 MP" }] },
  // Laptops
  { id: "macbook-neo-256gb", name: "Apple MacBook Neo 256GB", tagline: "New to the MacBook family.", category: "Laptops", brand: "Apple", cash: 14999, image: img("apple-macbook-neo.png"), network: "None", storage: "256 GB", isNew: true, badge: "New", source: `${SHOP}/laptop/macbook-neo-256gb`, specs: [{ label: "Storage", value: "256 GB" }] },
  { id: "macbook-air-256gb", name: "Apple MacBook Air 256GB", tagline: "Light. Fast. All day.", category: "Laptops", brand: "Apple", cash: 13499, image: img("macbook-air-256-m34.png"), network: "None", storage: "256 GB", source: `${SHOP}/laptop/macbook-air-256gb`, specs: [{ label: "Battery", value: "Up to 18 hrs" }, { label: "Chip", value: "M1" }, { label: "Memory", value: "8 GB" }, { label: "Screen", value: '13.3"' }] },
  { id: "macbook-pro-512gb", name: "Apple MacBook Pro 512GB", tagline: "Pro performance.", category: "Laptops", brand: "Apple", cash: 31999, image: img("macbook-air-256-m33.png"), network: "None", storage: "512 GB", source: `${SHOP}/laptop/macbook-pro-512gb`, specs: [{ label: "Storage", value: "512 GB" }] },
  // Tablets
  { id: "ipad-11-128gb", name: "Apple iPad 11 128GB", tagline: "The everyday iPad.", category: "Tablets", brand: "Apple", cash: 12999, image: img("apple-ipad-11-256gb1.png"), network: "None", storage: "128 GB", source: `${SHOP}/tablets`, specs: [{ label: "Screen", value: '11"' }, { label: "Storage", value: "128 GB" }] },
  { id: "ipad-air-11-256gb", name: "Apple iPad Air 11 256GB", tagline: "Air, with M3.", category: "Tablets", brand: "Apple", cash: 18199, image: img("apple-ipad-air-256gb-11-m3.png"), network: "None", storage: "256 GB", source: `${SHOP}/tablets`, specs: [{ label: "Screen", value: '11"' }, { label: "Storage", value: "256 GB" }] },
  { id: "ipad-pro-13-256gb", name: "Apple iPad Pro 13 256GB", tagline: "The ultimate iPad.", category: "Tablets", brand: "Apple", cash: 36999, image: img("apple-ipad-pro-13-256gb.png"), network: "None", storage: "256 GB", source: `${SHOP}/tablets`, specs: [{ label: "Screen", value: '13"' }, { label: "Storage", value: "256 GB" }] },
  { id: "galaxy-tab-s10-plus", name: "Samsung Galaxy Tab S10 Plus", tagline: "Big-screen Galaxy AI.", category: "Tablets", brand: "Samsung", cash: 24199, image: img("samsung-tab-s10-plus.png"), network: "None", source: `${SHOP}/tablets`, specs: [{ label: "Brand", value: "Samsung" }] },
  { id: "galaxy-tab-a9-plus", name: "Samsung Galaxy Tab A9+ 64GB", tagline: "Family-friendly tablet.", category: "Tablets", brand: "Samsung", cash: 4899, image: img("samsung-tab-a9.png"), network: "None", storage: "64 GB", source: `${SHOP}/tablets`, specs: [{ label: "Storage", value: "64 GB" }] },
  { id: "blackview-tab60-pro", name: "Blackview TAB60 Pro 128GB", tagline: "Value tablet.", category: "Tablets", brand: "Blackview", cash: 3669, image: img("blackview-tab-60-pro.png"), network: "None", storage: "128 GB", source: `${SHOP}/tablets`, specs: [{ label: "Storage", value: "128 GB" }] },
  // Wearables
  { id: "apple-watch-ultra3", name: "Apple Watch Ultra 3 49mm", tagline: "Built for the edge.", category: "Wearables", brand: "Apple", cash: 19499, image: img("apple-watch-ultra3-49mm.png"), network: "None", isNew: true, source: `${SHOP}/wearables`, specs: [{ label: "Case", value: "49 mm" }] },
  { id: "apple-watch-s11-42", name: "Apple Watch Series 11 42mm", tagline: "Your health, on time.", category: "Wearables", brand: "Apple", cash: 9699, image: img("apple-watch-series-11-42mm.png"), network: "None", source: `${SHOP}/wearables`, specs: [{ label: "Case", value: "42 mm" }] },
  { id: "apple-watch-se3-44", name: "Apple Watch SE 3rd Gen 44mm", tagline: "Essential Apple Watch.", category: "Wearables", brand: "Apple", cash: 6799, image: img("apple-watch-se-3rd-gen-44mm.png"), network: "None", source: `${SHOP}/wearables`, specs: [{ label: "Case", value: "44 mm" }] },
  { id: "galaxy-watch-ultra-lte", name: "Samsung Galaxy Watch Ultra LTE", tagline: "Ultra, with LTE.", category: "Wearables", brand: "Samsung", cash: 12499, image: img("samsung-watch-ultra-47mm.png"), network: "4G", source: `${SHOP}/wearables`, specs: [{ label: "Connectivity", value: "LTE" }] },
  { id: "galaxy-watch8-lte-44", name: "Samsung Galaxy Watch8 LTE 44mm", tagline: "Calls on your wrist.", category: "Wearables", brand: "Samsung", cash: 6499, image: img("samsung-galaxy-watch8-44mm.png"), network: "4G", source: `${SHOP}/wearables`, specs: [{ label: "Case", value: "44 mm" }, { label: "Connectivity", value: "LTE" }] },
  // Data devices (cash only)
  { id: "huawei-h155-5g", name: "Huawei H155-383 5G Router", tagline: "5G home internet.", category: "Data devices", brand: "Huawei", cash: 1949, image: "https://www.mtc.com.na/uploads/routers/huwaeii-h155-383-5g-idu.png", network: "5G", contractable: false, source: "https://www.mtc.com.na/wireless/devices", specs: [{ label: "Type", value: "5G indoor router" }] },
  { id: "zte-mf286c", name: "ZTE MF286C Router", tagline: "4G home Wi-Fi.", category: "Data devices", brand: "ZTE", cash: 1969, image: "https://www.mtc.com.na/uploads/routers/zte-mf286c_(002)_(1)1.png", network: "4G", contractable: false, source: `${SHOP}/datadevice/zte-mf286c`, specs: [{ label: "Type", value: "4G router" }] },
  { id: "zte-g5c", name: "ZTE G5C 5G Router", tagline: "5G for the whole home.", category: "Data devices", brand: "ZTE", cash: 3169, image: "https://www.mtc.com.na/uploads/routers/zte-g5c.png", network: "5G", contractable: false, source: "https://www.mtc.com.na/wireless/devices", specs: [{ label: "Type", value: "5G router" }] },
  { id: "zte-u10-pro", name: "ZTE U10 Pro MiFi", tagline: "Pocket Wi-Fi.", category: "Data devices", brand: "ZTE", cash: 589, image: "https://www.mtc.com.na/uploads/routers/zte-u10-pro%C2%A0.png", network: "4G", contractable: false, source: `${SHOP}/datadevice/zte-u10-pro`, specs: [{ label: "Type", value: "Portable MiFi" }] },
  // Accessories (cash only)
  { id: "airpods-pro-3", name: "Apple AirPods Pro 3rd Gen", tagline: "Pro-level listening.", category: "Accessories", brand: "Apple", cash: 6499, image: img("app-airponds-2rd-generation_(002)1.png"), network: "None", contractable: false, source: `${SHOP}/accessories`, specs: [{ label: "Type", value: "Earbuds" }] },
  { id: "airpods-4", name: "Apple AirPods 4", tagline: "Iconic, refined.", category: "Accessories", brand: "Apple", cash: 3189, image: img("images_(1).jpeg"), network: "None", contractable: false, source: `${SHOP}/accessories`, specs: [{ label: "Type", value: "Earbuds" }] },
  { id: "apple-pencil-pro", name: "Apple Pencil Pro", tagline: "For iPad.", category: "Accessories", brand: "Apple", cash: 3299, image: img("download.png"), network: "None", contractable: false, source: `${SHOP}/accessories`, specs: [{ label: "Works with", value: "iPad" }] },
  { id: "apple-20w-adapter", name: "Apple 20W USB-C Power Adapter", tagline: "Fast charging.", category: "Accessories", brand: "Apple", cash: 389, image: img("app-20w-usb-c-power-ad.png"), network: "None", contractable: false, source: `${SHOP}/accessories`, specs: [{ label: "Output", value: "20 W USB-C" }] },
  { id: "burtone-metal-tws", name: "Burtone Metal Series Earphones", tagline: "True wireless.", category: "Accessories", brand: "Burtone", cash: 570, image: img("burtone-metal-series-true-wireless_(002).png"), network: "None", contractable: false, source: `${SHOP}/accessories`, specs: [{ label: "Type", value: "True wireless" }] },
  { id: "dji-neo-fly-more", name: "DJI Neo Fly More Combo", tagline: "Palm-size drone.", category: "Accessories", brand: "DJI", cash: 6749, image: img("download_(3).jpg"), network: "None", contractable: false, source: `${SHOP}/accessories`, specs: [{ label: "Type", value: "Drone" }] },
];
export const products: Product[] = seed.map((s) => ({
  colors: ["Standard"], contractable: true,
  stock: { warehouse: 1, stores: MTC_STORES },
  ...s, contract: 0,
}));
export const brands = [...new Set(products.map((p) => p.brand))].sort();
export const accessoryIds = ["apple-20w-adapter", "airpods-4", "burtone-metal-tws"];
export const TERMS = [12, 24, 36, 48] as const;
/** MTC lists every shop item as orderable for collection at its stores; live stock levels are not published. */
export const stockLabel = (p: Product) => p.stock.stores.length ? { tone: "ok", text: `Available to order · collect at ${p.stock.stores.length} MTC stores` } : { tone: "out", text: "Out of stock" };

/** Real MTC contract packages (mtc.com.na/contract). Infinite plans let you build your own allowances. */
export const plans = [
  { id: "select-go", name: "Select Go+", fee: 199, data: "10 GB", mins: "300 min", sms: "200 SMS", terms: [12, 24, 36], laptop: true },
  { id: "select-up", name: "Select Up", fee: 299, data: "17 GB", mins: "400 min", sms: "300 SMS", terms: [12, 24, 36], laptop: true },
  { id: "select-super", name: "Select Super", fee: 499, data: "28 GB", mins: "600 min", sms: "400 SMS", terms: [12, 24, 36], laptop: true },
  { id: "select-pro", name: "Select Pro", fee: 699, data: "38 GB", mins: "1300 min", sms: "800 SMS", terms: [12, 24, 36], laptop: true },
  { id: "select-premium", name: "Select Premium", fee: 899, data: "50 GB", mins: "1500 min", sms: "1000 SMS", terms: [12, 24, 36], laptop: true },
  { id: "infinite-1", name: "Infinite I", fee: 350, data: "Your choice", mins: "Your choice", sms: "Your choice", terms: [12, 24, 36, 48], laptop: false },
  { id: "infinite-3", name: "Infinite III", fee: 750, data: "Your choice", mins: "Your choice", sms: "Your choice", terms: [12, 24, 36, 48], laptop: false },
] as const;
export type Plan = (typeof plans)[number];
export const CONNECTION_FEE = 218;
export const plansFor = (p: Product) => plans.filter((pl) => p.category !== "Laptops" || pl.laptop);

/** Device financing: 12-month total = cash × 1.055 (matches MTC's MacBook Air listing); longer terms assumed +5.5% per extra year. */
export const MARKUP: Record<number, number> = { 12: 0.055, 24: 0.11, 36: 0.165, 48: 0.22 };
export function quote(p: { cash: number }, plan: Plan, opt: { months?: number; upfrontPct?: number } = {}) {
  const months = opt.months && (plan.terms as readonly number[]).includes(opt.months) ? opt.months : 24;
  const upfront = Math.round(p.cash * (opt.upfrontPct ?? 0));
  const final = Math.round(p.cash * (1 + MARKUP[months]!) * 100) / 100;
  const device = Math.round(((final - upfront) / months) * 100) / 100;
  return { device, fee: plan.fee, upfront, connection: CONNECTION_FEE, final, monthly: Math.round((device + plan.fee) * 100) / 100, months };
}
export const fromMonthly = (p: Product) => Math.min(...plansFor(p).map((pl) => quote(p, pl, { months: pl.terms[pl.terms.length - 1]! }).monthly));

export const bundles = [
  { id: "b1", name: "1 GB Daily", price: 25, data: "1 GB", validity: "24 hrs" },
  { id: "b2", name: "5 GB Weekly", price: 79, data: "5 GB", validity: "7 days" },
  { id: "b3", name: "20 GB Monthly", price: 249, data: "20 GB", validity: "30 days" },
  { id: "esim", name: "Travel eSIM 10 GB", price: 199, data: "10 GB", validity: "30 days" },
];
export const nad = (n: number) => `N$${n.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: Number.isInteger(n) ? 0 : 2 })}`;
export const getProduct = (id: string) => products.find((p) => p.id === id);
