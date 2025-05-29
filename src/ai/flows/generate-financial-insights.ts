
// src/ai/flows/generate-financial-insights.ts
// Note: Server Actions are not supported with static export
// This file has been modified to work with static builds

/**
 * @fileOverview Generates personalized financial insights based on monthly transaction data.
 *
 * - generateFinancialInsight - A function that generates a financial insight.
 * - GenerateFinancialInsightInput - The input type for the generateFinancialInsight function.
 * - GenerateFinancialInsightOutput - The return type for the generateFinancialInsight function.
 */

// Types for compatibility
export interface GenerateFinancialInsightInput {
  monthlyTransactions: string;
}

export interface GenerateFinancialInsightOutput {
  insight: string;
}

// Mock implementation for static builds
export async function generateFinancialInsight(
  input: GenerateFinancialInsightInput
): Promise<GenerateFinancialInsightOutput> {
  // Since this is a static build, we'll return a mock insight
  // In a real implementation, this would call an external API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        insight: "Untuk mendapatkan wawasan keuangan AI yang dipersonalisasi, aplikasi ini memerlukan koneksi server. Saat ini berjalan dalam mode statis. Namun, berdasarkan data transaksi Anda, disarankan untuk memantau pengeluaran bulanan dan mencatat kategori pengeluaran terbesar untuk perencanaan keuangan yang lebih baik."
      });
    }, 1000); // Simulate API call delay
  });
}
