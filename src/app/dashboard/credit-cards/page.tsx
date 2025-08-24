// src/app/dashboard/credit-cards/page.tsx
"use client";

import { CreditCardsClient } from "@/components/dashboard/credit-cards-client";
import { useAuth } from "@/hooks/use-auth";
import { useCollection } from "@/hooks/use-collection";
import type { CreditCard, Transaction } from "@/lib/types";
import { Loader2 } from "lucide-react";

export default function CreditCardsPage() {
    const { user } = useAuth();
    const { data: creditCards, loading: cardsLoading } = useCollection<CreditCard>(`users/${user?.uid}/creditCards`);
    const { data: transactions, loading: transactionsLoading } = useCollection<Transaction>(`users/${user?.uid}/transactions`);
    
    const isLoading = cardsLoading || transactionsLoading;

    if (isLoading) {
      return <div className="flex items-center justify-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>
    }

    return <CreditCardsClient initialCreditCards={creditCards} transactions={transactions} />;
}
