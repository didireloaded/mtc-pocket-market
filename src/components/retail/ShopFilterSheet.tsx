import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { SlidersHorizontal } from "lucide-react";
import { nad } from "@/lib/data";

export type ShopFilterValues = {
  brands: string[];
  net: string;
  maxCash: number;
  maxMonthly: number;
  storage: string;
};

export function ShopFilterSheet({ open, onOpenChange, values, onChange, brands, mode, results, activeCount }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  values: ShopFilterValues;
  onChange: (values: ShopFilterValues) => void;
  brands: string[];
  mode: "cash" | "contract";
  results: number;
  activeCount: number;
}) {
  const clear = () => onChange({ brands: [], net: "Any", maxCash: 40000, maxMonthly: 4000, storage: "Any" });
  return <>
    <Button type="button" variant="outline" onClick={() => onOpenChange(true)}
      className="h-11 shrink-0 gap-2 rounded-full border-border/70 bg-card px-4 text-[13px] font-semibold shadow-none">
      <SlidersHorizontal className="size-4" />Filters
      {activeCount > 0 && <Badge className="ml-1 rounded-full px-1.5 text-[11px]">{activeCount}</Badge>}
    </Button>
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="mx-auto max-h-[85dvh] w-full max-w-md overflow-y-auto rounded-t-[28px] bg-background px-5 pb-8 pt-8">
        <SheetHeader className="mb-5 text-left">
          <SheetTitle className="text-2xl font-bold tracking-tight">Refine your search</SheetTitle>
          <SheetDescription>Filter by brand, connectivity, storage and budget.</SheetDescription>
        </SheetHeader>
        <div className="space-y-6">
          <section>
            <p className="mb-3 text-[14px] font-semibold">Brand</p>
            <div className="flex flex-wrap gap-2">
              {brands.map((brand) => <Button key={brand} type="button" variant={values.brands.includes(brand) ? "default" : "outline"}
                aria-pressed={values.brands.includes(brand)}
                onClick={() => onChange({ ...values, brands: values.brands.includes(brand) ? values.brands.filter((v) => v !== brand) : [...values.brands, brand] })}
                className="h-11 rounded-full px-4 text-[13px] shadow-none">{brand}</Button>)}
            </div>
          </section>
          <div className="grid grid-cols-2 gap-3">
            <div><p className="text-[13px] font-semibold">Network</p>
              <Select value={values.net} onValueChange={(net) => onChange({ ...values, net })}>
                <SelectTrigger aria-label="Network" className="mt-2 h-12 rounded-[14px] border-border/70 bg-card shadow-none"><SelectValue /></SelectTrigger>
                <SelectContent>{["Any", "5G", "4G"].map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><p className="text-[13px] font-semibold">Storage</p>
              <Select value={values.storage} onValueChange={(storage) => onChange({ ...values, storage })}>
                <SelectTrigger aria-label="Storage" className="mt-2 h-12 rounded-[14px] border-border/70 bg-card shadow-none"><SelectValue /></SelectTrigger>
                <SelectContent>{["Any", "64 GB", "128 GB", "256 GB", "512 GB"].map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <section className="space-y-4 border-t pt-5">
            <div className="flex items-center justify-between gap-3 text-[14px] font-semibold">
              <p>{mode === "cash" ? "Maximum cash price" : "Estimated monthly budget"}</p>
              <p className="tabular-nums">{mode === "cash" ? nad(values.maxCash) : nad(values.maxMonthly) + "/mo"}</p>
            </div>
            {mode === "cash" ?
              <Slider aria-label="Maximum cash price" min={1000} max={40000} step={500} value={[values.maxCash]}
                onValueChange={([n]) => { if (n !== undefined) onChange({ ...values, maxCash: n }); }} className="py-3" /> :
              <Slider aria-label="Monthly budget" min={200} max={4000} step={50} value={[values.maxMonthly]}
                onValueChange={([n]) => { if (n !== undefined) onChange({ ...values, maxMonthly: n }); }} className="py-3" />}
          </section>
          <div className="flex gap-2 border-t pt-5">
            <Button type="button" variant="outline" onClick={clear} className="h-12 flex-1 rounded-full shadow-none">Clear</Button>
            <Button type="button" onClick={() => onOpenChange(false)} className="h-12 flex-1 rounded-full shadow-none">Show {results} items</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  </>;
}
