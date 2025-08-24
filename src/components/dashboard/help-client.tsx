// src/components/dashboard/help-client.tsx
"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function HelpClient() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Help & Support</h1>
        <p className="text-muted-foreground">
          Find answers to common questions about using FinWise.
        </p>
      </div>

      <Card>
        <CardHeader>
            <CardTitle className="font-headline">Frequently Asked Questions</CardTitle>
            <CardDescription>Click on a topic to learn more.</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Dashboard</AccordionTrigger>
              <AccordionContent>
                The Dashboard provides a high-level overview of your finances. It includes summaries of your total income, expenses, and net savings for the current month. You can also see a breakdown of your spending by category, your budget progress, and your most recent transactions.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Accounts</AccordionTrigger>
              <AccordionContent>
                The Accounts page is where you can manage your bank accounts. Add your checking and savings accounts to track their balances directly within the app. Click on an account to see a detailed view with transaction history and analytics specific to that account.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Transactions</AccordionTrigger>
              <AccordionContent>
                Log all your income and expenses on the Transactions page. You can add new transactions, edit existing ones, or delete them. Each transaction can be assigned a category, a date, and linked to a specific bank account or credit card.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>Recurring Transactions</AccordionTrigger>
              <AccordionContent>
                Set up automatic transactions for your regular bills and income on the Recurring page. You can define the amount, frequency (daily, weekly, monthly, yearly), and start/end dates. This helps automate your financial tracking and saves you time.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger>Budgets</AccordionTrigger>
              <AccordionContent>
                Create and manage your spending budgets on the Budgets page. Set a limit for any category (e.g., $500 for groceries) for a specific period (monthly or yearly). The app will track your spending against these budgets to help you stay on target.
              </AccordionContent>
            </AccordionItem>
             <AccordionItem value="item-6">
              <AccordionTrigger>Credit Cards</AccordionTrigger>
              <AccordionContent>
                Add your credit cards to track spending and get AI-powered advice. You can link expense transactions to your cards and use the "Get Payment Advice" feature to receive personalized recommendations on how to manage your payments to save on interest and improve your financial health.
              </AccordionContent>
            </AccordionItem>
             <AccordionItem value="item-7">
              <AccordionTrigger>Reports</AccordionTrigger>
              <AccordionContent>
                The Reports page provides visual insights into your financial data. You can see charts comparing your income vs. expenses over time and a detailed bar chart showing your spending distribution across different categories. You can also download these reports as a PDF.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-8">
              <AccordionTrigger>AI Tools (Wellness Score & Insights)</AccordionTrigger>
              <AccordionContent>
                FinWise includes powerful AI tools to help you. The "My Wellness Score" generates a score from 0-100 indicating your financial health and provides actionable recommendations. The "Generate AI Insights" feature analyzes your spending patterns and offers personalized tips to improve your finances.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
