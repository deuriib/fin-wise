// src/components/dashboard/add-credit-card-dialog.tsx
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
import type { BankAccount, CreditCard } from "@/lib/types";
import { useMemo } from "react";

interface AddCreditCardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: Omit<CreditCard, "id">) => void;
  cardToEdit?: CreditCard | null;
  accounts: BankAccount[];
}

export function AddCreditCardDialog({
  open,
  onOpenChange,
  onSubmit,
  cardToEdit,
  accounts,
}: AddCreditCardDialogProps) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const values = Object.fromEntries(formData.entries()) as any;
    
    if (values.name && values.last4 && values.expiryMonth && values.expiryYear && values.bank && values.statementDate && values.dueDate) {
      onSubmit({
        ...values,
        last4: values.last4.slice(-4),
        expiryMonth: parseInt(values.expiryMonth),
        expiryYear: parseInt(values.expiryYear),
        statementDate: parseInt(values.statementDate),
        dueDate: parseInt(values.dueDate),
      });
    }
  };

  const uniqueBanks = useMemo(() => {
    const bankNames = new Set(accounts.map(acc => acc.bankName));
    return Array.from(bankNames);
  }, [accounts]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="font-headline">
              {cardToEdit ? "Edit Credit Card" : "Add Credit Card"}
            </DialogTitle>
            <DialogDescription>
              Securely add a new credit card to track your spending.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Nickname</Label>
              <Input id="name" name="name" placeholder="e.g., Chase Sapphire" defaultValue={cardToEdit?.name} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bank" className="text-right">Bank</Label>
               <div className="col-span-3">
                <Select name="bank" defaultValue={cardToEdit?.bank}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a bank" />
                  </SelectTrigger>
                  <SelectContent>
                    {uniqueBanks.map((bank) => (
                      <SelectItem key={bank} value={bank}>
                        {bank}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="last4" className="text-right">Card Number</Label>
              <Input id="last4" name="last4" placeholder="Last 4 digits" defaultValue={cardToEdit?.last4} className="col-span-3" required minLength={4} maxLength={16} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Expiry</Label>
              <div className="col-span-3 grid grid-cols-2 gap-2">
                <Input name="expiryMonth" placeholder="MM" defaultValue={cardToEdit?.expiryMonth} required />
                <Input name="expiryYear" placeholder="YY" defaultValue={cardToEdit?.expiryYear} required />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Dates</Label>
              <div className="col-span-3 grid grid-cols-2 gap-2">
                 <Input name="statementDate" type="number" placeholder="Statement Day" title="Statement Closing Day" defaultValue={cardToEdit?.statementDate} required min={1} max={31} />
                 <Input name="dueDate" type="number" placeholder="Due Day" title="Payment Due Day" defaultValue={cardToEdit?.dueDate} required min={1} max={31} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">{cardToEdit ? "Save Changes" : "Add Card"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
