// src/app/dashboard/profile/page.tsx
"use client";

import { ProfileClient } from "@/components/dashboard/profile-client";
import { useAuth } from "@/hooks/use-auth";
import { useCollection } from "@/hooks/use-collection";
import type { BankAccount, Category, CreditCard, Transaction } from "@/lib/types";
import { Loader2 } from "lucide-react";

export default function ProfilePage() {
    const { user, loading: userLoading } = useAuth();
    const { data: transactions, loading: transactionsLoading } = useCollection<Transaction>(`users/${user?.uid}/transactions`);
    const { data: categories, loading: categoriesLoading } = useCollection<Category>(`users/${user?.uid}/categories`);
    const { data: accounts, loading: accountsLoading } = useCollection<BankAccount>(`users/${user?.uid}/accounts`);
    const { data: creditCards, loading: creditCardsLoading } = useCollection<CreditCard>(`users/${user?.uid}/creditCards`);
    
    const isLoading = userLoading || transactionsLoading || categoriesLoading || accountsLoading || creditCardsLoading;
    
    if (isLoading || !user) {
      return <div className="flex items-center justify-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>
    }

    return <ProfileClient 
              user={user} 
              transactions={transactions} 
              categories={categories} 
              accounts={accounts} 
              creditCards={creditCards} 
            />;
}
