
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Info, Sparkles } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { Transaction } from "@/lib/types";
import { generateFinancialInsight } from "@/ai/flows/generate-financial-insights";
import { useToast } from "@/hooks/use-toast";

interface FinancialInsightProps {
  transactions: Transaction[];
  selectedMonth: Date;
}

export default function FinancialInsight({ transactions, selectedMonth }: FinancialInsightProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [insight, setInsight] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const { toast } = useToast();

  const handleGetInsight = async () => {
    setIsLoading(true);
    setInsight(null);
    setError(null);

    const currentMonthTransactions = transactions.filter(
      (t) =>
        t.date.getFullYear() === selectedMonth.getFullYear() &&
        t.date.getMonth() === selectedMonth.getMonth()
    );

    if (currentMonthTransactions.length === 0) {
      setError("Tidak ada transaksi untuk bulan yang dipilih untuk dianalisis.");
      setIsLoading(false);
      return;
    }

    const serializableTransactions = currentMonthTransactions.map(tx => ({
      ...tx,
      date: tx.date.toISOString().split('T')[0], 
    }));


    try {
      const result = await generateFinancialInsight({
        monthlyTransactions: JSON.stringify(serializableTransactions),
      });
      setInsight(result.insight);
    } catch (e) {
      console.error("Error generating financial insight:", e);
      setError("Gagal menghasilkan wawasan. Silakan coba lagi.");
      toast({
        title: "Error",
        description: "Tidak dapat menghasilkan wawasan keuangan.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button onClick={handleGetInsight} disabled={isLoading} className="w-full">
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Sparkles className="mr-2 h-4 w-4" />
        )}
        Dapatkan Wawasan Keuangan AI
      </Button>

      {error && (
        <Alert variant="destructive">
          <Info className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {insight && (
        <Alert variant="default" className="bg-accent/30 border-accent">
          <Sparkles className="h-4 w-4 text-accent-foreground" />
          <AlertTitle className="text-accent-foreground">Tips Keuangan</AlertTitle>
          <AlertDescription className="text-accent-foreground/90">
            {insight}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

