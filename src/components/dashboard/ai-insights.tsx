"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Wand2, Loader2, Sparkles } from "lucide-react";
import { generateSpendingInsights } from "@/ai/flows/generate-spending-insights";
import type { Budget, Category, Transaction } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

interface AIInsightsProps {
  transactions: Transaction[];
  budgets: Budget[];
  income: number;
  categories: Category[];
}

export function AIInsights({ transactions, budgets, income, categories }: AIInsightsProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [insights, setInsights] = useState<string[]>([]);
  const { toast } = useToast();

  const getCategoryName = (id: string) => {
    return categories.find(c => c.id === id)?.name || "Uncategorized";
  }

  const handleGenerateInsights = async () => {
    setIsLoading(true);
    setOpen(true);

    try {
      const expenses = transactions
        .filter((t) => t.type === "expense")
        .reduce((acc, t) => {
          const categoryName = getCategoryName(t.categoryId);
          const existing = acc.find((e) => e.category === categoryName);
          if (existing) {
            existing.amount += t.amount;
          } else {
            acc.push({ category: categoryName, amount: t.amount });
          }
          return acc;
        }, [] as { category: string; amount: number }[]);
      
      const budgetData = budgets.map(b => ({ category: getCategoryName(b.categoryId), limit: b.limit }));

      const result = await generateSpendingInsights({ income, expenses, budget: budgetData });
      setInsights(result.insights);
    } catch (error) {
      console.error("Failed to generate insights:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not generate insights. Please try again later.",
      });
      setOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button onClick={handleGenerateInsights} disabled={isLoading} variant="outline" className="w-full">
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Wand2 className="mr-2 h-4 w-4" />
        )}
        Generate AI Insights
      </Button>

      <Dialog open={open && !isLoading} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-headline">
              <Sparkles className="h-6 w-6 text-primary" />
              Your Financial Insights
            </DialogTitle>
            <DialogDescription>
              Here are some AI-powered recommendations based on your recent activity.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              {insights.map((insight, index) => (
                <li key={index}>{insight}</li>
              ))}
            </ul>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
