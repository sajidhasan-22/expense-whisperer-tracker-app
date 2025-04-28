
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { calculateDashboardStats } from "@/utils/localStorage";
import { DashboardStats } from "@/types";
import { ArrowUpRight, ArrowDownRight, Wallet } from "lucide-react";

const DashboardSummary: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalExpenses: 0,
    totalIncome: 0,
    balance: 0,
    topCategories: [],
  });

  useEffect(() => {
    const dashboardStats = calculateDashboardStats();
    setStats(dashboardStats);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="animate-fade-in">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(stats.balance)}</div>
          <p className="text-xs text-muted-foreground">
            Net balance of all transactions
          </p>
        </CardContent>
      </Card>
      
      <Card className="animate-fade-in [animation-delay:100ms]">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Income</CardTitle>
          <ArrowUpRight className="h-4 w-4 text-expense-green" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-expense-green">
            {formatCurrency(stats.totalIncome)}
          </div>
          <p className="text-xs text-muted-foreground">
            Total income recorded
          </p>
        </CardContent>
      </Card>
      
      <Card className="animate-fade-in [animation-delay:200ms]">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Expenses</CardTitle>
          <ArrowDownRight className="h-4 w-4 text-expense-red" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-expense-red">
            {formatCurrency(stats.totalExpenses)}
          </div>
          <p className="text-xs text-muted-foreground">
            Total expenses recorded
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardSummary;
