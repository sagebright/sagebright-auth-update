
import React from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "@/components/Logo";
import { SidebarProvider, Sidebar, SidebarContent, SidebarMenu, 
  SidebarMenuItem, SidebarMenuButton, SidebarHeader, SidebarFooter } from "@/components/ui/sidebar";
import { LayoutDashboard, HelpCircle, ListChecks, Calendar, Users, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { signOut } = useAuth();
  const location = useLocation();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gray-50">
        <Sidebar>
          <SidebarHeader className="border-b border-sagebright-accent/20 pb-0">
            <div className="flex items-center justify-center py-5">
              <img 
                src="/lovable-uploads/sb_logo_type.svg" 
                alt="Sagebright" 
                className="h-16 w-auto" 
              />
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  isActive={location.pathname === "/hr-dashboard"} 
                  tooltip="Admin Dashboard"
                  className="font-medium transition-all text-charcoal/70
                  data-[active=true]:!bg-sagebright-accent/25 data-[active=true]:!text-sagebright-green 
                  hover:!bg-sagebright-accent/25 hover:!text-sagebright-green hover:scale-[1.02]"
                >
                  <Link to="/hr-dashboard" className="flex items-center">
                    <LayoutDashboard className="text-charcoal/70 group-hover:text-sagebright-green" />
                    <span>Admin Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  isActive={location.pathname === "/ask-sage"}
                  tooltip="Ask Sage"
                  className="text-charcoal/70 font-normal transition-all duration-200
                  hover:!bg-sagebright-accent/25 hover:!text-sagebright-green hover:scale-[1.02]
                  data-[active=true]:!bg-sagebright-accent/25 data-[active=true]:!text-sagebright-green"
                >
                  <Link to="/ask-sage" className="flex items-center">
                    <HelpCircle className="text-charcoal/70 group-hover:text-sagebright-green" />
                    <span>Ask Sage</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  tooltip="Reports"
                  className="text-charcoal/70 font-normal transition-all duration-200
                  hover:!bg-sagebright-accent/25 hover:!text-sagebright-green hover:scale-[1.02]"
                >
                  <Link to="#" className="flex items-center">
                    <ListChecks className="text-charcoal/70 group-hover:text-sagebright-green" />
                    <span>Reports</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  tooltip="Schedules"
                  className="text-charcoal/70 font-normal transition-all duration-200
                  hover:!bg-sagebright-accent/25 hover:!text-sagebright-green hover:scale-[1.02]"
                >
                  <Link to="#" className="flex items-center">
                    <Calendar className="text-charcoal/70 group-hover:text-sagebright-green" />
                    <span>Schedules</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  tooltip="People"
                  className="text-charcoal/70 font-normal transition-all duration-200
                  hover:!bg-sagebright-accent/25 hover:!text-sagebright-green hover:scale-[1.02]"
                >
                  <Link to="#" className="flex items-center">
                    <Users className="text-charcoal/70 group-hover:text-sagebright-green" />
                    <span>People</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  tooltip="Settings"
                  className="text-charcoal/70 font-normal transition-all duration-200
                  hover:!bg-sagebright-accent/25 hover:!text-sagebright-green hover:scale-[1.02]"
                >
                  <Link to="#" className="flex items-center">
                    <Settings className="text-charcoal/70 group-hover:text-sagebright-green" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="border-t border-sagebright-accent/20 pt-2">
            <div className="px-3 py-2">
              <Button 
                variant="outline" 
                className="w-full justify-start text-charcoal/70 font-normal
                hover:text-bittersweet hover:border-bittersweet/20 hover:scale-[1.02] transition-all duration-200" 
                onClick={() => signOut()}
              >
                <LogOut className="mr-2 h-4 w-4 text-bittersweet" />
                <span>Log Out</span>
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>
        <div className="flex flex-col flex-1 overflow-hidden">
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
}
