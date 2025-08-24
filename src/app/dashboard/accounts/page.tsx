// src/app/dashboard/accounts/page.tsx
"use client";

import { AccountsClient } from "@/components/dashboard/accounts-client";
import { useAuth } from "@/hooks/use-auth";
import { useCollection } from "@/hooks/use-collection";
import type { BankAccount, Transaction } from "@/lib/types";
import { Loader2 } from "lucide-react";

export default function AccountsPage() {
    const { user } = useAuth();
    const { data: accounts, loading: accountsLoading } = useCollection<BankAccount>(`users/${user?.uid}/accounts`);
    const { data: transactions, loading: transactionsLoading } = useCollection<Transaction>(`users/${user?.uid}/transactions`);
    
    const isLoading = accountsLoading || transactionsLoading;

    if (isLoading) {
      return <div className="flex items-center justify-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>
    }

    return <AccountsClient initialAccounts={accounts} transactions={transactions} />;
}
