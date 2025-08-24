// financial-wellness-recommendations.ts
'use server';

/**
 * @fileOverview A flow to provide personalized financial wellness recommendations based on user spending habits.
 *
 * - getFinancialWellnessRecommendations - A function that returns financial wellness recommendations.
 * - FinancialWellnessRecommendationsInput - The input type for the getFinancialWellnessRecommendations function.
 * - FinancialWellnessRecommendationsOutput - The return type for the getFinancialWellnessRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FinancialWellnessRecommendationsInputSchema = z.object({
  spendingData: z
    .string()
    .describe(
      'A summary of the user spending habits, including categories and amounts spent in each category.'
    ),
  income: z.number().describe('The user monthly income.'),
  savings: z.number().describe('The user current savings.'),
  financialGoals: z
    .string()
    .describe(
      'A description of the users financial goals, such as saving for a house or paying off debt.'
    ),
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
export type FinancialWellnessRecommendationsInput = z.infer<
  typeof FinancialWellnessRecommendationsInputSchema
>;

const FinancialWellnessRecommendationsOutputSchema = z.object({
  wellnessScore: z
    .number()
    .describe(
      'A score indicating the users financial wellbeing (0-100), with 100 being the best.'
    ),
  recommendations: z
    .string()
    .describe(
      'A list of personalized recommendations on how to improve the users financial wellness.'
    ),
});
export type FinancialWellnessRecommendationsOutput = z.infer<
  typeof FinancialWellnessRecommendationsOutputSchema
>;

export async function getFinancialWellnessRecommendations(
  input: FinancialWellnessRecommendationsInput
): Promise<FinancialWellnessRecommendationsOutput> {
  return financialWellnessRecommendationsFlow(input);
}

const financialWellnessRecommendationsPrompt = ai.definePrompt({
  name: 'financialWellnessRecommendationsPrompt',
  input: {schema: FinancialWellnessRecommendationsInputSchema},
  output: {schema: FinancialWellnessRecommendationsOutputSchema},
  prompt: `You are a financial advisor providing personalized recommendations to improve financial wellness.

  Based on the user's spending data, income, savings, financial goals, and financial accounts, provide a wellness score (0-100) and a list of actionable recommendations.

  Spending Data: {{{spendingData}}}
  Income: {{{income}}}
  Savings: {{{savings}}}
  Financial Goals: {{{financialGoals}}}

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


  Wellness Score (0-100): The score should reflect the users overall financial health, considering their income, spending habits, savings, debts, and progress toward their goals.
  Recommendations: Provide specific and practical recommendations tailored to the user's situation. Consider suggesting budgeting strategies, saving tips, debt management options, and investment advice.
  Be concise.
  `,
});

const financialWellnessRecommendationsFlow = ai.defineFlow(
  {
    name: 'financialWellnessRecommendationsFlow',
    inputSchema: FinancialWellnessRecommendationsInputSchema,
    outputSchema: FinancialWellnessRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await financialWellnessRecommendationsPrompt(input);
    return output!;
  }
);
