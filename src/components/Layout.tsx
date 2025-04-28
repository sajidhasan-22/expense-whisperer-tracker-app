
import React, { ReactNode } from "react";
import Navbar from "./Navbar";
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
import { Home, PieChart, Plus, Wallet, BarChart3, Settings } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
  activePage?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, activePage = "dashboard" }) => {
  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "add-expense", label: "Add Expense", icon: Plus },
    { id: "transactions", label: "Transactions", icon: Wallet },
    { id: "categories", label: "Categories", icon: PieChart },
    { id: "reports", label: "Reports", icon: BarChart3 },
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
                <SidebarMenuButton>
                  <Settings className="h-5 w-5 mr-3" />
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
      </div>
    </SidebarProvider>
  );
};

export default Layout;
