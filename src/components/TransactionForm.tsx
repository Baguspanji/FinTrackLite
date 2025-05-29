
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
import { cn } from "@/lib/utils";
import type { Transaction, TransactionType, Category } from "@/lib/types";
import { CATEGORIES_ARRAY_ID, getCategoryIndonesianName } from "@/lib/types";


const transactionFormSchema = z.object({
  date: z.date({
    required_error: "Tanggal wajib diisi.",
  }),
  amount: z.coerce
    .number({ invalid_type_error: "Jumlah harus berupa angka." })
    .positive("Jumlah harus positif."),
  category: z.custom<Category>(value => CATEGORIES_ARRAY_ID.includes(value as Category), {
    message: "Kategori tidak valid",
  }),
  description: z.string().min(1, "Deskripsi wajib diisi.").max(100, "Deskripsi maksimal 100 karakter."),
  type: z.enum(["income", "expense"], {
    required_error: "Anda harus memilih tipe transaksi.",
  }),
});

type TransactionFormValues = z.infer<typeof transactionFormSchema>;

interface TransactionFormProps {
  addTransaction: (transaction: Omit<Transaction, "id">) => void;
  editingTransaction?: Transaction | null;
  onUpdateTransaction?: (transaction: Transaction) => void;
  onCancelEdit?: () => void;
}

export default function TransactionForm({
  addTransaction,
  editingTransaction,
  onUpdateTransaction,
  onCancelEdit
}: TransactionFormProps) {
  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      amount: NaN,
      category: CATEGORIES_ARRAY_ID[0],
      description: "",
      type: "expense",
      date: new Date(0), 
    },
  });

  React.useEffect(() => {
    if (editingTransaction) {
      form.reset({
        ...editingTransaction,
        date: new Date(editingTransaction.date),
        amount: Number(editingTransaction.amount),
      });
    } else {
      form.reset({
        date: new Date(), 
        amount: NaN,
        category: CATEGORIES_ARRAY_ID[0],
        description: "",
        type: "expense",
      });
    }
  }, [editingTransaction, form.reset]); 

  function onSubmit(data: TransactionFormValues) {
    if (editingTransaction && onUpdateTransaction) {
      onUpdateTransaction({ ...data, id: editingTransaction.id });
    } else {
      addTransaction(data);
    }
    form.reset({
        date: new Date(),
        amount: NaN,
        category: CATEGORIES_ARRAY_ID[0],
        description: "",
        type: "expense",
      });
  }

  const handleCancel = () => {
    if (onCancelEdit) {
      onCancelEdit();
    }
     form.reset({
        date: new Date(),
        amount: NaN,
        category: CATEGORIES_ARRAY_ID[0],
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
              <FormLabel>Tipe</FormLabel>
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
                    <FormLabel className="font-normal">Pengeluaran</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="income" />
                    </FormControl>
                    <FormLabel className="font-normal">Pemasukan</FormLabel>
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
              <FormLabel>Jumlah</FormLabel>
              <FormControl>
                <Input
                    type="number"
                    placeholder="0"
                    {...field}
                    value={isNaN(field.value) ? '' : field.value}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || '')} 
                    step="1" // For IDR, typically no decimals
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
              <FormLabel>Kategori</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {CATEGORIES_ARRAY_ID.map((category) => (
                    <SelectItem key={category} value={category}>
                      {getCategoryIndonesianName(category)}
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
              <FormLabel>Tanggal</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground" 
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP", { locale: require('date-fns/locale/id') })
                      ) : (
                        <span>Pilih tanggal</span>
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
                    locale={require('date-fns/locale/id')}
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
              <FormLabel>Deskripsi</FormLabel>
              <FormControl>
                <Input placeholder="cth: Belanja bulanan, Gaji" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          {editingTransaction ? (
            <>
              <Save className="mr-2 h-4 w-4" /> Perbarui Transaksi
            </>
          ) : (
            <>
              <PlusCircle className="mr-2 h-4 w-4" /> Tambah Transaksi
            </>
          )}
        </Button>
        {editingTransaction && (
          <Button type="button" variant="outline" onClick={handleCancel} className="w-full mt-2">
            <XCircle className="mr-2 h-4 w-4" /> Batal Ubah
          </Button>
        )}
      </form>
    </Form>
  );
}

