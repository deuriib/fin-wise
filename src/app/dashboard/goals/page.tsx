// src/app/dashboard/goals/page.tsx
"use client";

import { GoalsClient } from "@/components/dashboard/goals-client";
import { useAuth } from "@/hooks/use-auth";
import { useCollection } from "@/hooks/use-collection";
import type { Goal, BankAccount } from "@/lib/types";
import { Loader2 } from "lucide-react";

export default function GoalsPage() {
    const { user } = useAuth();
    const { data: goals, loading: goalsLoading } = useCollection<Goal>(`users/${user?.uid}/goals`);
    const { data: accounts, loading: accountsLoading } = useCollection<BankAccount>(`users/${user?.uid}/accounts`);
    
    const isLoading = goalsLoading || accountsLoading;

    if (isLoading) {
      return <div className="flex items-center justify-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>
    }

    return <GoalsClient initialGoals={goals} accounts={accounts} />;
}
