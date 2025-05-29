"use client";

import type { Transaction } from "@/lib/types";
import { format, addMonths, subMonths } from "date-fns";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface MonthlySummaryProps {
  transactions: Transaction[];
  selectedMonth: Date;
  setSelectedMonth: (date: Date) => void;
}

export default function MonthlySummary({
  transactions,
  selectedMonth,
  setSelectedMonth,
}: MonthlySummaryProps) {
  const currentMonthTransactions = transactions.filter(
    (t) =>
      t.date.getFullYear() === selectedMonth.getFullYear() &&
      t.date.getMonth() === selectedMonth.getMonth()
  );

  const totalIncome = currentMonthTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = currentMonthTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpenses;

  const handlePreviousMonth = () => {
    setSelectedMonth(subMonths(selectedMonth, 1));
  };

  const handleNextMonth = () => {
    setSelectedMonth(addMonths(selectedMonth, 1));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h3 className="text-xl font-semibold text-foreground">
          {format(selectedMonth, "MMMM yyyy")}
        </h3>
        <Button variant="outline" size="icon" onClick={handleNextMonth} disabled={selectedMonth.getMonth() === new Date().getMonth() && selectedMonth.getFullYear() === new Date().getFullYear()}>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent-foreground">
              ${totalIncome.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              ${totalExpenses.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netBalance >= 0 ? 'text-primary' : 'text-destructive'}`}>
              ${netBalance.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
