// src/components/dashboard/add-goal-dialog.tsx
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { BankAccount, Goal } from "@/lib/types";

interface AddGoalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: Omit<Goal, "id">) => void;
  accounts: BankAccount[];
  goalToEdit?: Goal | null;
}

export function AddGoalDialog({
  open,
  onOpenChange,
  onSubmit,
  accounts,
  goalToEdit,
}: AddGoalDialogProps) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const values = Object.fromEntries(formData.entries()) as any;
    
    if (values.name && values.targetAmount && values.targetDate) {
      onSubmit({
        ...values,
        targetAmount: parseFloat(values.targetAmount),
        savedAmount: parseFloat(values.savedAmount || '0'),
        targetDate: new Date(values.targetDate).toISOString(),
        accountId: values.accountId !== 'none' ? values.accountId : undefined,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit} key={goalToEdit?.id || 'new'}>
          <DialogHeader>
            <DialogTitle className="font-headline">
              {goalToEdit ? "Edit Goal" : "Create a New Goal"}
            </DialogTitle>
            <DialogDescription>
              Define your financial target and track your progress.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input id="name" name="name" placeholder="e.g., Vacation to Hawaii" defaultValue={goalToEdit?.name} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="targetAmount" className="text-right">Target Amount</Label>
              <Input id="targetAmount" name="targetAmount" type="number" step="0.01" placeholder="5000" defaultValue={goalToEdit?.targetAmount} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="savedAmount" className="text-right">Saved Amount</Label>
              <Input id="savedAmount" name="savedAmount" type="number" step="0.01" placeholder="0" defaultValue={goalToEdit?.savedAmount} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="targetDate" className="text-right">Target Date</Label>
              <Input id="targetDate" name="targetDate" type="date" defaultValue={goalToEdit ? goalToEdit.targetDate.split('T')[0] : ''} className="col-span-3" required />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="accountId" className="text-right">
                  Link Account
                </Label>
                <div className="col-span-3">
                  <Select name="accountId" defaultValue={goalToEdit?.accountId || 'none'}>
                    <SelectTrigger>
                      <SelectValue placeholder="(Optional)" />
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
             <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="description" className="text-right pt-2">Description</Label>
                <Textarea id="description" name="description" placeholder="Details about this goal..." defaultValue={goalToEdit?.description} className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">{goalToEdit ? "Save Changes" : "Create Goal"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
