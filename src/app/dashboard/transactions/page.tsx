// src/app/dashboard/transactions/page.tsx
"use client";

import { TransactionsClient } from "@/components/dashboard/transactions-client";
import { useAuth } from "@/hooks/use-auth";
import { useCollection } from "@/hooks/use-collection";
import type { Category, Transaction, CreditCard, BankAccount } from "@/lib/types";
import { Loader2 } from "lucide-react";

export default function TransactionsPage() {
  const { user } = useAuth();
  const { data: transactions, loading: transactionsLoading } = useCollection<Transaction>(`users/${user?.uid}/transactions`);
  const { data: categories, loading: categoriesLoading } = useCollection<Category>(`users/${user?.uid}/categories`);
  const { data: creditCards, loading: creditCardsLoading } = useCollection<CreditCard>(`users/${user?.uid}/creditCards`);
  const { data: accounts, loading: accountsLoading } = useCollection<BankAccount>(`users/${user?.uid}/accounts`);
  
  const isLoading = transactionsLoading || categoriesLoading || creditCardsLoading || accountsLoading;
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>
  }

  return <TransactionsClient initialTransactions={transactions} categories={categories} creditCards={creditCards} accounts={accounts} />;
}
