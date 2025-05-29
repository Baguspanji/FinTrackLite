
"use client";

import type { Transaction, Category } from "@/lib/types";
import { CATEGORIES_ARRAY_ID, getCategoryIndonesianName } from "@/lib/types";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
} from "recharts";
import {
  ChartContainer,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { getCategoryIcon } from "./icons";
import * as React from "react";

interface CategoryChartProps {
  transactions: Transaction[];
  selectedMonth: Date;
}

// Generate distinct colors for chart segments
const chartColors = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--primary))",
  "hsl(var(--accent))",
  "hsl(190, 70%, 50%)", // teal
  "hsl(300, 70%, 50%)", // purple
];

export default function CategoryChart({ transactions, selectedMonth }: CategoryChartProps) {
  const [chartData, setChartData] = React.useState<Array<{ name: string; value: number; fill: string; icon?: React.ElementType, originalName: Category }>>([]);
  
  React.useEffect(() => {
    const currentMonthExpenses = transactions.filter(
      (t) =>
        t.type === "expense" &&
        t.date.getFullYear() === selectedMonth.getFullYear() &&
        t.date.getMonth() === selectedMonth.getMonth()
    );

    const expenseByCategory = currentMonthExpenses.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<Category, number>);

    const formattedChartData = CATEGORIES_ARRAY_ID.filter(category => expenseByCategory[category] > 0)
      .map((category, index) => ({
        name: getCategoryIndonesianName(category), // Use Indonesian name for display
        value: expenseByCategory[category] || 0,
        fill: chartColors[index % chartColors.length],
        icon: getCategoryIcon(category),
        originalName: category, // Keep original name for config key
      }));
    
    setChartData(formattedChartData);
  }, [transactions, selectedMonth]);


  if (chartData.length === 0) {
    return <p className="text-muted-foreground text-center py-8">Tidak ada data pengeluaran untuk bulan ini untuk ditampilkan dalam grafik.</p>;
  }
  
  const chartConfig = Object.fromEntries(
      chartData.map(item => [item.originalName, { 
        label: item.name, 
        color: item.fill, 
        icon: item.icon && typeof item.icon !== 'string' ? item.icon : undefined 
      }])
  );

  return (
    <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
      <PieChart>
        <RechartsTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel indicator="dot" nameKey="name" />}
        />
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name" // This will be the Indonesian name
          cx="50%"
          cy="50%"
          outerRadius={100}
          labelLine={false}
          label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
            const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
            const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
            const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
            if ((percent * 100) < 5) return null; 
            return (
              <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize="12px">
                {`${(percent * 100).toFixed(0)}%`}
              </text>
            );
          }}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
        <ChartLegend content={<ChartLegendContent nameKey="name"/>} />
      </PieChart>
    </ChartContainer>
  );
}

