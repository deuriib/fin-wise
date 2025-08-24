// src/components/dashboard/credit-cards-client.tsx
"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import type { BankAccount, CreditCard, Transaction } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { PlusCircle, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { addDocument, updateDocument, deleteDocument } from "@/services/firestore";
import { useToast } from "@/hooks/use-toast";
import { AddCreditCardDialog } from "./add-credit-card-dialog";
import { CreditCardAdvice } from "./credit-card-advice";
import { Progress } from "../ui/progress";

interface CreditCardsClientProps {
  initialCreditCards: CreditCard[];
  transactions: Transaction[];
  accounts: BankAccount[];
}

export function CreditCardsClient({
  initialCreditCards,
  transactions,
  accounts,
}: CreditCardsClientProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const cardsPath = `users/${user?.uid}/creditCards`;

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [cardToEdit, setCardToEdit] = useState<CreditCard | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const cardsWithBalance = useMemo(() => {
    return initialCreditCards.map(card => {
        const balance = transactions
            .filter(t => t.creditCardId === card.id && t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
        const availableCredit = card.creditLimit - balance;
        return { ...card, balance, availableCredit };
    });
  }, [initialCreditCards, transactions]);

  const handleAddCard = () => {
    setCardToEdit(null);
    setIsDialogOpen(true);
  };

  const handleEditCard = (card: CreditCard) => {
    setCardToEdit(card);
    setIsDialogOpen(true);
  };

  const handleDeleteCard = async (id: string) => {
    try {
      await deleteDocument(cardsPath, id);
      toast({ title: "Credit card deleted successfully." });
    } catch (error) {
      toast({ variant: "destructive", title: "Error deleting credit card." });
    }
  };

  const handleSubmit = async (values: Omit<CreditCard, "id">) => {
    try {
      if (cardToEdit) {
        await updateDocument(cardsPath, cardToEdit.id, values);
        toast({ title: "Credit card updated successfully." });
      } else {
        await addDocument(cardsPath, values);
        toast({ title: "Credit card added successfully." });
      }
      setIsDialogOpen(false);
    } catch (error) {
      toast({ variant: "destructive", title: "Error saving credit card." });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-headline">Credit Cards</h1>
          <p className="text-muted-foreground">
            Manage your credit cards and track spending.
          </p>
        </div>
        <Button onClick={handleAddCard}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Credit Card
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cardsWithBalance.map((card) => {
            const utilization = card.creditLimit > 0 ? (card.balance / card.creditLimit) * 100 : 0;
            return (
              <Card key={card.id}>
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                  <div>
                    <CardTitle className="text-lg font-medium font-headline">
                      {card.name}
                    </CardTitle>
                    <CardDescription>{card.bank}</CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditCard(card)}>Edit</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteCard(card.id)} className="text-destructive">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm font-mono tracking-wider">
                    **** **** **** {card.last4}
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm font-medium">
                        <span>Balance</span>
                        <span>{formatCurrency(card.balance)}</span>
                    </div>
                     <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Available Credit</span>
                        <span>{formatCurrency(card.availableCredit)}</span>
                    </div>
                     <Progress value={utilization} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Limit: {formatCurrency(card.creditLimit)}</span>
                        <span>Utilization: {utilization.toFixed(1)}%</span>
                    </div>
                  </div>
                  <CreditCardAdvice card={card} transactions={transactions} />
                </CardContent>
              </Card>
            )
        })}
      </div>

      <AddCreditCardDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleSubmit}
        cardToEdit={cardToEdit}
        accounts={accounts}
      />
    </div>
  );
}
