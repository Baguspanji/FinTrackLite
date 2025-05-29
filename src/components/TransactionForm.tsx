
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, PlusCircle, Save, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import type { Transaction, TransactionType, Category } from "@/lib/types";
import { CATEGORIES_ARRAY } from "@/lib/types";

const transactionFormSchema = z.object({
  date: z.date({
    required_error: "A date is required.",
  }),
  amount: z.coerce
    .number({ invalid_type_error: "Amount must be a number." })
    .positive("Amount must be positive."),
  category: z.custom<Category>(value => CATEGORIES_ARRAY.includes(value as Category), {
    message: "Invalid category",
  }),
  description: z.string().min(1, "Description is required.").max(100),
  type: z.enum(["income", "expense"], {
    required_error: "You need to select a transaction type.",
  }),
});

type TransactionFormValues = z.infer<typeof transactionFormSchema>;

interface TransactionFormProps {
  addTransaction: (transaction: Omit<Transaction, "id">) => void;
  editingTransaction?: Transaction | null;
  onUpdateTransaction?: (transaction: Transaction) => void;
  onCancelEdit?: () => void;
}

// Default values for a new form, ensuring date is initially undefined or null for hydration safety.
// The actual current date for new transactions will be set in useEffect.
const newTransactionDefaults: TransactionFormValues = {
  date: new Date(), // This will be overridden by useEffect for new transactions to ensure client-side consistency
  amount: NaN,
  category: CATEGORIES_ARRAY[0],
  description: "",
  type: "expense",
};


export default function TransactionForm({
  addTransaction,
  editingTransaction,
  onUpdateTransaction,
  onCancelEdit
}: TransactionFormProps) {
  const { toast } = useToast();
  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    // Provide defaultValues that won't cause hydration mismatch for `date`.
    // `date` will be properly set in useEffect.
    defaultValues: {
      amount: NaN,
      category: CATEGORIES_ARRAY[0],
      description: "",
      type: "expense",
      // date: undefined, // Explicitly undefined or let resolver handle if schema allows
      // Let's use a placeholder date that will be immediately overwritten by useEffect
      // Or rely on zod resolver if possible. For now, let it be potentially new Date() but rely on reset.
      // The most robust is to make `date` field itself optional in schema for defaultValues,
      // or ensure reset logic in useEffect always sets it.
      date: new Date(0), // A fixed, non-dynamic date for initial defaultValues
    },
  });

  React.useEffect(() => {
    if (editingTransaction) {
      form.reset({
        ...editingTransaction,
        date: new Date(editingTransaction.date), // Ensure it's a Date object
        amount: Number(editingTransaction.amount),
      });
    } else {
      // For new transactions, reset with current values client-side
      form.reset({
        date: new Date(), // Set current date here, AFTER initial mount/hydration
        amount: NaN,
        category: CATEGORIES_ARRAY[0],
        description: "",
        type: "expense",
      });
    }
  }, [editingTransaction, form.reset]); // form.reset is generally stable

  function onSubmit(data: TransactionFormValues) {
    if (editingTransaction && onUpdateTransaction) {
      onUpdateTransaction({ ...data, id: editingTransaction.id });
    } else {
      addTransaction(data);
      // Toast is kept from original
      // toast({
      //   title: "Transaction Added",
      //   description: `${data.type === "income" ? "Income" : "Expense"} of $${data.amount.toFixed(2)} for ${data.category} added.`,
      // });
    }
    // Reset form to its default state for a new transaction, client-side
    form.reset({
        date: new Date(),
        amount: NaN,
        category: CATEGORIES_ARRAY[0],
        description: "",
        type: "expense",
      });
  }

  const handleCancel = () => {
    if (onCancelEdit) {
      onCancelEdit();
    }
    // Reset form to its default state for a new transaction, client-side
     form.reset({
        date: new Date(),
        amount: NaN,
        category: CATEGORIES_ARRAY[0],
        description: "",
        type: "expense",
      });
  };


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Type</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex space-x-4"
                >
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="expense" />
                    </FormControl>
                    <FormLabel className="font-normal">Expense</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="income" />
                    </FormControl>
                    <FormLabel className="font-normal">Income</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input
                    type="number"
                    placeholder="0.00"
                    {...field}
                    value={isNaN(field.value) ? '' : field.value}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || '')} // Ensure it's a number or empty string
                    step="0.01"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {CATEGORIES_ARRAY.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground" // This handles undefined/null field.value gracefully
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Groceries, Salary" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          {editingTransaction ? (
            <>
              <Save className="mr-2 h-4 w-4" /> Update Transaction
            </>
          ) : (
            <>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Transaction
            </>
          )}
        </Button>
        {editingTransaction && (
          <Button type="button" variant="outline" onClick={handleCancel} className="w-full mt-2">
            <XCircle className="mr-2 h-4 w-4" /> Cancel Edit
          </Button>
        )}
      </form>
    </Form>
  );
}
