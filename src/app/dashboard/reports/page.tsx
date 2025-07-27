import { ReportsClient } from "@/components/dashboard/reports-client";
import { transactions, categories } from "@/lib/mock-data";

export default function ReportsPage() {
    // In a real app, this data would be fetched from an API
  const props = {
    transactions,
    categories,
  };
  return <ReportsClient {...props} />;
}
