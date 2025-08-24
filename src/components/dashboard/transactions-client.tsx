// src/components/dashboard/transactions-client.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, PlusCircle, CreditCard as CreditCardIcon, Landmark } from "lucide-react";
import type { Category, Transaction, CreditCard, BankAccount } from "@/lib/types";
import { AddTransactionDialog } from "./add-transaction-dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { addDocument, updateDocument, deleteDocument } from "@/services/firestore";

interface TransactionsClientProps {
  initialTransactions: Transaction[];
  categories: Category[];
  creditCards: CreditCard[];
  accounts: BankAccount[];
}

export function TransactionsClient({
  initialTransactions,
  categories,
  creditCards,
  accounts
}: TransactionsClientProps) {
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] =
    useState<Transaction | null>(null);
  const { toast } = useToast();
  
  const transactionsPath = `users/${user?.uid}/transactions`;

  const handleAddTransaction = () => {
    setTransactionToEdit(null);
    setIsDialogOpen(true);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setTransactionToEdit(transaction);
    setIsDialogOpen(true);
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      await deleteDocument(transactionsPath, id);
      toast({ title: "Transaction deleted successfully." });
    } catch (error) {
      toast({ variant: "destructive", title: "Error deleting transaction." });
    }
  };

  const handleSubmit = async (values: Omit<Transaction, "id">) => {
    try {
      if (transactionToEdit) {
        await updateDocument(transactionsPath, transactionToEdit.id, values);
        toast({ title: "Transaction updated successfully." });
      } else {
        await addDocument(transactionsPath, values);
        toast({ title: "Transaction added successfully." });
      }
      setIsDialogOpen(false);
    } catch (error) {
       toast({ variant: "destructive", title: "Error saving transaction." });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };
  
  const getCardName = (cardId?: string) => {
      if (!cardId) return null;
      const card = creditCards.find(c => c.id === cardId);
      return card ? card.name : null;
  }

  const getAccountName = (accountId?: string) => {
      if (!accountId) return null;
      const account = accounts.find(a => a.id === accountId);
      return account ? account.name : null;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-headline">Transactions</h1>
          <p className="text-muted-foreground">
            View and manage all your income and expenses.
          </p>
        </div>
        <Button onClick={handleAddTransaction}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Transaction
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialTransactions.map((transaction) => {
              const category = categories.find(
                (c) => c.id === transaction.categoryId
              );
              const cardName = getCardName(transaction.creditCardId);
              const accountName = getAccountName(transaction.accountId);
              return (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span>{transaction.description}</span>
                      <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                        {accountName && <div className="flex items-center gap-1"><Landmark className="h-3 w-3" /> {accountName}</div>}
                        {cardName && <div className="flex items-center gap-1"><CreditCardIcon className="h-3 w-3" /> {cardName}</div>}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{category?.name}</Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(transaction.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        transaction.type === "income" ? "default" : "secondary"
                      }
                      className={transaction.type === 'income' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : ''}
                    >
                      {transaction.type}
                    </Badge>
                  </TableCell>
                  <TableCell
                    className={`text-right font-medium ${
                      transaction.type === "income"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                     {transaction.type === 'expense' ? '-' : ''}{formatCurrency(transaction.amount)}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleEditTransaction(transaction)}
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteTransaction(transaction.id)}
                          className="text-destructive"
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <AddTransactionDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleSubmit}
        categories={categories}
        creditCards={creditCards}
        accounts={accounts}
        transactionToEdit={transactionToEdit}
      />
    </div>
  );
}
