
import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead,
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { getCategories, saveCategories } from "@/utils/localStorage";
import { Category } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { Edit, Plus, Save, Trash, X } from "lucide-react";

const CategoryManager: React.FC = () => {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("expense-blue");
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editedName, setEditedName] = useState("");
  const [editedColor, setEditedColor] = useState("");
  
  useEffect(() => {
    loadCategories();
  }, []);
  
  const loadCategories = () => {
    const loaded = getCategories();
    setCategories(loaded);
  };
  
  const addCategory = () => {
    if (!newCategoryName.trim()) {
      toast({
        title: "Error",
        description: "Category name is required",
        variant: "destructive",
      });
      return;
    }
    
    // Check for duplicates
    if (categories.some((c) => c.name === newCategoryName.trim())) {
      toast({
        title: "Error",
        description: "Category already exists",
        variant: "destructive",
      });
      return;
    }
    
    const newCategory: Category = {
      id: uuidv4(),
      name: newCategoryName.trim(),
      color: newCategoryColor,
    };
    
    const newCategories = [...categories, newCategory];
    saveCategories(newCategories);
    setCategories(newCategories);
    setNewCategoryName("");
    
    toast({
      title: "Success",
      description: "Category added successfully",
    });
  };
  
  const startEditing = (category: Category) => {
    setEditingCategory(category.id);
    setEditedName(category.name);
    setEditedColor(category.color);
  };
  
  const cancelEditing = () => {
    setEditingCategory(null);
  };
  
  const saveEditing = (id: string) => {
    if (!editedName.trim()) {
      toast({
        title: "Error",
        description: "Category name is required",
        variant: "destructive",
      });
      return;
    }
    
    // Check for duplicates (excluding the current category)
    if (categories.some((c) => c.name === editedName.trim() && c.id !== id)) {
      toast({
        title: "Error",
        description: "Category already exists",
        variant: "destructive",
      });
      return;
    }
    
    const newCategories = categories.map((c) =>
      c.id === id ? { ...c, name: editedName.trim(), color: editedColor } : c
    );
    
    saveCategories(newCategories);
    setCategories(newCategories);
    setEditingCategory(null);
    
    toast({
      title: "Success",
      description: "Category updated successfully",
    });
  };
  
  const deleteCategory = (id: string) => {
    // Protect default categories
    const category = categories.find(c => c.id === id);
    if (category && ["Food", "Transportation", "Shopping", "Bills", "Entertainment", "Income"].includes(category.name)) {
      toast({
        title: "Error",
        description: "Cannot delete default categories",
        variant: "destructive",
      });
      return;
    }
    
    const newCategories = categories.filter((c) => c.id !== id);
    saveCategories(newCategories);
    setCategories(newCategories);
    
    toast({
      title: "Success",
      description: "Category deleted successfully",
    });
  };
  
  const colorOptions = [
    { value: "expense-red", label: "Red" },
    { value: "expense-green", label: "Green" },
    { value: "expense-blue", label: "Blue" },
    { value: "expense-yellow", label: "Yellow" },
    { value: "expense-purple", label: "Purple" },
    { value: "expense-orange", label: "Orange" },
    { value: "expense-indigo", label: "Indigo" },
  ];

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle>Category Manager</CardTitle>
        <CardDescription>Create and manage your expense categories</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="New category name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="flex-1"
            />
            <Select
              value={newCategoryColor}
              onValueChange={setNewCategoryColor}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Color" />
              </SelectTrigger>
              <SelectContent>
                {colorOptions.map((color) => (
                  <SelectItem key={color.value} value={color.value}>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full bg-${color.value}`} />
                      <span>{color.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={addCategory}>
              <Plus className="mr-1 h-4 w-4" /> Add
            </Button>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Color</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    {editingCategory === category.id ? (
                      <Select
                        value={editedColor}
                        onValueChange={setEditedColor}
                      >
                        <SelectTrigger className="w-[100px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {colorOptions.map((color) => (
                            <SelectItem key={color.value} value={color.value}>
                              <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full bg-${color.value}`} />
                                <span>{color.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className={`w-4 h-4 rounded-full bg-${category.color}`} />
                    )}
                  </TableCell>
                  <TableCell>
                    {editingCategory === category.id ? (
                      <Input
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                      />
                    ) : (
                      category.name
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {editingCategory === category.id ? (
                        <>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => saveEditing(category.id)}
                          >
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={cancelEditing}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => startEditing(category)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => deleteCategory(category.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryManager;
