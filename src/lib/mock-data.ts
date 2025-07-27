import type { Transaction, Category, Budget } from './types';

export const categories: Category[] = [
  { id: 'cat-1', name: 'Groceries', icon: 'ShoppingCart', color: '#FF6384' },
  { id: 'cat-2', name: 'Transport', icon: 'Car', color: '#36A2EB' },
  { id: 'cat-3', name: 'Housing', icon: 'Home', color: '#FFCE56' },
  { id: 'cat-4', name: 'Entertainment', icon: 'Film', color: '#4BC0C0' },
  { id: 'cat-5', name: 'Health', icon: 'HeartPulse', color: '#9966FF' },
  { id: 'cat-6', name: 'Salary', icon: 'Landmark', color: '#32CD32' },
  { id: 'cat-7', name: 'Utilities', icon: 'Lightbulb', color: '#FF9F40' },
  { id: 'cat-8', name: 'Dining Out', icon: 'Utensils', color: '#C9CBCF' },
];

export const transactions: Transaction[] = [
  { id: 't-1', date: new Date(2024, 4, 1).toISOString(), description: 'Monthly Salary', amount: 5000, type: 'income', categoryId: 'cat-6' },
  { id: 't-2', date: new Date(2024, 4, 2).toISOString(), description: 'Rent Payment', amount: 1500, type: 'expense', categoryId: 'cat-3' },
  { id: 't-3', date: new Date(2024, 4, 3).toISOString(), description: 'Weekly Groceries', amount: 120.50, type: 'expense', categoryId: 'cat-1' },
  { id: 't-4', date: new Date(2024, 4, 5).toISOString(), description: 'Gasoline', amount: 45.00, type: 'expense', categoryId: 'cat-2' },
  { id: 't-5', date: new Date(2024, 4, 7).toISOString(), description: 'Movie Tickets', amount: 30.00, type: 'expense', categoryId: 'cat-4' },
  { id: 't-6', date: new Date(2024, 4, 9).toISOString(), description: 'Electricity Bill', amount: 75.80, type: 'expense', categoryId: 'cat-7' },
  { id: 't-7', date: new Date(2024, 4, 10).toISOString(), description: 'Dinner with friends', amount: 85.25, type: 'expense', categoryId: 'cat-8' },
  { id: 't-8', date: new Date(2024, 4, 12).toISOString(), description: 'Pharmacy', amount: 25.00, type: 'expense', categoryId: 'cat-5' },
  { id: 't-9', date: new Date(2024, 4, 15).toISOString(), description: 'Public Transport Pass', amount: 60.00, type: 'expense', categoryId: 'cat-2' },
  { id: 't-10', date: new Date(2024, 4, 18).toISOString(), description: 'Groceries', amount: 95.70, type: 'expense', categoryId: 'cat-1' },
  { id: 't-11', date: new Date(2024, 4, 22).toISOString(), description: 'Concert Tickets', amount: 150.00, type: 'expense', categoryId: 'cat-4' },
  { id: 't-12', date: new Date(2024, 4, 25).toISOString(), description: 'Internet Bill', amount: 50.00, type: 'expense', categoryId: 'cat-7' },
  { id: 't-13', date: new Date(2024, 4, 28).toISOString(), description: 'Lunch meeting', amount: 40.00, type: 'expense', categoryId: 'cat-8' },
];

export const budgets: Budget[] = [
  { id: 'b-1', categoryId: 'cat-1', limit: 400, spent: 216.20, period: 'monthly' },
  { id: 'b-2', categoryId: 'cat-2', limit: 150, spent: 105.00, period: 'monthly' },
  { id: 'b-3', categoryId: 'cat-4', limit: 200, spent: 180.00, period: 'monthly' },
  { id: 'b-4', categoryId: 'cat-8', limit: 150, spent: 125.25, period: 'monthly' },
];
