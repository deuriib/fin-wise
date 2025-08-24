// src/components/dashboard/accounts-client.tsx
"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import type { BankAccount, Transaction } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { PlusCircle, MoreVertical, Landmark } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { addDocument, updateDocument, deleteDocument } from "@/services/firestore";
import { useToast } from "@/hooks/use-toast";
import { AddAccountDialog } from "./add-account-dialog";

interface AccountsClientProps {
  initialAccounts: BankAccount[];
  transactions: Transaction[];
}

export function AccountsClient({
  initialAccounts,
  transactions
}: AccountsClientProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const accountsPath = `users/${user?.uid}/accounts`;

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [accountToEdit, setAccountToEdit] = useState<BankAccount | null>(null);

  const handleAddAccount = () => {
    setAccountToEdit(null);
    setIsDialogOpen(true);
  };

  const handleEditAccount = (account: BankAccount) => {
    setAccountToEdit(account);
    setIsDialogOpen(true);
  };

  const handleDeleteAccount = async (id: string) => {
    try {
      await deleteDocument(accountsPath, id);
      toast({ title: "Account deleted successfully." });
    } catch (error) {
      toast({ variant: "destructive", title: "Error deleting account." });
    }
  };

  const handleSubmit = async (values: Omit<BankAccount, "id">) => {
    try {
      if (accountToEdit) {
        await updateDocument(accountsPath, accountToEdit.id, values);
        toast({ title: "Account updated successfully." });
      } else {
        await addDocument(accountsPath, values);
        toast({ title: "Account added successfully." });
      }
      setIsDialogOpen(false);
    } catch (error) {
      toast({ variant: "destructive", title: "Error saving account." });
    }
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const accountsWithBalance = useMemo(() => {
    return initialAccounts.map(account => {
        const balance = transactions.reduce((acc, t) => {
            if (t.accountId !== account.id) return acc;
            if (t.type === 'income') return acc + t.amount;
            if (t.type === 'expense') return acc - t.amount;
            return acc;
        }, 0);
        return { ...account, balance };
    })
  }, [initialAccounts, transactions]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-headline">Bank Accounts</h1>
          <p className="text-muted-foreground">
            Manage your connected bank accounts.
          </p>
        </div>
        <Button onClick={handleAddAccount}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Account
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {accountsWithBalance.map((account) => (
          <Card key={account.id}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-lg font-medium font-headline">
                  {account.name}
                </CardTitle>
                <CardDescription>{account.bankName}</CardDescription>
              </div>
               <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleEditAccount(account)}>Edit</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDeleteAccount(account.id)} className="text-destructive">Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(account.balance)}</div>
              <p className="text-xs text-muted-foreground">
                {account.type.charAt(0).toUpperCase() + account.type.slice(1)} Account (...{account.accountNumberLast4})
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <AddAccountDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleSubmit}
        accountToEdit={accountToEdit}
      />
    </div>
  );
}
