
import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { addTransaction, getCategories } from "@/utils/localStorage";
import { useToast } from "@/components/ui/use-toast";
import { Category } from "@/types";

const ExpenseForm: React.FC = () => {
  const { toast } = useToast();
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [type, setType] = useState<"expense" | "income">("expense");
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const loadedCategories = getCategories();
    setCategories(loadedCategories);
    // Set default category
    if (loadedCategories.length > 0) {
      const defaultCategory = loadedCategories.find(c => c.name === (type === "expense" ? "Food" : "Income")) || loadedCategories[0];
      setCategory(defaultCategory.name);
    }
  }, [type]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !category) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }
    
    const transaction = {
      id: uuidv4(),
      amount: numericAmount,
      description,
      category,
      date,
      type,
    };
    
    addTransaction(transaction);
    
    toast({
      title: "Success",
      description: `${type === "expense" ? "Expense" : "Income"} added successfully!`,
    });
    
    // Reset form
    setAmount("");
    setDescription("");
    
    // Don't reset category and date for better UX
  };

  const filteredCategories = categories.filter(c => 
    type === "expense" ? c.name !== "Income" : c.name === "Income"
  );

  return (
    <Card className="animate-fade-in [animation-delay:100ms]">
      <CardHeader>
        <CardTitle>Add {type === "expense" ? "Expense" : "Income"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center space-x-2">
            <Label htmlFor="type">Type</Label>
            <div className="flex items-center space-x-2">
              <Label htmlFor="type" className={type === "expense" ? "text-expense-red font-medium" : "text-muted-foreground"}>
                Expense
              </Label>
              <Switch
                id="type"
                checked={type === "income"}
                onCheckedChange={(checked) => setType(checked ? "income" : "expense")}
              />
              <Label htmlFor="type" className={type === "income" ? "text-expense-green font-medium" : "text-muted-foreground"}>
                Income
              </Label>
            </div>
          </div>
          
          <div className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount*</Label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-muted-foreground">$</span>
                  <Input 
                    id="amount" 
                    type="number" 
                    placeholder="0.00"
                    min="0.01"
                    step="0.01"
                    className="pl-8" 
                    value={amount} 
                    onChange={(e) => setAmount(e.target.value)} 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category*</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredCategories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.name}>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full bg-${cat.color}`} />
                          <span>{cat.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                placeholder="What was this for?" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date">Date*</Label>
              <Input 
                id="date" 
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)} 
              />
            </div>
            
            <Button type="submit" className="w-full">
              Add {type === "expense" ? "Expense" : "Income"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ExpenseForm;
