import { NAMIBIA_REGIONS } from "@/lib/namibia";

export type NamibiaAddress = {
  name: string;
  street: string;
  town: string;
  region?: string;
  phone: string;
};

type Props = {
  value: NamibiaAddress;
  onChange: (value: NamibiaAddress) => void;
  prefix: string;
};

const fields = [
  { key: "name", label: "Recipient name", autocomplete: "name", type: "text" },
  { key: "street", label: "Street address", autocomplete: "street-address", type: "text" },
  { key: "town", label: "Town or city", autocomplete: "address-level2", type: "text" },
  { key: "phone", label: "Contact number", autocomplete: "tel", type: "tel" },
] as const;

/** One consistent address form for local previews and authenticated order requests. */
export function NamibiaAddressFields({ value, onChange, prefix }: Props) {
  const set = (key: keyof NamibiaAddress, next: string) => onChange({ ...value, [key]: next });

  return <div className="space-y-3">
    {fields.slice(0, 3).map(({ key, label, autocomplete, type }) => <div key={key}>
      <label htmlFor={`${prefix}-${key}`} className="mb-1.5 block text-[13px] font-semibold">{label}</label>
      <input id={`${prefix}-${key}`} type={type} autoComplete={autocomplete} required
        maxLength={key === "name" ? 100 : 160}
        value={value[key]} onChange={(event) => set(key, event.target.value)}
        placeholder={label} className="h-12 w-full rounded-[14px] border border-border bg-[#F4F5F7] px-4 text-[16px] outline-none focus-visible:ring-2 focus-visible:ring-primary" />
    </div>)}
    <div>
      <label htmlFor={`${prefix}-region`} className="mb-1.5 block text-[13px] font-semibold">Region</label>
      <select id={`${prefix}-region`} required autoComplete="address-level1"
        value={value.region ?? ""} onChange={(event) => set("region", event.target.value)}
        className="h-12 w-full rounded-[14px] border border-border bg-[#F4F5F7] px-4 text-[16px] text-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary">
        <option value="">Choose a region</option>
        {NAMIBIA_REGIONS.map((region) => <option key={region} value={region}>{region}</option>)}
      </select>
    </div>
    <div>
      <label htmlFor={`${prefix}-phone`} className="mb-1.5 block text-[13px] font-semibold">Contact number</label>
      <input id={`${prefix}-phone`} type="tel" inputMode="tel" autoComplete="tel" required
        maxLength={30} minLength={8}
        value={value.phone} onChange={(event) => set("phone", event.target.value)}
        placeholder="081 123 4567" className="h-12 w-full rounded-[14px] border border-border bg-[#F4F5F7] px-4 text-[16px] outline-none focus-visible:ring-2 focus-visible:ring-primary" />
    </div>
  </div>;
}
