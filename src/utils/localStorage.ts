
import { Transaction, Category } from "@/types";

// Default categories
const defaultCategories: Category[] = [
  { id: "1", name: "Food", color: "expense-red" },
  { id: "2", name: "Transportation", color: "expense-blue" },
  { id: "3", name: "Shopping", color: "expense-yellow" },
  { id: "4", name: "Bills", color: "expense-purple" },
  { id: "5", name: "Entertainment", color: "expense-orange" },
  { id: "6", name: "Income", color: "expense-green" },
];

// Get transactions from localStorage
export const getTransactions = (): Transaction[] => {
  const transactions = localStorage.getItem("transactions");
  return transactions ? JSON.parse(transactions) : [];
};

// Save transactions to localStorage
export const saveTransactions = (transactions: Transaction[]): void => {
  localStorage.setItem("transactions", JSON.stringify(transactions));
};

// Add a new transaction
export const addTransaction = (transaction: Transaction): void => {
  const transactions = getTransactions();
  transactions.unshift(transaction); // Add to the beginning of the array
  saveTransactions(transactions);
};

// Delete a transaction
export const deleteTransaction = (id: string): void => {
  const transactions = getTransactions();
  const updatedTransactions = transactions.filter((t) => t.id !== id);
  saveTransactions(updatedTransactions);
};

// Get categories from localStorage
export const getCategories = (): Category[] => {
  const categories = localStorage.getItem("categories");
  if (!categories) {
    // Initialize with default categories if none exist
    saveCategories(defaultCategories);
    return defaultCategories;
  }
  return JSON.parse(categories);
};

// Save categories to localStorage
export const saveCategories = (categories: Category[]): void => {
  localStorage.setItem("categories", JSON.stringify(categories));
};

// Add a new category
export const addCategory = (category: Category): void => {
  const categories = getCategories();
  categories.push(category);
  saveCategories(categories);
};

// Delete a category
export const deleteCategory = (id: string): void => {
  const categories = getCategories();
  const updatedCategories = categories.filter((c) => c.id !== id);
  saveCategories(updatedCategories);
};

// Update a category
export const updateCategory = (category: Category): void => {
  const categories = getCategories();
  const index = categories.findIndex((c) => c.id === category.id);
  if (index !== -1) {
    categories[index] = category;
    saveCategories(categories);
  }
};

// Calculate dashboard statistics
export const calculateDashboardStats = () => {
  const transactions = getTransactions();
  
  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);
    
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);
    
  const balance = totalIncome - totalExpenses;
  
  // Calculate top spending categories
  const categorySpending: Record<string, number> = {};
  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      if (categorySpending[t.category]) {
        categorySpending[t.category] += t.amount;
      } else {
        categorySpending[t.category] = t.amount;
      }
    });
    
  const topCategories = Object.entries(categorySpending)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);
    
  return {
    totalExpenses,
    totalIncome,
    balance,
    topCategories,
  };
};

// Get transactions for the current month
export const getCurrentMonthTransactions = (): Transaction[] => {
  const transactions = getTransactions();
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  return transactions.filter((t) => {
    const transactionDate = new Date(t.date);
    return (
      transactionDate.getMonth() === currentMonth &&
      transactionDate.getFullYear() === currentYear
    );
  });
};
