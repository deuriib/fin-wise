// src/ai/flows/generate-spending-insights.ts
'use server';

/**
 * @fileOverview AI-powered insights into the user's spending patterns.
 *
 * - generateSpendingInsights - A function that generates insights based on the user's financial data.
 * - GenerateSpendingInsightsInput - The input type for the generateSpendingInsights function.
 * - GenerateSpendingInsightsOutput - The return type for the generateSpendingInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSpendingInsightsInputSchema = z.object({
  income: z.number().describe("The user's total income for the period."),
  expenses: z.array(z.object({
    category: z.string().describe('The category of the expense.'),
    amount: z.number().describe('The amount spent in the category.'),
  })).describe("A list of the user's expenses, with category and amount."),
  budget: z.array(z.object({
    category: z.string().describe('The category of the budget.'),
    limit: z.number().describe('The spending limit for the category.'),
  })).describe("A list of the user's budgets, with category and limit."),
  accounts: z.array(z.object({
    name: z.string(),
    type: z.string(),
    balance: z.number(),
  })).optional().describe("A list of the user's bank accounts and their balances."),
  creditCards: z.array(z.object({
    name: z.string(),
    balance: z.number(),
  })).optional().describe("A list of the user's credit cards and their current balances."),
});
export type GenerateSpendingInsightsInput = z.infer<typeof GenerateSpendingInsightsInputSchema>;

const GenerateSpendingInsightsOutputSchema = z.object({
  insights: z.array(z.string()).describe('A list of insights and recommendations for the user.'),
});
export type GenerateSpendingInsightsOutput = z.infer<typeof GenerateSpendingInsightsOutputSchema>;

export async function generateSpendingInsights(input: GenerateSpendingInsightsInput): Promise<GenerateSpendingInsightsOutput> {
  return generateSpendingInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSpendingInsightsPrompt',
  input: {schema: GenerateSpendingInsightsInputSchema},
  output: {schema: GenerateSpendingInsightsOutputSchema},
  prompt: `You are a personal finance advisor. Analyze the user's income, expenses, budget, and financial accounts, and provide personalized insights and recommendations to help them better manage their finances.

Income: {{income}}
Expenses:
{{#each expenses}}
- Category: {{category}}, Amount: {{amount}}
{{/each}}
Budget:
{{#each budget}}
- Category: {{category}}, Limit: {{limit}}
{{/each}}

{{#if accounts}}
Bank Accounts:
{{#each accounts}}
- {{name}} ({{type}}): \${{balance}}
{{/each}}
{{/if}}

{{#if creditCards}}
Credit Cards:
{{#each creditCards}}
- {{name}}: \${{balance}} balance
{{/each}}
{{/if}}

Provide a list of insights and recommendations, focusing on areas where the user can save money, potential risks to their budget, and opportunities to improve their financial health. Be concise and actionable.
`,
});

const generateSpendingInsightsFlow = ai.defineFlow(
  {
    name: 'generateSpendingInsightsFlow',
    inputSchema: GenerateSpendingInsightsInputSchema,
    outputSchema: GenerateSpendingInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
