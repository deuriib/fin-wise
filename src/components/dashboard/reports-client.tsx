"use client";

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
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from "recharts";

interface ReportsClientProps {
  transactions: Transaction[];
  categories: Category[];
}

export function ReportsClient({
  transactions,
  categories,
}: ReportsClientProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };
  
  // Data for spending trends line chart
  const spendingTrendsData = transactions
    .filter(t => t.type === 'expense')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(t => ({
      date: new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      amount: t.amount,
    }));

  // Data for category spending bar chart
  const categorySpendingData = categories
    .map(category => {
      const total = transactions
        .filter(t => t.type === 'expense' && t.categoryId === category.id)
        .reduce((sum, t) => sum + t.amount, 0);
      return {
        name: category.name,
        total: total,
      };
    })
    .filter(c => c.total > 0)
    .sort((a, b) => b.total - a.total);


  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-background p-2 shadow-sm">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col space-y-1">
              <span className="text-[0.70rem] uppercase text-muted-foreground">
                {payload[0].name === 'total' ? 'Spending' : 'Amount'}
              </span>
              <span className="font-bold text-muted-foreground">
                {formatCurrency(payload[0].value)}
              </span>
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">
       <div>
          <h1 className="text-3xl font-bold font-headline">Reports</h1>
          <p className="text-muted-foreground">
            Analyze your financial habits and trends over time.
          </p>
        </div>
        
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Spending Trends</CardTitle>
            <CardDescription>
              Your total expenses over time.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={spendingTrendsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis tickFormatter={(value) => formatCurrency(value)} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={false}
                  name="Expense"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Category Spending</CardTitle>
            <CardDescription>
              How your spending is distributed across categories.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categorySpendingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={60} />
                <YAxis tickFormatter={(value) => formatCurrency(value)} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="total" fill="hsl(var(--accent))" name="Total Spent" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
