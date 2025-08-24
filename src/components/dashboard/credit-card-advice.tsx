// src/components/dashboard/credit-card-advice.tsx
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
import { getCreditCardPaymentAdvice } from "@/ai/flows/credit-card-payment-advice";
import type { CreditCard, Transaction } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

interface CreditCardAdviceProps {
  card: CreditCard;
  transactions: Transaction[];
}

export function CreditCardAdvice({ card, transactions }: CreditCardAdviceProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [advice, setAdvice] = useState("");
  const { toast } = useToast();

  const handleGenerateAdvice = async () => {
    setIsLoading(true);
    setOpen(true);

    try {
      const cardTransactions = transactions
        .filter((t) => t.creditCardId === card.id)
        .map(t => ({ description: t.description, amount: t.amount, date: new Date(t.date).toLocaleDateString() }));

      const statementBalance = cardTransactions.reduce((sum, t) => sum + t.amount, 0);
      
      const today = new Date();
      const dueDate = new Date(today.getFullYear(), today.getMonth(), card.dueDate);
      if (today.getDate() > card.dueDate) {
        dueDate.setMonth(dueDate.getMonth() + 1);
      }

      const result = await getCreditCardPaymentAdvice({ 
        cardName: card.name,
        statementBalance,
        dueDate: dueDate.toLocaleDateString(),
        transactions: cardTransactions
      });
      setAdvice(result.advice);

    } catch (error) {
      console.error("Failed to generate advice:", error);
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
        Get Payment Advice
      </Button>

      <Dialog open={open && !isLoading} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-headline">
              <Sparkles className="h-6 w-6 text-primary" />
              Payment Strategy for {card.name}
            </DialogTitle>
            <DialogDescription>
              AI-powered recommendations for your upcoming payment.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{advice}</p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
