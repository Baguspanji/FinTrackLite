
"use client";

import type { Transaction } from "@/lib/types";
import { getCategoryIcon, TransactionTypeIcons } from "@/components/icons";
import { format } from "date-fns";
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
    return <p className="text-muted-foreground text-center py-8">No transactions yet. Add one to get started!</p>;
  }

  // Transactions are already sorted by date (desc) from Firestore query in page.tsx
  // const sortedTransactions = [...transactions].sort((a, b) => b.date.getTime() - a.date.getTime());
  const sortedTransactions = transactions;


  const handleDeleteConfirm = () => {
    if (transactionToDelete) {
      onDeleteTransaction(transactionToDelete.id);
      setTransactionToDelete(null);
    }
  };

  return (
    <>
      <ScrollArea className="h-[400px] rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-center w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTransactions.map((transaction) => {
              const Icon = getCategoryIcon(transaction.category);
              const TypeIcon = TransactionTypeIcons[transaction.type];
              return (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">
                    {format(transaction.date, "MMM dd")}
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
                      {transaction.amount.toFixed(2)}
                    </div>
                  </TableCell>
                  <TableCell className="text-center space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEditTransaction(transaction)}
                      aria-label="Edit transaction"
                      className="h-8 w-8"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <AlertDialogTrigger asChild>
                       <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setTransactionToDelete(transaction)}
                        aria-label="Delete transaction"
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
      {transactionToDelete && (
         <AlertDialog open={!!transactionToDelete} onOpenChange={(open) => !open && setTransactionToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the transaction
                for "{transactionToDelete.description}".
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setTransactionToDelete(null)}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
