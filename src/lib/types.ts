import type { LucideIcon } from 'lucide-react';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  categoryId: string;
  creditCardId?: string;
  accountId?: string;
}

export interface BankAccount {
  id: string;
  name: string;
  bankName: string;
  accountNumberLast4: string;
  type: 'checking' | 'savings';
}

export interface CreditCard {
    id: string;
    name: string;
    last4: string;
    expiryMonth: number;
    expiryYear: number;
    bank: string;
    statementDate: number; // Day of the month
    dueDate: number; // Day of the month
    creditLimit: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string; // Corresponds to keyof typeof import('lucide-react')
  color: string;
}

export interface Budget {
  id: string;
  categoryId: string;
  limit: number;
  spent: number;
  period: 'monthly' | 'yearly';
}

export interface ScheduledTransaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  categoryId: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: string;
  endDate?: string;
  lastProcessedDate?: string;
  accountId?: string;
}
