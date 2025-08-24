"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Target, Loader2, Sparkles } from "lucide-react";
import { getFinancialWellnessRecommendations } from "@/ai/flows/financial-wellness-recommendations";
import type { Category, Transaction, BankAccount, CreditCard } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

interface WellnessScoreProps {
  transactions: Transaction[];
  income: number;
  categories: Category[];
  accounts: BankAccount[];
  creditCards: CreditCard[];
}

export function WellnessScore({ transactions, income, categories, accounts, creditCards }: WellnessScoreProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [recommendations, setRecommendations] = useState<string>("");
  const { toast } = useToast();

  const getCategoryName = (id: string) => {
    return categories.find(c => c.id === id)?.name || "Uncategorized";
  }

  const accountsWithBalance = useMemo(() => {
    return accounts.map(account => {
        const balance = transactions.reduce((acc, t) => {
            if (t.accountId !== account.id) return acc;
            if (t.type === 'income') return acc + t.amount;
            if (t.type === 'expense') return acc - t.amount;
            return acc;
        }, 0);
        return { name: account.name, type: account.type, balance };
    })
  }, [accounts, transactions]);

  const creditCardsWithBalance = useMemo(() => {
      return creditCards.map(card => {
          const balance = transactions
              .filter(t => t.creditCardId === card.id && t.type === 'expense')
              .reduce((sum, t) => sum + t.amount, 0);
          return { name: card.name, balance };
      });
  }, [creditCards, transactions]);

  const handleGenerate = async () => {
    setIsLoading(true);
    setOpen(true);
    try {
      const spendingData = transactions
        .filter((t) => t.type === "expense")
        .map((t) => `${getCategoryName(t.categoryId)}: $${t.amount}`)
        .join(", ");

      const result = await getFinancialWellnessRecommendations({
        spendingData,
        income,
        savings: 5000, // Mock data
        financialGoals: "Save for a vacation and pay off credit card debt.", // Mock data
        accounts: accountsWithBalance,
        creditCards: creditCardsWithBalance,
      });
      setScore(result.wellnessScore);
      setRecommendations(result.recommendations);
    } catch (error) {
      console.error("Failed to get wellness score:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not get wellness score. Please try again later.",
      });
      setOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button onClick={handleGenerate} disabled={isLoading} className="w-full">
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Target className="mr-2 h-4 w-4" />
        )}
        My Wellness Score
      </Button>

      <Dialog open={open && !isLoading} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-headline">
              <Sparkles className="h-6 w-6 text-primary" />
              Financial Wellness Score
            </DialogTitle>
            <DialogDescription>
              Your personalized score and recommendations to improve your financial health.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex flex-col items-center justify-center gap-4">
            {score !== null && (
              <div className="relative h-32 w-32">
                <svg className="h-full w-full" viewBox="0 0 100 100">
                  <circle
                    className="stroke-current text-gray-200 dark:text-gray-700"
                    strokeWidth="10"
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                  ></circle>
                  <circle
                    className="progress-ring__circle stroke-current text-accent"
                    strokeWidth="10"
                    strokeLinecap="round"
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - score / 100)}`}
                    transform="rotate(-90 50 50)"
                  ></circle>
                  <text
                    x="50"
                    y="50"
                    className="font-bold text-2xl fill-current text-foreground"
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    {score}
                  </text>
                </svg>
              </div>
            )}
            <div className="text-sm text-muted-foreground whitespace-pre-wrap">
              {recommendations}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
