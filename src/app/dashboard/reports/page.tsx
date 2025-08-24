// src/app/dashboard/reports/page.tsx
"use client";

import { ReportsClient } from "@/components/dashboard/reports-client";
import { useAuth } from "@/hooks/use-auth";
import { useCollection } from "@/hooks/use-collection";
import type { Category, Transaction } from "@/lib/types";
import { Loader2 } from "lucide-react";


export default function ReportsPage() {
  const { user } = useAuth();
  const { data: transactions, loading: transactionsLoading } = useCollection<Transaction>(`users/${user?.uid}/transactions`);
  const { data: categories, loading: categoriesLoading } = useCollection<Category>(`users/${user?.uid}/categories`);

  const isLoading = transactionsLoading || categoriesLoading;

  if (isLoading) {
    return <div className="flex items-center justify-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>
  }

  return <ReportsClient transactions={transactions} categories={categories} />;
}
