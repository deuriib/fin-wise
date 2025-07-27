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
import { MoreHorizontal, PlusCircle } from "lucide-react";
import type { Category, Transaction } from "@/lib/types";
import { AddTransactionDialog } from "./add-transaction-dialog";
import { useToast } from "@/hooks/use-toast";

interface TransactionsClientProps {
  initialTransactions: Transaction[];
  categories: Category[];
}

export function TransactionsClient({
  initialTransactions,
  categories,
}: TransactionsClientProps) {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] =
    useState<Transaction | null>(null);
  const { toast } = useToast();

  const handleAddTransaction = () => {
    setTransactionToEdit(null);
    setIsDialogOpen(true);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setTransactionToEdit(transaction);
    setIsDialogOpen(true);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id));
    toast({ title: "Transaction deleted successfully." });
  };

  const handleSubmit = (values: Omit<Transaction, "id">) => {
    if (transactionToEdit) {
      setTransactions(
        transactions.map((t) =>
          t.id === transactionToEdit.id
            ? { ...transactionToEdit, ...values }
            : t
        )
      );
      toast({ title: "Transaction updated successfully." });
    } else {
      setTransactions([
        { ...values, id: Date.now().toString() },
        ...transactions,
      ]);
      toast({ title: "Transaction added successfully." });
    }
    setIsDialogOpen(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

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
            {transactions.map((transaction) => {
              const category = categories.find(
                (c) => c.id === transaction.categoryId
              );
              return (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">
                    {transaction.description}
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
        transactionToEdit={transactionToEdit}
      />
    </div>
  );
}
