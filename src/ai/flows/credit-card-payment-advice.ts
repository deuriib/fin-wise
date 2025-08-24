// src/ai/flows/credit-card-payment-advice.ts
'use server';

/**
 * @fileOverview A flow to provide personalized advice on credit card payments.
 *
 * - getCreditCardPaymentAdvice - A function that returns payment advice.
 * - CreditCardPaymentAdviceInput - The input type for the function.
 * - CreditCardPaymentAdviceOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CreditCardPaymentAdviceInputSchema = z.object({
    cardName: z.string().describe("The name or nickname of the credit card."),
    statementBalance: z.number().describe("The total balance from the latest credit card statement."),
    dueDate: z.string().describe("The upcoming payment due date for the statement."),
    transactions: z.array(z.object({
        description: z.string(),
        amount: z.number(),
        date: z.string(),
    })).describe("A list of transactions from the credit card statement."),
});
export type CreditCardPaymentAdviceInput = z.infer<typeof CreditCardPaymentAdviceInputSchema>;

const CreditCardPaymentAdviceOutputSchema = z.object({
  advice: z.string().describe("Personalized advice on how to handle the upcoming credit card payment. This should include a recommendation on how much to pay (e.g., minimum, full statement, or a custom amount) and the reasoning behind it."),
});
export type CreditCardPaymentAdviceOutput = z.infer<typeof CreditCardPaymentAdviceOutputSchema>;

export async function getCreditCardPaymentAdvice(
  input: CreditCardPaymentAdviceInput
): Promise<CreditCardPaymentAdviceOutput> {
  return creditCardPaymentAdviceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'creditCardPaymentAdvicePrompt',
  input: {schema: CreditCardPaymentAdviceInputSchema},
  output: {schema: CreditCardPaymentAdviceOutputSchema},
  prompt: `You are a financial advisor specializing in credit card debt management. Analyze the user's credit card statement and provide clear, actionable advice on the upcoming payment.

  Your goal is to help the user avoid interest charges, improve their credit score, and manage their debt effectively.

  Card: {{{cardName}}}
  Statement Balance: {{{statementBalance}}}
  Payment Due Date: {{{dueDate}}}
  
  Transactions:
  {{#each transactions}}
  - {{{date}}}: {{{description}}} - {{{amount}}}
  {{/each}}

  Based on this information, provide a concise recommendation. Explain the benefits of paying the full statement balance versus the minimum payment. If the user has a large balance, suggest a payment strategy. Be encouraging and clear.
  `,
});

const creditCardPaymentAdviceFlow = ai.defineFlow(
  {
    name: 'creditCardPaymentAdviceFlow',
    inputSchema: CreditCardPaymentAdviceInputSchema,
    outputSchema: CreditCardPaymentAdviceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
