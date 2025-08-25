"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DollarSign, Wallet, PiggyBank, Target, AlertCircle, TrendingUp, TrendingDown } from "lucide-react";
import type { Budget, Category, Transaction, BankAccount, CreditCard, Goal } from "@/lib/types";
import { Pie, PieChart, ResponsiveContainer, Tooltip, Cell } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { WellnessScore } from "./wellness-score";
import { AIInsights } from "./ai-insights";
import { Button } from "../ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface DashboardClientProps {
  transactions: Transaction[];
  budgets: Budget[];
  categories: Category[];
  accounts: BankAccount[];
  creditCards: CreditCard[];
  goals: Goal[];
}

export function DashboardClient({
  transactions,
  budgets,
  categories,
  accounts,
  creditCards,
  goals,
}: DashboardClientProps) {
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  const netSavings = totalIncome - totalExpenses;

  const spendingByCategory = categories.map((category) => {
    const total = transactions
      .filter(
        (t) => t.type === "expense" && t.categoryId === category.id
      )
      .reduce((sum, t) => sum + t.amount, 0);
    return { name: category.name, total, fill: category.color };
  }).filter(c => c.total > 0);

  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
  
  const budgetsWithSpent = budgets.map(budget => {
    const spent = transactions
      .filter(t => t.type === 'expense' && t.categoryId === budget.categoryId)
      .reduce((sum, t) => sum + t.amount, 0);
    return { ...budget, spent };
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };
  
  return (
    <div className="space-y-6">
       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalIncome)}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalExpenses)}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Savings</CardTitle>
            <PiggyBank className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netSavings >= 0 ? 'text-accent' : 'text-destructive'}`}>{formatCurrency(netSavings)}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
         <Card className="flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">AI Tools</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-end gap-2">
            <WellnessScore transactions={transactions} income={totalIncome} categories={categories} accounts={accounts} creditCards={creditCards} />
            <AIInsights transactions={transactions} budgets={budgets} income={totalIncome} categories={categories} accounts={accounts} creditCards={creditCards} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-headline">Recent Transactions</CardTitle>
              <CardDescription>Your 5 most recent transactions.</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/transactions">
                    View All <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">{transaction.description}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{categories.find(c => c.id === transaction.categoryId)?.name}</Badge>
                    </TableCell>
                    <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                    <TableCell className={`text-right font-medium ${transaction.type === 'income' ? 'text-accent' : 'text-destructive'}`}>
                      {transaction.type === 'expense' ? '-' : ''}{formatCurrency(transaction.amount)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="font-headline">Spending Breakdown</CardTitle>
            <CardDescription>Your expense distribution by category.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={spendingByCategory} dataKey="total" nameKey="name" cx="50%" cy="50%" outerRadius={100} labelLine={false} label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                      const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                      const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                      const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                      return (
                        <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" className="text-xs font-medium">
                          {`${(percent * 100).toFixed(0)}%`}
                        </text>
                      );
                    }}>
                     {spendingByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Budget Progress</CardTitle>
            <CardDescription>How you are tracking against your monthly budgets.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
              {budgetsWithSpent.length > 0 ? budgetsWithSpent.map(budget => {
                  const category = categories.find(c => c.id === budget.categoryId);
                  const progress = Math.min((budget.spent / budget.limit) * 100, 100);
                  return (
                      <div key={budget.id}>
                          <div className="flex justify-between mb-1 text-sm">
                              <span className="font-medium">{category?.name}</span>
                              <span className="text-muted-foreground">{formatCurrency(budget.spent)} / {formatCurrency(budget.limit)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Progress value={progress} className="h-2"/>
                            <span className="text-xs font-semibold text-muted-foreground w-10 text-right">{Math.round(progress)}%</span>
                          </div>
                          {progress >= 100 && <p className="text-xs text-destructive mt-1 flex items-center"><AlertCircle className="h-3 w-3 mr-1"/>Over budget!</p>}
                      </div>
                  )
              }) : <p className="text-sm text-muted-foreground">No budgets created yet.</p>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Goal Progress</CardTitle>
            <CardDescription>An overview of your financial goals.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
              {goals.length > 0 ? goals.map(goal => {
                  const progress = Math.min((goal.savedAmount / goal.targetAmount) * 100, 100);
                  return (
                      <div key={goal.id}>
                          <div className="flex justify-between mb-1 text-sm">
                              <span className="font-medium">{goal.name}</span>
                              <span className="text-muted-foreground">{formatCurrency(goal.savedAmount)} / {formatCurrency(goal.targetAmount)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Progress value={progress} className="h-2"/>
                            <span className="text-xs font-semibold text-muted-foreground w-10 text-right">{Math.round(progress)}%</span>
                          </div>
                      </div>
                  )
              }) : <p className="text-sm text-muted-foreground">No goals created yet.</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
