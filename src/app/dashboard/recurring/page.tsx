// src/app/dashboard/recurring/page.tsx
"use client";

import { RecurringTransactionsClient } from "@/components/dashboard/recurring-transactions-client";
import { useAuth } from "@/hooks/use-auth";
import { useCollection } from "@/hooks/use-collection";
import type { Category, ScheduledTransaction } from "@/lib/types";
import { Loader2 } from "lucide-react";

export default function RecurringPage() {
  const { user } = useAuth();
  const { data: scheduledTransactions, loading: scheduledTransactionsLoading } = useCollection<ScheduledTransaction>(`users/${user?.uid}/scheduledTransactions`);
  const { data: categories, loading: categoriesLoading } = useCollection<Category>(`users/${user?.uid}/categories`);
  
  const isLoading = scheduledTransactionsLoading || categoriesLoading;
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>
  }

  return <RecurringTransactionsClient initialScheduledTransactions={scheduledTransactions} categories={categories} />;
}
