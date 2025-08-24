// src/app/dashboard/budgets/page.tsx
"use client";

import { BudgetsClient } from "@/components/dashboard/budgets-client";
import { useAuth } from "@/hooks/use-auth";
import { useCollection } from "@/hooks/use-collection";
import type { Budget, Category, Transaction } from "@/lib/types";
import { Loader2 } from "lucide-react";

export default function BudgetsPage() {
    const { user } = useAuth();
    const { data: budgets, loading: budgetsLoading } = useCollection<Budget>(`users/${user?.uid}/budgets`);
    const { data: categories, loading: categoriesLoading } = useCollection<Category>(`users/${user?.uid}/categories`);
    const { data: transactions, loading: transactionsLoading } = useCollection<Transaction>(`users/${user?.uid}/transactions`);
    
    const isLoading = budgetsLoading || categoriesLoading || transactionsLoading;

    if (isLoading) {
      return <div className="flex items-center justify-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>
    }

    return <BudgetsClient initialBudgets={budgets} categories={categories} transactions={transactions} />;
}
