// src/app/dashboard/recurring/page.tsx
"use client";

import { RecurringTransactionsClient } from "@/components/dashboard/recurring-transactions-client";
import { useAuth } from "@/hooks/use-auth";
import { useCollection } from "@/hooks/use-collection";
import type { BankAccount, Category, CreditCard, ScheduledTransaction } from "@/lib/types";
import { Loader2 } from "lucide-react";

export default function RecurringPage() {
  const { user } = useAuth();
  const { data: scheduledTransactions, loading: scheduledTransactionsLoading } = useCollection<ScheduledTransaction>(`users/${user?.uid}/scheduledTransactions`);
  const { data: categories, loading: categoriesLoading } = useCollection<Category>(`users/${user?.uid}/categories`);
  const { data: accounts, loading: accountsLoading } = useCollection<BankAccount>(`users/${user?.uid}/accounts`);
  
  const isLoading = scheduledTransactionsLoading || categoriesLoading || accountsLoading;
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>
  }

  return <RecurringTransactionsClient 
            initialScheduledTransactions={scheduledTransactions} 
            categories={categories}
            accounts={accounts}
          />;
}
