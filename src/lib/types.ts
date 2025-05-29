
export const TRANSACTION_CATEGORIES = {
  Food: "Makanan",
  Transport: "Transportasi",
  Utilities: "Utilitas",
  Salary: "Gaji",
  Entertainment: "Hiburan",
  Shopping: "Belanja",
  Healthcare: "Kesehatan",
  Education: "Pendidikan",
  Other: "Lainnya",
} as const;

// Use this for internal logic, like keys for icons or data structures
export const TRANSACTION_CATEGORIES_ID = {
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


export type Category = keyof typeof TRANSACTION_CATEGORIES_ID;

export const CATEGORIES_ARRAY_ID = Object.keys(TRANSACTION_CATEGORIES_ID) as Category[];

export function getCategoryIndonesianName(categoryKey: Category): string {
  return TRANSACTION_CATEGORIES[categoryKey] || "Tidak Diketahui";
}


export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  date: Date;
  amount: number;
  category: Category; // This will store the English key
  description: string;
  type: TransactionType;
}

