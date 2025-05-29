
"use client";

import type { Transaction } from "@/lib/types";
import { getCategoryIcon, TransactionTypeIcons } from "@/components/icons";
import { format } from "date-fns";
import { id } from "date-fns/locale"; 
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
import { Card, CardContent } from "@/components/ui/card";
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
import { getCategoryIndonesianName } from "@/lib/types";
import { useIsMobile } from "@/hooks/use-mobile";


interface TransactionListProps {
  transactions: Transaction[];
  onEditTransaction: (transaction: Transaction) => void;
  onDeleteTransaction: (transactionId: string) => void;
}

export default function TransactionList({ transactions, onEditTransaction, onDeleteTransaction }: TransactionListProps) {
  const [transactionToDelete, setTransactionToDelete] = React.useState<Transaction | null>(null);
  const isMobile = useIsMobile();

  if (transactions.length === 0) {
    return <p className="text-muted-foreground text-center py-8">Belum ada transaksi. Tambahkan satu untuk memulai!</p>;
  }

  const sortedTransactions = transactions; 

  const handleDeleteClick = (transaction: Transaction) => {
    setTransactionToDelete(transaction);
  };

  const handleDeleteConfirm = () => {
    if (transactionToDelete) {
      onDeleteTransaction(transactionToDelete.id);
      setTransactionToDelete(null); 
    }
  };

  const handleAlertOpenChange = (open: boolean) => {
    if (!open) {
      setTransactionToDelete(null); 
    }
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <AlertDialog open={transactionToDelete !== null} onOpenChange={handleAlertOpenChange}>
      {isMobile ? (
        // Mobile view - Card layout
        <ScrollArea className="h-[400px] rounded-md [&>[data-radix-scroll-area-viewport]]:scrollbar-none">
          <div className="space-y-2 p-1">
            {sortedTransactions.map((transaction) => {
              const Icon = getCategoryIcon(transaction.category);
              const TypeIcon = TransactionTypeIcons[transaction.type];
              return (
                <Card key={transaction.id} className="p-3">
                  <CardContent className="p-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium text-muted-foreground">
                        {format(transaction.date, "dd MMM", { locale: id })}
                      </div>
                      <div className="flex items-center space-x-1">
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
                      </div>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-sm">{transaction.description}</div>
                      <div
                        className={`font-semibold text-sm flex items-center ${
                          transaction.type === "income"
                            ? "text-accent" // Changed from text-accent-foreground
                            : "text-destructive"
                        }`}
                      >
                        {React.createElement(TypeIcon as any, { className: "mr-1 h-4 w-4" })}
                        {transaction.type === "income" ? "+" : "-"}
                        {formatCurrency(transaction.amount)}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Badge variant="secondary" className="flex items-center w-fit">
                        {React.createElement(Icon as any, { className: "mr-1 h-3 w-3" })}
                        {getCategoryIndonesianName(transaction.category)}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </ScrollArea>
      ) : (
        // Desktop view - Table layout
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
                        {React.createElement(Icon as any, { className: "mr-1 h-3 w-3" })}
                        {getCategoryIndonesianName(transaction.category)}
                      </Badge>
                    </TableCell>
                    <TableCell
                      className={`text-right font-semibold ${
                        transaction.type === "income"
                          ? "text-accent" // Changed from text-accent-foreground
                          : "text-destructive"
                      }`}
                    >
                      <div className="flex items-center justify-end">
                        {React.createElement(TypeIcon as any, { className: "mr-1 h-4 w-4" })}
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
      )}
      
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
              <AlertDialogCancel>Batal</AlertDialogCancel> 
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
