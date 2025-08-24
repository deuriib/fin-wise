// src/app/dashboard/page.tsx
"use client";

import { DashboardClient } from "@/components/dashboard/dashboard-client";
import { useAuth } from "@/hooks/use-auth";
import { useCollection } from "@/hooks/use-collection";
import type { Budget, Category, Transaction, BankAccount, CreditCard } from "@/lib/types";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();

  const { data: transactions, loading: transactionsLoading } = useCollection<Transaction>(`users/${user?.uid}/transactions`);
  const { data: budgets, loading: budgetsLoading } = useCollection<Budget>(`users/${user?.uid}/budgets`);
  const { data: categories, loading: categoriesLoading } = useCollection<Category>(`users/${user?.uid}/categories`);
  const { data: accounts, loading: accountsLoading } = useCollection<BankAccount>(`users/${user?.uid}/accounts`);
  const { data: creditCards, loading: creditCardsLoading } = useCollection<CreditCard>(`users/${user?.uid}/creditCards`);
  
  const isLoading = transactionsLoading || budgetsLoading || categoriesLoading || accountsLoading || creditCardsLoading;

  if (isLoading) {
    return <div className="flex items-center justify-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>
  }

  return <DashboardClient 
            transactions={transactions} 
            budgets={budgets} 
            categories={categories} 
            accounts={accounts} 
            creditCards={creditCards} 
          />;
}
