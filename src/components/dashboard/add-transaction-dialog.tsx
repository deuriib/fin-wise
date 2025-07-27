"use client";

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
import type { Category, Transaction } from "@/lib/types";

interface AddTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: Omit<Transaction, "id">) => void;
  categories: Category[];
  transactionToEdit?: Transaction | null;
}

export function AddTransactionDialog({
  open,
  onOpenChange,
  onSubmit,
  categories,
  transactionToEdit,
}: AddTransactionDialogProps) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const values = Object.fromEntries(formData.entries()) as any;

    if (values.amount && values.categoryId && values.date && values.type) {
        onSubmit({
            ...values,
            amount: parseFloat(values.amount),
            date: new Date(values.date).toISOString(),
        })
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="font-headline">
              {transactionToEdit ? "Edit Transaction" : "Add Transaction"}
            </DialogTitle>
            <DialogDescription>
              {transactionToEdit
                ? "Update the details of your transaction."
                : "Log a new income or expense to keep your finances up to date."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <div className="col-span-3">
                <Select name="type" defaultValue={transactionToEdit?.type || 'expense'}>
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
              <Label htmlFor="date" className="text-right">
                Date
              </Label>
              <Input
                id="date"
                name="date"
                type="date"
                defaultValue={transactionToEdit ? transactionToEdit.date.split('T')[0] : new Date().toISOString().split('T')[0]}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                name="description"
                placeholder="e.g., Groceries"
                defaultValue={transactionToEdit?.description}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">{transactionToEdit ? "Save Changes" : "Add Transaction"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
