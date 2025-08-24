// src/components/dashboard/account-detail-client.tsx
"use client";

import type { BankAccount, CreditCard, Transaction } from "@/lib/types";
import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import Link from "next/link";
import { Button } from "../ui/button";
import { ArrowLeft, MoreVertical } from "lucide-react";
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { AddAccountDialog } from "./add-account-dialog";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { updateDocument } from "@/services/firestore";

interface AccountDetailClientProps {
  account: BankAccount;
  transactions: Transaction[];
  creditCards: CreditCard[];
}

export function AccountDetailClient({
  account,
  transactions,
  creditCards,
}: AccountDetailClientProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const accountsPath = `users/${user?.uid}/accounts`;
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const balance = useMemo(() => {
    const transactionTotal = transactions.reduce((acc, t) => {
        if (t.type === 'income') return acc + t.amount;
        if (t.type === 'expense') return acc - t.amount;
        return acc;
    }, 0);
    return (account.initialBalance || 0) + transactionTotal;
  }, [transactions, account]);

  const associatedCreditCards = useMemo(() => {
      return creditCards.filter(c => c.bank === account.bankName);
  }, [creditCards, account.bankName]);

  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const monthlyData: { [key: string]: { income: number, expense: number } } = {};
  transactions.forEach(t => {
      const month = new Date(t.date).toLocaleString('default', { month: 'short', year: '2-digit' });
      if (!monthlyData[month]) {
          monthlyData[month] = { income: 0, expense: 0 };
      }
      monthlyData[month][t.type] += t.amount;
  });

  const incomeVsExpenseData = Object.keys(monthlyData).map(month => ({
    name: month,
    Income: monthlyData[month].income,
    Expenses: monthlyData[month].expense
  })).sort((a,b) => new Date(`1 ${a.name}`).getTime() - new Date(`1 ${b.name}`).getTime());
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-background p-2 shadow-sm">
          <p className="font-bold mb-2">{label}</p>
          {payload.map((pld: any, index: number) => (
            <div key={index} style={{ color: pld.color }}>
              <strong>{pld.name}:</strong> {formatCurrency(pld.value)}
            </div>
          ))}
        </div>
      )
    }
    return null
  }

  const handleEdit = () => {
    setIsDialogOpen(true);
  };

  const handleSubmit = async (values: Omit<BankAccount, "id">) => {
    try {
      await updateDocument(accountsPath, account.id, values);
      toast({ title: "Account updated successfully." });
      setIsDialogOpen(false);
    } catch (error) {
      toast({ variant: "destructive", title: "Error saving account." });
    }
  };

  return (
    <div className="space-y-6">
       <div className="flex justify-start items-center mb-6">
         <Button variant="outline" asChild>
            <Link href="/dashboard/accounts">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Accounts
            </Link>
         </Button>
      </div>
      <Card>
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle className="text-3xl font-bold font-headline">{account.name}</CardTitle>
            <CardDescription>{account.bankName} - {account.type.charAt(0).toUpperCase() + account.type.slice(1)} (...{account.accountNumberLast4})</CardDescription>
          </div>
           <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent>
            <div className="text-4xl font-bold">{formatCurrency(balance)}</div>
            <p className="text-sm text-muted-foreground">Current Balance</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-3">
             <Card>
                <CardHeader>
                  <CardTitle className="font-headline">Cash Flow</CardTitle>
                  <CardDescription>
                    Income vs. Expenses for this account.
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={incomeVsExpenseData}>
                      <defs>
                        <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => formatCurrency(value)} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Area type="monotone" dataKey="Income" stroke="hsl(var(--accent))" fillOpacity={1} fill="url(#colorIncome)" />
                      <Area type="monotone" dataKey="Expenses" stroke="hsl(var(--destructive))" fillOpacity={1} fill="url(#colorExpense)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>

        <div className="lg:col-span-3">
             <Card>
                <CardHeader>
                  <CardTitle className="font-headline">Recent Transactions</CardTitle>
                   <CardDescription>The last 5 transactions for this account.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Description</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recentTransactions.map((transaction) => (
                          <TableRow key={transaction.id}>
                            <TableCell className="font-medium">{transaction.description}</TableCell>
                            <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                            <TableCell className={`text-right font-medium`}>
                                <Badge variant={transaction.type === 'income' ? 'default' : 'destructive'} className={`${transaction.type === 'income' ? 'bg-accent text-accent-foreground' : ''}`}>{transaction.type === 'expense' ? '-' : '+'}{formatCurrency(transaction.amount)}</Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
        
         <div className="lg:col-span-3">
             <Card>
                <CardHeader>
                  <CardTitle className="font-headline">Associated Credit Cards</CardTitle>
                   <CardDescription>Credit cards from {account.bankName}.</CardDescription>
                </CardHeader>
                <CardContent>
                   {associatedCreditCards.length > 0 ? (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {associatedCreditCards.map(card => (
                                <Card key={card.id}>
                                    <CardHeader>
                                        <CardTitle>{card.name}</CardTitle>
                                        <CardDescription>**** **** **** {card.last4}</CardDescription>
                                    </CardHeader>
                                </Card>
                            ))}
                        </div>
                   ) : (
                    <p className="text-sm text-muted-foreground">No credit cards from this bank have been added yet.</p>
                   )}
                </CardContent>
            </Card>
        </div>
      </div>
      <AddAccountDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleSubmit}
        accountToEdit={account}
      />
    </div>
  );
}
