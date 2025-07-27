import { BudgetsClient } from "@/components/dashboard/budgets-client";
import { budgets, categories, transactions } from "@/lib/mock-data";

export default function BudgetsPage() {
    // In a real app, this data would be fetched from an API
  const props = {
    initialBudgets: budgets,
    categories,
    transactions
  };
  return <BudgetsClient {...props} />;
}
