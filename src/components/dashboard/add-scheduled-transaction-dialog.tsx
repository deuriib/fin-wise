// src/components/dashboard/add-scheduled-transaction-dialog.tsx
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { BankAccount, Category, CreditCard, ScheduledTransaction } from "@/lib/types";

interface AddScheduledTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: Omit<ScheduledTransaction, "id">) => void;
  categories: Category[];
  accounts: BankAccount[];
  creditCards: CreditCard[];
  transactionToEdit?: ScheduledTransaction | null;
}

export function AddScheduledTransactionDialog({
  open,
  onOpenChange,
  onSubmit,
  categories,
  accounts,
  creditCards,
  transactionToEdit,
}: AddScheduledTransactionDialogProps) {
  const [transactionType, setTransactionType] = useState(transactionToEdit?.type || 'expense');
  
  useEffect(() => {
    setTransactionType(transactionToEdit?.type || 'expense');
  }, [transactionToEdit]);
  
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const values = Object.fromEntries(formData.entries()) as any;
    
    if (values.amount && values.categoryId && values.startDate && values.type && values.frequency) {
        onSubmit({
            ...values,
            amount: parseFloat(values.amount),
            startDate: new Date(values.startDate).toISOString(),
            endDate: values.endDate ? new Date(values.endDate).toISOString() : undefined,
            creditCardId: values.type === 'expense' && values.creditCardId !== 'none' ? values.creditCardId : undefined,
            accountId: values.accountId !== 'none' ? values.accountId : undefined,
        })
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="font-headline">
              {transactionToEdit ? "Edit Recurring" : "Add Recurring"}
            </DialogTitle>
            <DialogDescription>
              Schedule a recurring income or expense.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                name="description"
                placeholder="e.g., Monthly Salary"
                defaultValue={transactionToEdit?.description}
                className="col-span-3"
                required
              />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Amount
              </Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                defaultValue={transactionToEdit?.amount}
                className="col-span-3"
                required
              />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <div className="col-span-3">
                <Select name="type" value={transactionType} onValueChange={setTransactionType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="expense">Expense</SelectItem>
                    <SelectItem value="income">Income</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="categoryId" className="text-right">
                Category
              </Label>
              <div className="col-span-3">
                <Select name="categoryId" defaultValue={transactionToEdit?.categoryId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="accountId" className="text-right">
                  Account
                </Label>
                <div className="col-span-3">
                  <Select name="accountId" defaultValue={transactionToEdit?.accountId || 'none'}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an account" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {accounts.map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
            </div>
            {transactionType === 'expense' && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="creditCardId" className="text-right">
                  Credit Card
                </Label>
                <div className="col-span-3">
                  <Select name="creditCardId" defaultValue={transactionToEdit?.creditCardId || 'none'}>
                    <SelectTrigger>
                      <SelectValue placeholder="(Optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {creditCards.map((card) => (
                        <SelectItem key={card.id} value={card.id}>
                          {card.name} (**** {card.last4})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="frequency" className="text-right">
                Frequency
              </Label>
              <div className="col-span-3">
                <Select name="frequency" defaultValue={transactionToEdit?.frequency || 'monthly'}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startDate" className="text-right">
                Start Date
              </Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                defaultValue={transactionToEdit ? transactionToEdit.startDate.split('T')[0] : new Date().toISOString().split('T')[0]}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endDate" className="text-right">
                End Date
              </Label>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                defaultValue={transactionToEdit?.endDate ? transactionToEdit.endDate.split('T')[0] : ''}
                className="col-span-3"
              />
            </div>
           
          </div>
          <DialogFooter>
            <Button type="submit">{transactionToEdit ? "Save Changes" : "Add Recurring"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
