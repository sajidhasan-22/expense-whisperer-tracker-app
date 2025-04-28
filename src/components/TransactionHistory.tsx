
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { getTransactions, deleteTransaction, getCategories } from "@/utils/localStorage";
import { Transaction, Category } from "@/types";
import { Trash } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const TransactionHistory: React.FC = () => {
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  
  useEffect(() => {
    loadTransactions();
    setCategories(getCategories());
  }, []);
  
  const loadTransactions = () => {
    const loaded = getTransactions();
    setTransactions(loaded);
  };
  
  const handleDelete = (id: string) => {
    deleteTransaction(id);
    loadTransactions();
    toast({
      title: "Success",
      description: "Transaction deleted successfully",
    });
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  
  const getCategoryColor = (categoryName: string) => {
    const category = categories.find((c) => c.name === categoryName);
    return category?.color || "expense-blue";
  };

  return (
    <Card className="animate-fade-in [animation-delay:500ms] mt-4">
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.slice(0, 10).map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{formatDate(transaction.date)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full bg-${getCategoryColor(transaction.category)}`} />
                      <span>{transaction.category}</span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {transaction.description || "-"}
                  </TableCell>
                  <TableCell className={`text-right font-medium ${
                    transaction.type === "expense" ? "text-expense-red" : "text-expense-green"
                  }`}>
                    {transaction.type === "expense" ? "- " : "+ "}
                    {formatCurrency(transaction.amount)}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(transaction.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex flex-col items-center justify-center py-8">
            <p className="text-muted-foreground mb-4">No transactions recorded yet</p>
            <Button variant="outline">Add Your First Transaction</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionHistory;
