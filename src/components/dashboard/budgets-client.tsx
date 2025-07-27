"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Budget, Category, Transaction } from "@/lib/types";
import { AddBudgetDialog } from "./add-budget-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { PlusCircle, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface BudgetsClientProps {
  initialBudgets: Budget[];
  categories: Category[];
  transactions: Transaction[];
}

export function BudgetsClient({
  initialBudgets,
  categories,
  transactions,
}: BudgetsClientProps) {
  const [budgets, setBudgets] = useState<Budget[]>(
    initialBudgets.map(budget => {
      const spent = transactions
        .filter(t => t.type === 'expense' && t.categoryId === budget.categoryId)
        .reduce((sum, t) => sum + t.amount, 0);
      return { ...budget, spent };
    })
  );

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [budgetToEdit, setBudgetToEdit] = useState<Budget | null>(null);

  const handleAddBudget = () => {
    setBudgetToEdit(null);
    setIsDialogOpen(true);
  };

  const handleEditBudget = (budget: Budget) => {
    setBudgetToEdit(budget);
    setIsDialogOpen(true);
  };

  const handleDeleteBudget = (id: string) => {
    setBudgets(budgets.filter(b => b.id !== id));
  };

  const handleSubmit = (values: Omit<Budget, "id" | "spent">) => {
    if (budgetToEdit) {
      setBudgets(
        budgets.map((b) =>
          b.id === budgetToEdit.id ? { ...b, ...values } : b
        )
      );
    } else {
      setBudgets([...budgets, { ...values, id: Date.now().toString(), spent: 0 }]);
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
          <h1 className="text-3xl font-bold font-headline">Budgets</h1>
          <p className="text-muted-foreground">
            Manage your spending limits for various categories.
          </p>
        </div>
        <Button onClick={handleAddBudget}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Budget
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {budgets.map((budget) => {
          const category = categories.find((c) => c.id === budget.categoryId);
          const progress = (budget.spent / budget.limit) * 100;
          return (
            <Card key={budget.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium font-headline">
                  {category?.name || "Uncategorized"}
                </CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEditBudget(budget)}>Edit</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDeleteBudget(budget.id)} className="text-destructive">Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(budget.spent)}
                </div>
                <p className="text-xs text-muted-foreground">
                  of {formatCurrency(budget.limit)}
                </p>
                <Progress value={progress} className="mt-4" />
                <div className="text-xs text-muted-foreground mt-1 text-right">{Math.round(progress)}%</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <AddBudgetDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleSubmit}
        categories={categories}
        budgetToEdit={budgetToEdit}
      />
    </div>
  );
}
