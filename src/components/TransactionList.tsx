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

interface TransactionListProps {
  transactions: Transaction[];
}

export default function TransactionList({ transactions }: TransactionListProps) {
  if (transactions.length === 0) {
    return <p className="text-muted-foreground text-center py-8">No transactions yet. Add one to get started!</p>;
  }

  const sortedTransactions = [...transactions].sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <ScrollArea className="h-[400px] rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Amount</TableHead>
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
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}
