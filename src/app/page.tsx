
"use client";

import * as React from "react";
import Header from "@/components/Header";
import TransactionForm from "@/components/TransactionForm";
import TransactionList from "@/components/TransactionList";
import MonthlySummary from "@/components/MonthlySummary";
import CategoryChart from "@/components/CategoryChart";
// import FinancialInsight from "@/components/FinancialInsight"; // Temporarily commented out
import type { Transaction } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ListChecks, LineChart, Receipt, Lightbulb, Edit3, PlusCircle, Loader2, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useIsMobile } from "@/hooks/use-mobile";
import { db } from "@/lib/firebase";
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy, Timestamp } from "firebase/firestore";

export default function HomePage() {
  const { toast } = useToast();
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [selectedMonth, setSelectedMonth] = React.useState<Date>(new Date());
  const [editingTransaction, setEditingTransaction] = React.useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const isMobile = useIsMobile();
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  React.useEffect(() => {
    setIsLoading(true);
    const transactionsCol = collection(db, "transactions");
    const q = query(transactionsCol, orderBy("date", "desc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedTransactions = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          date: (data.date as Timestamp).toDate(), // Convert Firestore Timestamp to JS Date
        } as Transaction;
      });
      setTransactions(fetchedTransactions);
      setIsLoading(false);
      setError(null);
    }, (err) => {
      console.error("Error fetching transactions:", err);
      setError("Gagal memuat transaksi. Silakan coba lagi nanti.");
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Tidak dapat mengambil data transaksi.",
        variant: "destructive",
      });
    });

    return () => unsubscribe(); // Cleanup listener on component unmount
  }, [toast]);
  
  const formatCurrencyForToast = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
  };

  const addTransaction = async (transaction: Omit<Transaction, "id">) => {
    try {
      await addDoc(collection(db, "transactions"), {
        ...transaction,
        date: Timestamp.fromDate(new Date(transaction.date)), // Convert JS Date to Timestamp
      });
      
      toast({
        title: "Transaksi Ditambahkan",
        description: `Transaksi sebesar ${formatCurrencyForToast(transaction.amount)} untuk "${transaction.description}" telah ditambahkan.`,
      });
      
      // Close modal after successful transaction
      if (isMobile) {
        setIsModalOpen(false);
      }
    } catch (e) {
      console.error("Error adding transaction: ", e);
      toast({
        title: "Error",
        description: "Tidak dapat menambahkan transaksi.",
        variant: "destructive",
      });
    }
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    if (isMobile) {
      setIsModalOpen(true);
    }
  };

  const handleUpdateTransaction = async (updatedTransaction: Transaction) => {
    if (!updatedTransaction.id) return;
    const { id, ...dataToUpdate } = updatedTransaction;
    const transactionDocRef = doc(db, "transactions", id);

    try {
      await updateDoc(transactionDocRef, {
        ...dataToUpdate,
        date: Timestamp.fromDate(new Date(dataToUpdate.date)), // Convert JS Date to Timestamp
      });
      
      // Close modal first on mobile to prevent useEffect interference
      if (isMobile) {
        setIsModalOpen(false);
      }
      setEditingTransaction(null);
      
      toast({
        title: "Transaksi Diperbarui",
        description: `Transaksi "${updatedTransaction.description}" telah berhasil diperbarui.`,
      });
    } catch (e) {
      console.error("Error updating transaction: ", e);
      toast({
        title: "Error",
        description: "Tidak dapat memperbarui transaksi.",
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteTransaction = async (transactionId: string) => {
    if (!transactionId) return;
    const transactionDocRef = doc(db, "transactions", transactionId);
    try {
      await deleteDoc(transactionDocRef);
      toast({
        title: "Transaksi Dihapus",
        description: "Transaksi telah berhasil dihapus.",
      });
    } catch (e) {
      console.error("Error deleting transaction: ", e);
      toast({
        title: "Error",
        description: "Tidak dapat menghapus transaksi.",
        variant: "destructive",
      });
    }
  };

  const handleCancelEdit = () => {
    // Close modal first on mobile to prevent useEffect interference
    if (isMobile) {
      setIsModalOpen(false);
    }
    setEditingTransaction(null);
  };

  React.useEffect(() => {
    // Only auto-open modal when editing starts on mobile
    if (isMobile && editingTransaction && !isModalOpen) {
      setIsModalOpen(true);
    }
    // Don't auto-close modal when switching to desktop as it might interrupt user flow
    // User can manually close if needed
  }, [isMobile, editingTransaction, isModalOpen]);


  if (isMobile === undefined && isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Header />
        <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        )}
        {error && !isLoading && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <LineChart className="mr-2 h-5 w-5 text-primary" />
                    Ringkasan Bulanan
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
                    Kategori Pengeluaran
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
                    Riwayat Transaksi
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TransactionList 
                    transactions={transactions}
                    onEditTransaction={handleEditTransaction} 
                    onDeleteTransaction={handleDeleteTransaction}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Right Column (Desktop) / Modal Trigger (Mobile) */}
            <div className="lg:col-span-1 space-y-6">
              {isMobile === true && (
                <>
                  <Button
                    className="fixed flex bottom-6 right-6 z-50 px-4 py-2 rounded-lg shadow-lg bg-primary hover:bg-primary/90 text-white"
                    onClick={() => {
                      setEditingTransaction(null); 
                      setIsModalOpen(true);
                    }}
                    aria-label="Tambah Transaksi Baru"
                  >
                    <PlusCircle className="h-6 w-6" />
                    <span>Tambah</span>
                  </Button>
                  <Dialog open={isModalOpen} onOpenChange={(open) => {
                    setIsModalOpen(open);
                    if (!open) { 
                      setEditingTransaction(null); 
                    }
                  }}>
                    <DialogContent className="p-4 sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>{editingTransaction ? "Ubah Transaksi" : "Tambah Transaksi Baru"}</DialogTitle>
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
                </>
              )}

              {(isMobile === false || isMobile === undefined) && ( 
                <>
                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        {editingTransaction ? <Edit3 className="mr-2 h-5 w-5 text-primary" /> : <Receipt className="mr-2 h-5 w-5 text-primary" />}
                        {editingTransaction ? "Ubah Transaksi" : "Tambah Transaksi Baru"}
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
                  {/* 
                  // Temporarily commented out FinancialInsight for static export
                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Lightbulb className="mr-2 h-5 w-5 text-primary" />
                        Wawasan Keuangan AI
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <FinancialInsight
                        transactions={transactions}
                        selectedMonth={selectedMonth}
                      />
                    </CardContent>
                  </Card> 
                  */}
                </>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

