// src/components/dashboard/add-account-dialog.tsx
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
import type { BankAccount } from "@/lib/types";

interface AddAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: Omit<BankAccount, "id">) => void;
  accountToEdit?: BankAccount | null;
}

export function AddAccountDialog({
  open,
  onOpenChange,
  onSubmit,
  accountToEdit,
}: AddAccountDialogProps) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const values = Object.fromEntries(formData.entries()) as any;
    
    if (values.name && values.bankName && values.accountNumberLast4 && values.type) {
      onSubmit({
        ...values,
        accountNumberLast4: values.accountNumberLast4.slice(-4),
        initialBalance: values.initialBalance ? parseFloat(values.initialBalance) : 0,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="font-headline">
              {accountToEdit ? "Edit Account" : "Add Bank Account"}
            </DialogTitle>
            <DialogDescription>
              Add a new bank account to track your balances.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Nickname</Label>
              <Input id="name" name="name" placeholder="e.g., Primary Checking" defaultValue={accountToEdit?.name} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bankName" className="text-right">Bank</Label>
              <Input id="bankName" name="bankName" placeholder="e.g., Bank of America" defaultValue={accountToEdit?.bankName} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="accountNumberLast4" className="text-right">Account No.</Label>
              <Input id="accountNumberLast4" name="accountNumberLast4" placeholder="Last 4 digits" defaultValue={accountToEdit?.accountNumberLast4} className="col-span-3" required minLength={4} maxLength={16} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
               <div className="col-span-3">
                <Select name="type" defaultValue={accountToEdit?.type || 'checking'}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select account type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="checking">Checking</SelectItem>
                    <SelectItem value="savings">Savings</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="initialBalance" className="text-right">Initial Balance</Label>
              <Input id="initialBalance" name="initialBalance" type="number" step="0.01" placeholder="0.00" defaultValue={accountToEdit?.initialBalance} className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">{accountToEdit ? "Save Changes" : "Add Account"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
