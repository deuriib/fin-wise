import { DashboardClient } from "@/components/dashboard/dashboard-client";
import { transactions, budgets, categories } from "@/lib/mock-data";

export default function DashboardPage() {
  // In a real app, this data would be fetched from an API
  const props = {
    transactions,
    budgets,
    categories,
  };

  return <DashboardClient {...props} />;
}
