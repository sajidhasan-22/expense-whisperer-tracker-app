
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

import Layout from "@/components/Layout";
import DashboardSummary from "@/components/DashboardSummary";
import ExpenseForm from "@/components/ExpenseForm";
import TransactionHistory from "@/components/TransactionHistory";
import ExpenseChart from "@/components/ExpenseChart";
import CategoryManager from "@/components/CategoryManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { toast } = useToast();
  const location = useLocation();

  // Check for hash in URL to determine active tab
  useEffect(() => {
    if (location.hash) {
      const hash = location.hash.substring(1);
      if (["dashboard", "add-expense", "transactions", "categories", "reports"].includes(hash)) {
        setActiveTab(hash);
      }
    }
  }, [location]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Update URL hash without causing a page reload
    window.history.pushState(null, "", `#${value}`);
  };

  return (
    <Layout activePage={activeTab}>
      <Tabs defaultValue="dashboard" value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid grid-cols-5 mb-8 max-w-3xl">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="add-expense">Add Expense</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <DashboardSummary />
          <ExpenseChart />
          <TransactionHistory />
        </TabsContent>

        <TabsContent value="add-expense">
          <h1 className="text-3xl font-bold mb-6">Add Transaction</h1>
          <div className="max-w-xl mx-auto">
            <ExpenseForm />
          </div>
        </TabsContent>

        <TabsContent value="transactions">
          <h1 className="text-3xl font-bold mb-6">Transaction History</h1>
          <TransactionHistory />
        </TabsContent>

        <TabsContent value="categories">
          <h1 className="text-3xl font-bold mb-6">Categories</h1>
          <CategoryManager />
        </TabsContent>

        <TabsContent value="reports">
          <h1 className="text-3xl font-bold mb-6">Financial Reports</h1>
          <ExpenseChart />
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default Index;
