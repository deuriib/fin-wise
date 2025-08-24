// src/components/dashboard/profile-client.tsx
"use client";

import { useMemo } from "react";
import type { User } from "firebase/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { BankAccount, Category, CreditCard, Transaction } from "@/lib/types";
import { TrendingUp, TrendingDown, Landmark, CreditCard as CreditCardIcon, ShoppingCart, DollarSign } from "lucide-react";

interface ProfileClientProps {
  user: User;
  transactions: Transaction[];
  categories: Category[];
  accounts: BankAccount[];
  creditCards: CreditCard[];
}

export function ProfileClient({ user, transactions, categories, accounts, creditCards }: ProfileClientProps) {
  
  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length > 1 && names[1]) {
      return names[0][0] + names[names.length - 1][0];
    }
    return name[0];
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const financialSummary = useMemo(() => {
    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const spendingByCategory = categories.map((category) => {
        const total = transactions
        .filter(
            (t) => t.type === "expense" && t.categoryId === category.id
        )
        .reduce((sum, t) => sum + t.amount, 0);
        return { name: category.name, total };
    }).filter(c => c.total > 0);

    const topCategory = spendingByCategory.length > 0 
        ? spendingByCategory.reduce((prev, current) => (prev.total > current.total) ? prev : current)
        : { name: 'N/A', total: 0 };
    
    return {
      totalIncome,
      totalExpenses,
      netSavings: totalIncome - totalExpenses,
      topCategory
    }
  }, [transactions, categories]);

  return (
    <div className="space-y-6">
        <Card>
            <CardHeader className="flex flex-row items-center gap-4">
                <Avatar className="h-20 w-20">
                    <AvatarImage src={user.photoURL || undefined} />
                    <AvatarFallback className="text-2xl">{getInitials(user.displayName)}</AvatarFallback>
                </Avatar>
                <div>
                    <CardTitle className="text-3xl font-bold font-headline">{user.displayName}</CardTitle>
                    <CardDescription className="text-lg">{user.email}</CardDescription>
                </div>
            </CardHeader>
        </Card>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Income</CardTitle>
                    <TrendingUp className="h-4 w-4 text-accent" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(financialSummary.totalIncome)}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                    <TrendingDown className="h-4 w-4 text-destructive" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(financialSummary.totalExpenses)}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Net Savings</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className={`text-2xl font-bold ${financialSummary.netSavings >= 0 ? 'text-accent' : 'text-destructive'}`}>
                        {formatCurrency(financialSummary.netSavings)}
                    </div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Top Spending Category</CardTitle>
                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{financialSummary.topCategory.name}</div>
                    <p className="text-xs text-muted-foreground">{formatCurrency(financialSummary.topCategory.total)} spent</p>
                </CardContent>
            </Card>
        </div>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Financial Accounts</CardTitle>
                <CardDescription>A summary of your connected accounts and cards.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-4 rounded-lg border p-4">
                    <Landmark className="h-8 w-8 text-muted-foreground" />
                    <div>
                        <p className="text-2xl font-bold">{accounts.length}</p>
                        <p className="text-sm text-muted-foreground">Bank Accounts</p>
                    </div>
                </div>
                 <div className="flex items-center gap-4 rounded-lg border p-4">
                    <CreditCardIcon className="h-8 w-8 text-muted-foreground" />
                    <div>
                        <p className="text-2xl font-bold">{creditCards.length}</p>
                        <p className="text-sm text-muted-foreground">Credit Cards</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
