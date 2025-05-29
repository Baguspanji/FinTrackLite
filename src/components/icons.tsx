import type { Category } from '@/lib/types';
import {
  Utensils,
  Car,
  Lightbulb,
  Briefcase,
  Smile,
  ShoppingCart,
  HeartPulse,
  GraduationCap,
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
  Icon as LucideIcon,
} from 'lucide-react';

export const CategoryIcons: Record<Category, typeof LucideIcon> = {
  Food: Utensils,
  Transport: Car,
  Utilities: Lightbulb,
  Salary: Briefcase,
  Entertainment: Smile,
  Shopping: ShoppingCart,
  Healthcare: HeartPulse,
  Education: GraduationCap,
  Other: MoreHorizontal,
};

export const TransactionTypeIcons: Record<'income' | 'expense', typeof LucideIcon> = {
  income: TrendingUp,
  expense: TrendingDown,
};

export const getCategoryIcon = (category: Category): typeof LucideIcon => {
  return CategoryIcons[category] || MoreHorizontal;
};
