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
  AreaChart,
  Area,
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
       <div>
          <h1 className="text-3xl font-bold font-headline">Reports</h1>
          <p className="text-muted-foreground">
            Analyze your financial habits and trends over time.
          </p>
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
                <YAxis tickFormatter={(value) => formatCurrency(value)} />
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
                <XAxis type="number" tickFormatter={(value) => formatCurrency(value)}/>
                <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="total" name="Total Spent" barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
