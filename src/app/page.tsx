
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
import { ListChecks, LineChart, Receipt, Lightbulb, Edit3, PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";

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

  const isMobile = useIsMobile();
  const [isModalOpen, setIsModalOpen] = React.useState(false);

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
    if (isMobile) {
      setIsModalOpen(false);
    }
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    if (isMobile) {
      setIsModalOpen(true);
    }
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
    if (isMobile) {
      setIsModalOpen(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingTransaction(null);
    if (isMobile) {
      setIsModalOpen(false);
    }
  };

  // Effect to open modal if editing starts on mobile or view changes to mobile while editing
  React.useEffect(() => {
    if (isMobile && editingTransaction && !isModalOpen) {
      setIsModalOpen(true);
    }
  }, [isMobile, editingTransaction, isModalOpen]);


  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
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

          {/* Right Column / Mobile Transaction Trigger */}
          <div className="lg:col-span-1 space-y-6">
            {/* Mobile View: Button to open modal */}
            {isMobile === true && (
              <>
                <Button className="w-full" variant="outline" onClick={() => {
                  setEditingTransaction(null); // Ensure form is for new transaction
                  setIsModalOpen(true);
                }}>
                  <PlusCircle className="mr-2 h-5 w-5" /> Add New Transaction
                </Button>
                <Dialog open={isModalOpen} onOpenChange={(open) => {
                  setIsModalOpen(open);
                  if (!open) {
                    // If modal is closed by any means (X, Esc, programmatic), reset editing state
                    setEditingTransaction(null);
                  }
                }}>
                  <DialogContent className="p-4 sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>{editingTransaction ? "Edit Transaction" : "Add New Transaction"}</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                      <TransactionForm
                        addTransaction={addTransaction}
                        editingTransaction={editingTransaction}
                        onUpdateTransaction={handleUpdateTransaction}
                        onCancelEdit={handleCancelEdit}
                      />
                    </div>
                  </DialogContent>
                </Dialog>
                {/* AI Insight card is hidden on mobile in this setup */}
              </>
            )}

            {/* Desktop View (or initial undefined isMobile state): Inline cards */}
            {(isMobile === false || isMobile === undefined) && (
              <>
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      {editingTransaction ? <Edit3 className="mr-2 h-5 w-5 text-primary" /> : <Receipt className="mr-2 h-5 w-5 text-primary" />}
                      {editingTransaction ? "Edit Transaction" : "Add New Transaction"}
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
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
