
// src/ai/flows/generate-financial-insights.ts
'use server';

/**
 * @fileOverview Generates personalized financial insights based on monthly transaction data.
 *
 * - generateFinancialInsight - A function that generates a financial insight.
 * - GenerateFinancialInsightInput - The input type for the generateFinancialInsight function.
 * - GenerateFinancialInsightOutput - The return type for the generateFinancialInsight function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFinancialInsightInputSchema = z.object({
  monthlyTransactions: z
    .string()
    .describe('A list of monthly transactions in JSON format.'),
});
export type GenerateFinancialInsightInput = z.infer<typeof GenerateFinancialInsightInputSchema>;

const GenerateFinancialInsightOutputSchema = z.object({
  insight: z
    .string()
    .describe(
      'Wawasan atau saran keuangan yang dipersonalisasi dan singkat mengenai potensi pengurangan pajak atau strategi penghematan berdasarkan data transaksi bulanan yang diberikan, dalam Bahasa Indonesia.'
    ),
});
export type GenerateFinancialInsightOutput = z.infer<typeof GenerateFinancialInsightOutputSchema>;

export async function generateFinancialInsight(
  input: GenerateFinancialInsightInput
): Promise<GenerateFinancialInsightOutput> {
  return generateFinancialInsightFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateFinancialInsightPrompt',
  input: {schema: GenerateFinancialInsightInputSchema},
  output: {schema: GenerateFinancialInsightOutputSchema},
  prompt: `Anda adalah seorang penasihat keuangan pribadi. Analisis transaksi bulanan pengguna dan berikan wawasan yang dipersonalisasi, singkat, dan bermanfaat mengenai potensi pengurangan pajak atau strategi penghematan. Pastikan respons Anda dalam Bahasa Indonesia.

  Transaksi: {{{monthlyTransactions}}}`,
});

const generateFinancialInsightFlow = ai.defineFlow(
  {
    name: 'generateFinancialInsightFlow',
    inputSchema: GenerateFinancialInsightInputSchema,
    outputSchema: GenerateFinancialInsightOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
