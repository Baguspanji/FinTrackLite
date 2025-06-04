
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
import { ListChecks, LineChart, Receipt, Lightbulb, Edit3, PlusCircle, Loader2, AlertTriangle, UserCheck, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useIsMobile } from "@/hooks/use-mobile";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy, Timestamp } from "firebase/firestore";

export default function HomePage() {
  const { toast } = useToast();
  const { currentUser, loading: authLoading } = useAuth();
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [selectedMonth, setSelectedMonth] = React.useState<Date>(new Date());
  const [editingTransaction, setEditingTransaction] = React.useState<Transaction | null>(null);
  const [isLoadingTransactions, setIsLoadingTransactions] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const isMobile = useIsMobile();
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  React.useEffect(() => {
    if (authLoading) {
      setIsLoadingTransactions(true);
      return;
    }

    if (!currentUser) {
      setTransactions([]);
      setIsLoadingTransactions(false);
      setError(null);
      return;
    }

    setIsLoadingTransactions(true);
    const transactionsColPath = `users/${currentUser.uid}/transactions`;
    const transactionsCol = collection(db, transactionsColPath);
    const q = query(transactionsCol, orderBy("date", "desc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedTransactions = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          date: (data.date as Timestamp).toDate(),
        } as Transaction;
      });
      setTransactions(fetchedTransactions);
      setIsLoadingTransactions(false);
      setError(null);
    }, (err) => {
      console.error("Error fetching transactions:", err);
      setError("Gagal memuat transaksi. Silakan coba lagi nanti.");
      setIsLoadingTransactions(false);
      toast({
        title: "Error Memuat Transaksi",
        description: "Tidak dapat mengambil data transaksi dari server.",
        variant: "destructive",
      });
    });

    return () => unsubscribe();
  }, [currentUser, authLoading, toast]);

  const formatCurrencyForToast = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
  };

  const addTransaction = async (transaction: Omit<Transaction, "id">) => {
    if (!currentUser) {
      toast({ title: "Error", description: "Anda harus login untuk menambahkan transaksi.", variant: "destructive" });
      return;
    }
    try {
      const transactionsColPath = `users/${currentUser.uid}/transactions`;
      await addDoc(collection(db, transactionsColPath), {
        ...transaction,
        date: Timestamp.fromDate(new Date(transaction.date)),
      });

      toast({
        title: "Transaksi Ditambahkan",
        description: `Transaksi sebesar ${formatCurrencyForToast(transaction.amount)} untuk "${transaction.description}" telah ditambahkan.`,
      });

      if (isMobile) {
        setIsModalOpen(false);
      }
    } catch (e) {
      console.error("Error adding transaction: ", e);
      toast({
        title: "Gagal Menambahkan",
        description: "Tidak dapat menambahkan transaksi ke server.",
        variant: "destructive",
      });
    }
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    if (isMobile) {
      setIsModalOpen(true);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleUpdateTransaction = async (updatedTransaction: Transaction) => {
    if (!updatedTransaction.id || !currentUser) return;
    const { id, ...dataToUpdate } = updatedTransaction;
    const transactionDocRef = doc(db, `users/${currentUser.uid}/transactions`, id);

    try {
      await updateDoc(transactionDocRef, {
        ...dataToUpdate,
        date: Timestamp.fromDate(new Date(dataToUpdate.date)),
      });

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
        title: "Gagal Memperbarui",
        description: "Tidak dapat memperbarui transaksi di server.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTransaction = async (transactionId: string) => {
    if (!transactionId || !currentUser) return;
    const transactionDocRef = doc(db, `users/${currentUser.uid}/transactions`, transactionId);
    try {
      await deleteDoc(transactionDocRef);
      toast({
        title: "Transaksi Dihapus",
        description: "Transaksi telah berhasil dihapus.",
      });
    } catch (e) {
      console.error("Error deleting transaction: ", e);
      toast({
        title: "Gagal Menghapus",
        description: "Tidak dapat menghapus transaksi dari server.",
        variant: "destructive",
      });
    }
  };

  const handleCancelEdit = () => {
    if (isMobile) {
      setIsModalOpen(false);
    }
    setEditingTransaction(null);
  };

  React.useEffect(() => {
    if (isMobile && editingTransaction && !isModalOpen) {
      setIsModalOpen(true);
    }
  }, [isMobile, editingTransaction, isModalOpen]);

  if (authLoading || isMobile === undefined) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="ml-4 text-lg text-foreground">Memuat...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8 flex items-center justify-center">
          <Card className="shadow-xl max-w-md w-full">
            <CardHeader className="items-center">
              <UserCheck className="h-12 w-12 text-primary mb-3" />
              <CardTitle className="text-2xl text-center">Selamat Datang di FinTrack Lite</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-lg text-muted-foreground mb-6">
                Silakan login untuk mulai mengelola keuangan Anda dan mendapatkan wawasan finansial.
              </p>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
        {isLoadingTransactions && !transactions.length && (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="ml-4 text-lg text-foreground">Memuat transaksi...</p>
          </div>
        )}
        {error && !isLoadingTransactions && (
          <Alert variant="destructive" className="mb-6 shadow-md">
            <AlertTriangle className="h-5 w-5" />
            <AlertTitle>Oops! Terjadi Kesalahan</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {(!isLoadingTransactions || transactions.length > 0) && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl font-semibold">
                    <LineChart className="mr-3 h-6 w-6 text-primary" />
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

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-kategori" className="border-none">
                  <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <AccordionTrigger className="hover:no-underline p-6 w-full rounded-t-lg [&[data-state=closed]]:rounded-b-lg">
                      <CardTitle className="flex items-center text-xl font-semibold">
                        <BarChart3 className="mr-3 h-6 w-6 text-primary" />
                        Kategori Pengeluaran
                      </CardTitle>
                    </AccordionTrigger>
                    <AccordionContent>
                      <CardContent className="pt-2">
                        <CategoryChart
                          transactions={transactions}
                          selectedMonth={selectedMonth}
                        />
                      </CardContent>
                    </AccordionContent>
                  </Card>
                </AccordionItem>
              </Accordion>

              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl font-semibold">
                    <ListChecks className="mr-3 h-6 w-6 text-primary" />
                    Riwayat Transaksi
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TransactionList
                    transactions={transactions}
                    selectedMonth={selectedMonth}
                    onEditTransaction={handleEditTransaction}
                    onDeleteTransaction={handleDeleteTransaction}
                  />
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1 space-y-6">
              {isMobile === true && (
                <>
                  <Button
                    className="fixed flex items-center bottom-6 right-6 z-50 px-4 py-3 h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground text-lg justify-center"
                    onClick={() => {
                      setEditingTransaction(null);
                      setIsModalOpen(true);
                    }}
                    aria-label="Tambah Transaksi Baru"
                  >
                    <PlusCircle className="h-6 w-6" />
                  </Button>
                  <Dialog open={isModalOpen} onOpenChange={(open) => {
                    setIsModalOpen(open);
                    if (!open) {
                      setEditingTransaction(null);
                    }
                  }}>
                    <DialogContent className="p-4 sm:max-w-md rounded-lg">
                      <DialogHeader>
                        <DialogTitle className="text-xl">{editingTransaction ? "Ubah Transaksi" : "Tambah Transaksi Baru"}</DialogTitle>
                        <DialogDescription>
                          {editingTransaction ? "Perbarui detail transaksi Anda di bawah ini." : "Masukkan detail transaksi baru Anda."}
                        </DialogDescription>
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

              {(isMobile === false) && (
                <>
                  <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CardHeader>
                      <CardTitle className="flex items-center text-xl font-semibold">
                        {editingTransaction ? <Edit3 className="mr-3 h-6 w-6 text-primary" /> : <Receipt className="mr-3 h-6 w-6 text-primary" />}
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

                  <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CardHeader>
                      <CardTitle className="flex items-center text-xl font-semibold">
                        <Lightbulb className="mr-3 h-6 w-6 text-primary" />
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
                </>
              )}
            </div>
          </div>
        )}
        {!isLoadingTransactions && !error && transactions.length === 0 && currentUser && (
          <Card className="shadow-lg mt-10 col-span-full">
            <CardHeader className="items-center">
              <CardTitle className="text-xl text-center">Mulai Lacak Keuangan Anda!</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4">
                Sepertinya Anda belum memiliki transaksi. Tambahkan transaksi pertama Anda untuk memulai.
              </p>
              {isMobile === false && (
                <p className="text-sm text-muted-foreground">Gunakan formulir di sebelah kanan.</p>
              )}
              {isMobile === true && (
                <Button onClick={() => { setEditingTransaction(null); setIsModalOpen(true); }}>
                  <PlusCircle className="mr-2 h-5 w-5" /> Tambah Transaksi
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}

    