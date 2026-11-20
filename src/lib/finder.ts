import { plansFor, products, quote, type Plan, type Product } from "./data";

/** All figures are illustrative until approved by MTC. Never use this result to take a payment. */
export type FinderCategory = "Phones" | "Laptops";
export type FinderPriority = "affordability" | "more-data";
export type FinderOptions = {
  category: FinderCategory;
  budget: number;
  months: 12 | 24 | 36;
  upfrontPct: number;
  priority: FinderPriority;
};
export type FinderMatch = {
  product: Product;
  plan: Plan;
  monthly: number;
  deviceMonthly: number;
  planMonthly: number;
  payToday: number;
  totalOverTerm: number;
  allowances: string;
  withinBudget: boolean;
  overBudgetBy: number;
};

const dataGb = (p: Plan) => {
  const match = p.data.match(/\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : 0;
};

export function findContractMatches(options: FinderOptions): FinderMatch[] {
  const { budget, category, months, priority } = options;
  const upfrontPct = Math.min(0.5, Math.max(0, options.upfrontPct));
  return products.filter((p) => p.category === category && p.contractable).map((product) => {
    const candidates = plansFor(product)
      .filter((plan) => plan.id.startsWith("select-") && (plan.terms as readonly number[]).includes(months))
      .map((plan) => {
        const q = quote(product, plan, { months, upfrontPct });
        return {
          product, plan,
          monthly: q.monthly,
          deviceMonthly: q.device,
          planMonthly: q.fee,
          payToday: q.upfront + q.connection,
          totalOverTerm: Math.round((q.upfront + q.connection + q.monthly * months) * 100) / 100,
          allowances: `${plan.data} data · ${plan.mins} · ${plan.sms}`,
          withinBudget: q.monthly <= budget,
          overBudgetBy: Math.max(0, q.monthly - budget),
        };
      });
    const affordable = candidates.filter((candidate) => candidate.withinBudget);
    const pool = affordable.length ? affordable : candidates;
    const ranked = [...pool].sort((a, b) => {
      if (priority === "more-data" && affordable.length) return dataGb(b.plan) - dataGb(a.plan) || a.monthly - b.monthly;
      return a.monthly - b.monthly;
    });
    return ranked[0];
  }).filter((match): match is FinderMatch => !!match)
    .sort((a, b) =>
      Number(b.withinBudget) - Number(a.withinBudget) ||
      (priority === "more-data" && a.withinBudget && b.withinBudget
        ? dataGb(b.plan) - dataGb(a.plan) || a.monthly - b.monthly
        : a.monthly - b.monthly)
    )
    .slice(0, 3);
}
