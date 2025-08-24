// src/components/dashboard/recurring-transactions-client.tsx
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
import type { Category, ScheduledTransaction } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { addDocument, updateDocument, deleteDocument } from "@/services/firestore";
import { AddScheduledTransactionDialog } from "./add-scheduled-transaction-dialog";

interface RecurringTransactionsClientProps {
  initialScheduledTransactions: ScheduledTransaction[];
  categories: Category[];
}

export function RecurringTransactionsClient({
  initialScheduledTransactions,
  categories,
}: RecurringTransactionsClientProps) {
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] =
    useState<ScheduledTransaction | null>(null);
  const { toast } = useToast();
  
  const transactionsPath = `users/${user?.uid}/scheduledTransactions`;

  const handleAddTransaction = () => {
    setTransactionToEdit(null);
    setIsDialogOpen(true);
  };

  const handleEditTransaction = (transaction: ScheduledTransaction) => {
    setTransactionToEdit(transaction);
    setIsDialogOpen(true);
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      await deleteDocument(transactionsPath, id);
      toast({ title: "Scheduled transaction deleted successfully." });
    } catch (error) {
      toast({ variant: "destructive", title: "Error deleting scheduled transaction." });
    }
  };

  const handleSubmit = async (values: Omit<ScheduledTransaction, "id">) => {
    try {
      if (transactionToEdit) {
        await updateDocument(transactionsPath, transactionToEdit.id, values);
        toast({ title: "Scheduled transaction updated successfully." });
      } else {
        await addDocument(transactionsPath, values);
        toast({ title: "Scheduled transaction added successfully." });
      }
      setIsDialogOpen(false);
    } catch (error) {
       toast({ variant: "destructive", title: "Error saving scheduled transaction." });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const capitalize = (s: string) => s && s[0].toUpperCase() + s.slice(1);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-headline">Recurring Transactions</h1>
          <p className="text-muted-foreground">
            Manage your scheduled income and expenses.
          </p>
        </div>
        <Button onClick={handleAddTransaction}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Recurring
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Frequency</TableHead>
              <TableHead>Next Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialScheduledTransactions.map((transaction) => {
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
                   <TableCell>{capitalize(transaction.frequency)}</TableCell>
                  <TableCell>
                    {/* Note: This should be calculated dynamically in a real scenario */}
                    {new Date(transaction.startDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell
                    className={`text-right font-medium ${
                      transaction.type === "income"
                        ? "text-accent"
                        : "text-destructive"
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
      <AddScheduledTransactionDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleSubmit}
        categories={categories}
        transactionToEdit={transactionToEdit}
      />
    </div>
  );
}
