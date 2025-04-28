
import React from "react";
import { Button } from "@/components/ui/button";
import { Search, Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Navbar: React.FC = () => {
  const { toast } = useToast();
  
  const showSearch = () => {
    toast({
      title: "Search",
      description: "Search functionality coming soon!",
    });
  };
  
  const exportData = () => {
    toast({
      title: "Export Data",
      description: "Export functionality coming soon!",
    });
  };
  
  return (
    <nav className="border-b bg-background px-6 py-3 flex items-center justify-between">
      <div className="flex-1" />
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="sm" onClick={showSearch}>
          <Search className="h-4 w-4 mr-2" />
          <span>Search</span>
        </Button>
        <Button size="sm" variant="secondary" onClick={exportData}>
          <Download className="h-4 w-4 mr-2" />
          <span>Export Data</span>
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
