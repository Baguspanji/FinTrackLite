
"use client";

import * as React from "react";
import Header from "@/components/Header";
import TransactionForm from "@/components/TransactionForm";
import TransactionList from "@/components/TransactionList";
import MonthlySummary from "@/components/MonthlySummary";
import CategoryChart from "@/components/CategoryChart";
import FinancialInsight from "@/components/FinancialInsight";
import type { Transaction } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ListChecks, LineChart, Receipt, Lightbulb, Edit3 } from "lucide-react"; // Edit3 can be an alternative icon if needed
import { useToast } from "@/hooks/use-toast";


export default function HomePage() {
  const { toast } = useToast();
  const [transactions, setTransactions] = React.useState<Transaction[]>(() => {
    if (typeof window !== 'undefined') {
      const savedTransactions = localStorage.getItem("transactions");
      return savedTransactions ? JSON.parse(savedTransactions, (key, value) => {
        if (key === 'date') return new Date(value);
        return value;
      }) : [];
    }
    return [];
  });
  const [selectedMonth, setSelectedMonth] = React.useState<Date>(new Date());
  const [editingTransaction, setEditingTransaction] = React.useState<Transaction | null>(null);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem("transactions", JSON.stringify(transactions));
    }
  }, [transactions]);

  const addTransaction = (transaction: Omit<Transaction, "id">) => {
    setTransactions((prev) => [
      { ...transaction, id: crypto.randomUUID() },
      ...prev,
    ]);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
  };

  const handleUpdateTransaction = (updatedTransaction: Transaction) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === updatedTransaction.id ? updatedTransaction : t))
    );
    setEditingTransaction(null);
    toast({
      title: "Transaction Updated",
      description: `Transaction for "${updatedTransaction.description}" has been updated.`,
    });
  };

  const handleCancelEdit = () => {
    setEditingTransaction(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column / Top Section on mobile */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  {editingTransaction ? <Edit3 className="mr-2 h-5 w-5 text-primary" /> : <Receipt className="mr-2 h-5 w-5 text-primary" />}
                  {editingTransaction ? "Edit Transaction" : "Add Transaction"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TransactionForm
                  addTransaction={addTransaction}
                  editingTransaction={editingTransaction}
                  onUpdateTransaction={handleUpdateTransaction}
                  onCancelEdit={handleCancelEdit}
                />
              </CardContent>
            </Card>
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lightbulb className="mr-2 h-5 w-5 text-primary" />
                  AI Financial Insight
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FinancialInsight
                  transactions={transactions}
                  selectedMonth={selectedMonth}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Column / Bottom Section on mobile */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <LineChart className="mr-2 h-5 w-5 text-primary" />
                  Monthly Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <MonthlySummary
                  transactions={transactions}
                  selectedMonth={selectedMonth}
                  setSelectedMonth={setSelectedMonth}
                />
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <LineChart className="mr-2 h-5 w-5 text-primary" />
                  Expense Categories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CategoryChart
                  transactions={transactions}
                  selectedMonth={selectedMonth}
                />
              </CardContent>
            </Card>
            
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ListChecks className="mr-2 h-5 w-5 text-primary" />
                  Transaction History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TransactionList 
                  transactions={transactions}
                  onEditTransaction={handleEditTransaction} 
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
