export const TRANSACTION_CATEGORIES = {
  Food: "Food",
  Transport: "Transport",
  Utilities: "Utilities",
  Salary: "Salary",
  Entertainment: "Entertainment",
  Shopping: "Shopping",
  Healthcare: "Healthcare",
  Education: "Education",
  Other: "Other",
} as const;

export type Category = keyof typeof TRANSACTION_CATEGORIES;

export const CATEGORIES_ARRAY = Object.keys(TRANSACTION_CATEGORIES) as Category[];

export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  date: Date;
  amount: number;
  category: Category;
  description: string;
  type: TransactionType;
}
