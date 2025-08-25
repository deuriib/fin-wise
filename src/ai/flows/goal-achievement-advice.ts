// src/ai/flows/goal-achievement-advice.ts
'use server';

/**
 * @fileOverview A flow to provide personalized advice on achieving financial goals.
 *
 * - getGoalAchievementAdvice - A function that returns advice for a financial goal.
 * - GoalAchievementAdviceInput - The input type for the function.
 * - GoalAchievementAdviceOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GoalAchievementAdviceInputSchema = z.object({
    goalName: z.string().describe("The name of the financial goal."),
    targetAmount: z.number().describe("The total amount needed to achieve the goal."),
    savedAmount: z.number().describe("The amount already saved for the goal."),
    targetDate: z.string().describe("The date by which the user wants to achieve the goal."),
    monthlyIncome: z.number().describe("The user's total monthly income."),
    monthlyExpenses: z.number().describe("The user's total monthly expenses."),
});
export type GoalAchievementAdviceInput = z.infer<typeof GoalAchievementAdviceInputSchema>;

const GoalAchievementAdviceOutputSchema = z.object({
  advice: z.string().describe("Personalized, actionable advice on how to achieve the financial goal. This should include calculations on required savings per month and practical tips."),
});
export type GoalAchievementAdviceOutput = z.infer<typeof GoalAchievementAdviceOutputSchema>;

export async function getGoalAchievementAdvice(
  input: GoalAchievementAdviceInput
): Promise<GoalAchievementAdviceOutput> {
  return goalAchievementAdviceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'goalAchievementAdvicePrompt',
  input: {schema: GoalAchievementAdviceInputSchema},
  output: {schema: GoalAchievementAdviceOutputSchema},
  prompt: `You are a helpful and encouraging financial coach. Your task is to provide actionable advice to a user trying to reach a financial goal.

  Analyze the user's goal details and financial situation to create a clear, simple, and motivating plan.

  Goal Information:
  - Goal: {{{goalName}}}
  - Target Amount: {{{targetAmount}}}
  - Already Saved: {{{savedAmount}}}
  - Target Date: {{{targetDate}}}

  User's Financials:
  - Monthly Income: {{{monthlyIncome}}}
  - Monthly Expenses: {{{monthlyExpenses}}}

  Based on this, calculate the remaining amount to save and the required monthly savings to meet the goal on time. Provide a step-by-step plan. If the goal seems unrealistic with the current financials, gently point it out and suggest either extending the timeline or finding ways to increase savings. Your tone should be positive and empowering.
  `,
});

const goalAchievementAdviceFlow = ai.defineFlow(
  {
    name: 'goalAchievementAdviceFlow',
    inputSchema: GoalAchievementAdviceInputSchema,
    outputSchema: GoalAchievementAdviceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
