// src/components/dashboard/goal-advice.tsx
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
import { getGoalAchievementAdvice } from "@/ai/flows/goal-achievement-advice";
import type { Goal } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

interface GoalAdviceProps {
  goal: Goal;
}

export function GoalAdvice({ goal }: GoalAdviceProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [advice, setAdvice] = useState("");
  const { toast } = useToast();

  const handleGenerateAdvice = async () => {
    setIsLoading(true);
    setOpen(true);

    try {
      const result = await getGoalAchievementAdvice({
        goalName: goal.name,
        targetAmount: goal.targetAmount,
        savedAmount: goal.savedAmount,
        targetDate: new Date(goal.targetDate).toLocaleDateString(),
        // Mocking income/expenses for now, a real app would get this from user data
        monthlyIncome: 5000, 
        monthlyExpenses: 3500,
      });
      setAdvice(result.advice);
    } catch (error) {
      console.error("Failed to generate goal advice:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not generate advice. Please try again later.",
      });
      setOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button onClick={handleGenerateAdvice} disabled={isLoading} variant="outline" size="sm" className="w-full">
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Wand2 className="mr-2 h-4 w-4" />
        )}
        Get Goal Advice
      </Button>

      <Dialog open={open && !isLoading} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-headline">
              <Sparkles className="h-6 w-6 text-primary" />
              Your Plan for: {goal.name}
            </DialogTitle>
            <DialogDescription>
              AI-powered recommendations to help you reach your goal.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{advice}</p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
