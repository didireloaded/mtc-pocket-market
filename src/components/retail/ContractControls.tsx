import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { nad } from "@/lib/data";

export type ContractTerm = 12 | 24 | 36;

export function ContractBudgetControl({ budget, onChange, min = 300, max = 3000 }: {
  budget: number; onChange: (value: number) => void; min?: number; max?: number;
}) {
  return <div className="space-y-4">
    <div className="flex items-end justify-between gap-4">
      <label id="budget-label" className="text-sm font-semibold">Monthly budget</label>
      <p className="text-2xl font-bold tracking-tight tabular-nums">{nad(budget)}<span className="ml-1 text-sm font-medium text-muted-foreground">/mo</span></p>
    </div>
    <Slider aria-labelledby="budget-label" min={min} max={max} step={50} value={[budget]} onValueChange={([value]) => { if (value !== undefined) onChange(value); }} className="py-3" />
    <div className="flex justify-between text-xs text-muted-foreground"><span>{nad(min)}</span><span>{nad(max)}</span></div>
  </div>;
}

export function ContractTermControl({ months, onChange, terms = [12, 24, 36] }: {
  months: ContractTerm; onChange: (value: ContractTerm) => void; terms?: ContractTerm[];
}) {
  return <div className="space-y-3">
    <p id="term-label" className="text-sm font-semibold">Contract duration</p>
    <ToggleGroup aria-labelledby="term-label" type="single" value={String(months)}
      onValueChange={(value) => { if (value) onChange(Number(value) as ContractTerm); }} className="grid grid-cols-3 gap-2">
      {terms.map((term) => <ToggleGroupItem key={term} value={String(term)}
        className="h-12 rounded-[14px] border bg-background text-sm font-semibold data-[state=on]:border-primary data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">{term} mo</ToggleGroupItem>)}
    </ToggleGroup>
  </div>;
}

export function UpfrontControl({ value, onChange, cash }: {
  value: number; onChange: (value: number) => void; cash?: number;
}) {
  return <div className="space-y-4">
    <div className="flex items-center justify-between gap-3">
      <label id="upfront-label" className="text-sm font-semibold">Upfront contribution</label>
      <span className="font-bold tabular-nums">{Math.round(value * 100)}%{typeof cash === "number" && <span className="ml-1 text-xs font-medium text-muted-foreground">({nad(Math.round(cash * value))})</span>}</span>
    </div>
    <Slider aria-labelledby="upfront-label" min={0} max={50} step={5} value={[Math.round(value * 100)]} onValueChange={([n]) => { if (n !== undefined) onChange(n / 100); }} className="py-3" />
    <div className={cn("flex justify-between text-xs text-muted-foreground")}><span>No upfront device payment</span><span>50%</span></div>
  </div>;
}
