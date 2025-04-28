
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { getTransactions, getCategories } from "@/utils/localStorage";
import { Transaction, Category } from "@/types";

const ExpenseChart: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);

  useEffect(() => {
    const allTransactions = getTransactions();
    const allCategories = getCategories();
    setTransactions(allTransactions);
    setCategories(allCategories);

    // Process data for charts
    processMonthlyData(allTransactions);
    processCategoryData(allTransactions, allCategories);
  }, []);

  const processMonthlyData = (transactions: Transaction[]) => {
    const last6Months = new Array(6).fill(0).map((_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      return {
        name: date.toLocaleString('default', { month: 'short' }),
        month: date.getMonth(),
        year: date.getFullYear(),
        expenses: 0,
        income: 0
      };
    }).reverse();

    transactions.forEach(transaction => {
      const transDate = new Date(transaction.date);
      const transMonth = transDate.getMonth();
      const transYear = transDate.getFullYear();
      
      const monthIndex = last6Months.findIndex(
        m => m.month === transMonth && m.year === transYear
      );
      
      if (monthIndex !== -1) {
        if (transaction.type === 'expense') {
          last6Months[monthIndex].expenses += transaction.amount;
        } else {
          last6Months[monthIndex].income += transaction.amount;
        }
      }
    });

    setMonthlyData(last6Months);
  };

  const processCategoryData = (transactions: Transaction[], categories: Category[]) => {
    const categoryAmounts: Record<string, number> = {};
    
    // Only consider expenses for category breakdown
    transactions
      .filter(t => t.type === 'expense')
      .forEach(transaction => {
        if (categoryAmounts[transaction.category]) {
          categoryAmounts[transaction.category] += transaction.amount;
        } else {
          categoryAmounts[transaction.category] = transaction.amount;
        }
      });
    
    const data = Object.keys(categoryAmounts).map(categoryName => {
      const category = categories.find(c => c.name === categoryName);
      return {
        name: categoryName,
        value: categoryAmounts[categoryName],
        color: category?.color || 'expense-blue'
      };
    });
    
    setCategoryData(data);
  };

  const COLORS = ['#ff6b6b', '#51cf66', '#339af0', '#fcc419', '#9b87f5', '#ff922b'];
  
  const getColor = (index: number) => {
    if (index < COLORS.length) {
      return COLORS[index];
    }
    return COLORS[index % COLORS.length];
  };
  
  const getCategoryColor = (name: string) => {
    const category = categories.find(c => c.name === name);
    const colorClass = category?.color || 'expense-blue';
    
    switch(colorClass) {
      case 'expense-red': return '#ff6b6b';
      case 'expense-green': return '#51cf66';
      case 'expense-blue': return '#339af0';
      case 'expense-yellow': return '#fcc419';
      case 'expense-purple': return '#9b87f5';
      case 'expense-orange': return '#ff922b';
      case 'expense-indigo': return '#5c7cfa';
      default: return '#339af0';
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 mt-4">
      <Card className="col-span-2 md:col-span-1 animate-fade-in [animation-delay:300ms]">
        <CardHeader>
          <CardTitle>Monthly Overview</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={monthlyData}
              margin={{ top: 10, right: 30, left: 0, bottom: 30 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value}`} />
              <Legend />
              <Bar name="Income" dataKey="income" fill="#51cf66" />
              <Bar name="Expenses" dataKey="expenses" fill="#ff6b6b" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      <Card className="col-span-2 md:col-span-1 animate-fade-in [animation-delay:400ms]">
        <CardHeader>
          <CardTitle>Expense Categories</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getCategoryColor(entry.name)} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">No expense data available</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpenseChart;
