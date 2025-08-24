// src/app/dashboard/accounts/[accountId]/page.tsx
"use client";

import { AccountDetailClient } from "@/components/dashboard/account-detail-client";
import { useAuth } from "@/hooks/use-auth";
import { useCollection } from "@/hooks/use-collection";
import { useDocument } from "@/hooks/use-document";
import type { BankAccount, CreditCard, Transaction } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { useMemo } from "react";

export default function AccountDetailPage({ params }: { params: { accountId: string } }) {
    const { user } = useAuth();
    const accountId = params.accountId;

    const { data: account, loading: accountLoading } = useDocument<BankAccount>(`users/${user?.uid}/accounts/${accountId}`);
    const { data: transactionsData, loading: transactionsLoading } = useCollection<Transaction>(`users/${user?.uid}/transactions`);
    const { data: creditCards, loading: creditCardsLoading } = useCollection<CreditCard>(`users/${user?.uid}/creditCards`);

    const accountTransactions = useMemo(() => {
        if (!transactionsData) return [];
        return transactionsData.filter(t => t.accountId === accountId);
    }, [transactionsData, accountId]);


    const isLoading = accountLoading || transactionsLoading || creditCardsLoading;

    if (isLoading || !account) {
      return <div className="flex items-center justify-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>
    }

    return <AccountDetailClient account={account} transactions={accountTransactions} creditCards={creditCards} />;
}
