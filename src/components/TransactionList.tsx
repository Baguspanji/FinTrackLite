
"use client";

import type { Transaction } from "@/lib/types";
import { getCategoryIcon, TransactionTypeIcons } from "@/components/icons";
import { format } from "date-fns";
import { id } from "date-fns/locale"; // Import Indonesian locale
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import * as React from "react";


interface TransactionListProps {
  transactions: Transaction[];
  onEditTransaction: (transaction: Transaction) => void;
  onDeleteTransaction: (transactionId: string) => void;
}

export default function TransactionList({ transactions, onEditTransaction, onDeleteTransaction }: TransactionListProps) {
  const [transactionToDelete, setTransactionToDelete] = React.useState<Transaction | null>(null);

  if (transactions.length === 0) {
    return <p className="text-muted-foreground text-center py-8">Belum ada transaksi. Tambahkan satu untuk memulai!</p>;
  }

  const sortedTransactions = transactions; // Already sorted by Firestore query

  const handleDeleteClick = (transaction: Transaction) => {
    setTransactionToDelete(transaction);
  };

  const handleDeleteConfirm = () => {
    if (transactionToDelete) {
      onDeleteTransaction(transactionToDelete.id);
      setTransactionToDelete(null); // Close dialog
    }
  };

  const handleAlertOpenChange = (open: boolean) => {
    if (!open) {
      setTransactionToDelete(null); // Ensure state is cleared if dialog is closed
    }
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <AlertDialog open={transactionToDelete !== null} onOpenChange={handleAlertOpenChange}>
      <ScrollArea className="h-[400px] rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Tanggal</TableHead>
              <TableHead>Deskripsi</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead className="text-right">Jumlah</TableHead>
              <TableHead className="text-center w-[120px]">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTransactions.map((transaction) => {
              const Icon = getCategoryIcon(transaction.category);
              const TypeIcon = TransactionTypeIcons[transaction.type];
              return (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">
                    {format(transaction.date, "dd MMM", { locale: id })}
                  </TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="flex items-center w-fit">
                      <Icon className="mr-1 h-3 w-3" />
                      {transaction.category}
                    </Badge>
                  </TableCell>
                  <TableCell
                    className={`text-right font-semibold ${
                      transaction.type === "income"
                        ? "text-accent-foreground"
                        : "text-destructive"
                    }`}
                  >
                    <div className="flex items-center justify-end">
                      <TypeIcon className="mr-1 h-4 w-4" />
                      {transaction.type === "income" ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </div>
                  </TableCell>
                  <TableCell className="text-center space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEditTransaction(transaction)}
                      aria-label="Ubah transaksi"
                      className="h-8 w-8"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <AlertDialogTrigger asChild>
                       <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(transaction)}
                        aria-label="Hapus transaksi"
                        className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </ScrollArea>
      
      <AlertDialogContent>
        {transactionToDelete && (
          <>
            <AlertDialogHeader>
              <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
              <AlertDialogDescription>
                Tindakan ini tidak dapat dibatalkan. Ini akan menghapus transaksi secara permanen
                untuk "{transactionToDelete.description}".
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel> {/* Will trigger onOpenChange(false) */}
              <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive hover:bg-destructive/90">
                Hapus
              </AlertDialogAction>
            </AlertDialogFooter>
          </>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
