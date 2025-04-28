import React, { ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Settings from "./Settings";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarGroup, 
  SidebarGroupLabel, 
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { Home, PieChart, Plus, Wallet, BarChart3, Settings as SettingsIcon } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
  activePage?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, activePage = "dashboard" }) => {
  const navigate = useNavigate();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const handleNavigate = (path: string) => {
    navigate("/", { replace: true });
  };
  
  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, onClick: () => handleNavigate("dashboard") },
    { id: "add-expense", label: "Add Expense", icon: Plus, onClick: () => handleNavigate("add-expense") },
    { id: "transactions", label: "Transactions", icon: Wallet, onClick: () => handleNavigate("transactions") },
    { id: "categories", label: "Categories", icon: PieChart, onClick: () => handleNavigate("categories") },
    { id: "reports", label: "Reports", icon: BarChart3, onClick: () => handleNavigate("reports") },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar className="border-r">
          <SidebarHeader className="flex items-center px-6 py-4">
            <h1 className="text-xl font-bold text-sidebar-foreground flex items-center gap-2">
              <Wallet className="h-6 w-6" /> ExpenseWhisperer
            </h1>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {sidebarItems.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton 
                        className={activePage === item.id ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""}
                        onClick={item.onClick}
                      >
                        <item.icon className="h-5 w-5 mr-3" />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => setIsSettingsOpen(true)}>
                  <SettingsIcon className="h-5 w-5 mr-3" />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        
        <div className="flex-1 overflow-auto">
          <Navbar />
          <main className="container py-6">
            <SidebarTrigger className="lg:hidden mb-6">
              <button className="flex items-center gap-2 text-sm">
                <span>Menu</span>
              </button>
            </SidebarTrigger>
            {children}
          </main>
        </div>

        <Settings 
          open={isSettingsOpen}
          onOpenChange={setIsSettingsOpen}
        />
      </div>
    </SidebarProvider>
  );
};

export default Layout;
