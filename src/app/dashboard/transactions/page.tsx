import { TransactionsClient } from "@/components/dashboard/transactions-client";
import { transactions, categories } from "@/lib/mock-data";

export default function TransactionsPage() {
    // In a real app, this data would be fetched from an API
  const props = {
    initialTransactions: transactions,
    categories,
  };
  return <TransactionsClient {...props} />;
}
