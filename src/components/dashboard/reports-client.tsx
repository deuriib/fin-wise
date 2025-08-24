// src/components/dashboard/reports-client.tsx
"use client";

import { useRef, useState, useMemo } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Category, Transaction } from "@/lib/types";
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from "recharts";
import { Button } from "../ui/button";
import { Download, Loader2, TrendingUp, TrendingDown, DollarSign, Wallet } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";

interface ReportsClientProps {
  transactions: Transaction[];
  categories: Category[];
}

export function ReportsClient({
  transactions,
  categories,
}: ReportsClientProps) {
  const [isLoading, setIsLoading] = useState(false);
  const reportsRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    const reportElement = reportsRef.current;
    if (!reportElement) return;

    setIsLoading(true);

    // Defer the heavy processing to allow the UI to update with the loading state first.
    setTimeout(async () => {
      try {
        const canvas = await html2canvas(reportElement, {
          scale: 2,
          backgroundColor: null,
          windowWidth: 1280, // Set a fixed width to ensure consistency
        });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'px',
          format: 'a4'
        });
        
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('financial-report.pdf');
      } catch (error) {
        console.error("Error generating PDF:", error);
      } finally {
        setIsLoading(false);
      }
    }, 100); // A small delay is enough to let the UI render the loading spinner
  };


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
    
    return {
      totalIncome,
      totalExpenses,
      netSavings: totalIncome - totalExpenses,
      totalTransactions: transactions.length,
    }
  }, [transactions]);
  
  // Data for spending trends line chart
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


  // Data for category spending bar chart
  const categorySpendingData = categories
    .map(category => {
      const total = transactions
        .filter(t => t.type === 'expense' && t.categoryId === category.id)
        .reduce((sum, t) => sum + t.amount, 0);
      return {
        name: category.name,
        total: total,
        fill: "hsl(var(--primary))",
      };
    })
    .filter(c => c.total > 0)
    .sort((a, b) => b.total - a.total);


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

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-headline">Reports</h1>
          <p className="text-muted-foreground">
            Analyze your financial habits and trends over time.
          </p>
        </div>
        <Button onClick={handleDownload} disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
            Download PDF
        </Button>
      </div>
      <div ref={reportsRef} className="space-y-6 bg-background p-4 rounded-lg">
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
                    <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
                    <Wallet className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{financialSummary.totalTransactions}</div>
                </CardContent>
            </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="font-headline">Income vs. Expenses</CardTitle>
              <CardDescription>
                Your income compared to your expenses over time.
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] lg:h-[400px]">
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
                  <YAxis tickFormatter={(value) => formatCurrency(value as number)} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area type="monotone" dataKey="Income" stroke="hsl(var(--accent))" fillOpacity={1} fill="url(#colorIncome)" />
                  <Area type="monotone" dataKey="Expenses" stroke="hsl(var(--destructive))" fillOpacity={1} fill="url(#colorExpense)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="font-headline">Category Spending</CardTitle>
              <CardDescription>
                How your spending is distributed across categories.
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] lg:h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categorySpendingData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tickFormatter={(value) => formatCurrency(value as number)}/>
                  <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="total" name="Total Spent" barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Transaction History</CardTitle>
                <CardDescription>A detailed list of all recorded transactions.</CardDescription>
            </CardHeader>
            <CardContent>
                 <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Description</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                            <TableCell className="font-medium">{transaction.description}</TableCell>
                            <TableCell>
                                <Badge variant="outline">{categories.find(c => c.id === transaction.categoryId)?.name}</Badge>
                            </TableCell>
                            <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                            <TableCell>
                                <Badge variant={transaction.type === "income" ? "default" : "secondary"}>{transaction.type}</Badge>
                            </TableCell>
                            <TableCell className={`text-right font-medium ${transaction.type === 'income' ? 'text-accent' : 'text-destructive'}`}>
                                {transaction.type === 'expense' ? '-' : ''}{formatCurrency(transaction.amount)}
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
