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
import type { Budget, Category } from "@/lib/types";

interface AddBudgetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: Omit<Budget, "id" | "spent">) => void;
  categories: Category[];
  budgetToEdit?: Budget | null;
}

export function AddBudgetDialog({
  open,
  onOpenChange,
  onSubmit,
  categories,
  budgetToEdit,
}: AddBudgetDialogProps) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const values = Object.fromEntries(formData.entries()) as {
      categoryId: string;
      limit: string;
      period: "monthly" | "yearly";
    };
    
    if (values.categoryId && values.limit && values.period) {
      onSubmit({
        ...values,
        limit: parseFloat(values.limit),
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="font-headline">
              {budgetToEdit ? "Edit Budget" : "Create Budget"}
            </DialogTitle>
            <DialogDescription>
              Set a spending limit for a category to stay on track.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="categoryId" className="text-right">
                Category
              </Label>
              <div className="col-span-3">
                <Select name="categoryId" defaultValue={budgetToEdit?.categoryId}>
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
              <Label htmlFor="limit" className="text-right">
                Limit
              </Label>
              <Input
                id="limit"
                name="limit"
                type="number"
                step="0.01"
                placeholder="e.g., 500"
                defaultValue={budgetToEdit?.limit}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="period" className="text-right">
                Period
              </Label>
               <div className="col-span-3">
                <Select name="period" defaultValue={budgetToEdit?.period || 'monthly'}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">{budgetToEdit ? "Save Changes" : "Create Budget"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
