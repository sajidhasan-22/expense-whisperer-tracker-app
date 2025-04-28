
export interface Transaction {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  type: "expense" | "income";
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon?: string;
}

export interface DashboardStats {
  totalExpenses: number;
  totalIncome: number;
  balance: number;
  topCategories: Array<{ category: string; amount: number }>;
}
