"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Wallet, PiggyBank, BarChart3, AlertCircle } from "lucide-react";
import type { Budget, Category, Transaction } from "@/lib/types";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Pie, PieChart, Cell } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { WellnessScore } from "./wellness-score";
import { AIInsights } from "./ai-insights";

interface DashboardClientProps {
  transactions: Transaction[];
  budgets: Budget[];
  categories: Category[];
}

export function DashboardClient({
  transactions,
  budgets,
  categories,
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
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalIncome)}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
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
            <div className={`text-2xl font-bold ${netSavings >= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatCurrency(netSavings)}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Tools</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <WellnessScore transactions={transactions} income={totalIncome} />
            <AIInsights transactions={transactions} budgets={budgets} income={totalIncome} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle className="font-headline">Recent Transactions</CardTitle>
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
                    <TableCell className={`text-right font-medium ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
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
          </CardHeader>
          <CardContent className="h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={spendingByCategory} dataKey="total" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
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
      
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Budget Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            {budgetsWithSpent.length > 0 ? budgetsWithSpent.map(budget => {
                const category = categories.find(c => c.id === budget.categoryId);
                const progress = (budget.spent / budget.limit) * 100;
                return (
                    <div key={budget.id}>
                        <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">{category?.name}</span>
                            <span className="text-sm text-muted-foreground">{formatCurrency(budget.spent)} / {formatCurrency(budget.limit)}</span>
                        </div>
                        <Progress value={progress} />
                        {progress > 100 && <p className="text-xs text-destructive mt-1 flex items-center"><AlertCircle className="h-3 w-3 mr-1"/>Over budget!</p>}
                    </div>
                )
            }) : <p className="text-sm text-muted-foreground">No budgets created yet.</p>}
        </CardContent>
      </Card>
    </div>
  );
}
