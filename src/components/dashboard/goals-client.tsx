// src/components/dashboard/goals-client.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Goal, BankAccount } from "@/lib/types";
import { AddGoalDialog } from "./add-goal-dialog";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { PlusCircle, MoreVertical, Target } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { addDocument, updateDocument, deleteDocument } from "@/services/firestore";
import { useToast } from "@/hooks/use-toast";
import { GoalAdvice } from "./goal-advice";

interface GoalsClientProps {
  initialGoals: Goal[];
  accounts: BankAccount[];
}

export function GoalsClient({
  initialGoals,
  accounts
}: GoalsClientProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const goalsPath = `users/${user?.uid}/goals`;

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [goalToEdit, setGoalToEdit] = useState<Goal | null>(null);

  const handleAddGoal = () => {
    setGoalToEdit(null);
    setIsDialogOpen(true);
  };

  const handleEditGoal = (goal: Goal) => {
    setGoalToEdit(goal);
    setIsDialogOpen(true);
  };

  const handleDeleteGoal = async (id: string) => {
    try {
      await deleteDocument(goalsPath, id);
      toast({ title: "Goal deleted successfully." });
    } catch (error) {
      toast({ variant: "destructive", title: "Error deleting goal." });
    }
  };

  const handleSubmit = async (values: Omit<Goal, "id">) => {
    try {
      if (goalToEdit) {
        await updateDocument(goalsPath, goalToEdit.id, values);
        toast({ title: "Goal updated successfully." });
      } else {
        await addDocument(goalsPath, values);
        toast({ title: "Goal added successfully." });
      }
      setIsDialogOpen(false);
    } catch (error) {
      toast({ variant: "destructive", title: "Error saving goal." });
    }
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
          <h1 className="text-3xl font-bold font-headline">Financial Goals</h1>
          <p className="text-muted-foreground">
            Set and track your financial goals to stay motivated.
          </p>
        </div>
        <Button onClick={handleAddGoal}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Goal
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {initialGoals.map((goal) => {
          const progress = (goal.savedAmount / goal.targetAmount) * 100;
          return (
            <Card key={goal.id} className="flex flex-col">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div>
                  <CardTitle className="text-lg font-medium font-headline">
                    {goal.name}
                  </CardTitle>
                   <CardDescription>
                      Target: {new Date(goal.targetDate).toLocaleDateString()}
                    </CardDescription>
                </div>
                 <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEditGoal(goal)}>Edit</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDeleteGoal(goal.id)} className="text-destructive">Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                 <div className="flex items-baseline gap-2">
                    <div className="text-2xl font-bold">
                        {formatCurrency(goal.savedAmount)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                        of {formatCurrency(goal.targetAmount)}
                    </p>
                 </div>
                <Progress value={progress} />
                <div className="text-xs text-muted-foreground mt-1 flex justify-between">
                    <span>{goal.description}</span>
                    <span>{Math.round(progress)}%</span>
                </div>
              </CardContent>
              <CardFooter>
                 <GoalAdvice goal={goal} />
              </CardFooter>
            </Card>
          );
        })}
         {initialGoals.length === 0 && (
          <div className="col-span-full text-center py-12">
            <Target className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No Goals Yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Create your first financial goal to start tracking.
            </p>
          </div>
        )}
      </div>

      <AddGoalDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleSubmit}
        accounts={accounts}
        goalToEdit={goalToEdit}
      />
    </div>
  );
}
