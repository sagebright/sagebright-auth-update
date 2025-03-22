
import React from "react";
import { Link } from "react-router-dom";
import Logo from "@/components/Logo";
import { SidebarProvider, Sidebar, SidebarContent, SidebarMenu, 
  SidebarMenuItem, SidebarMenuButton, SidebarHeader, SidebarFooter } from "@/components/ui/sidebar";
import { LayoutDashboard, HelpCircle, ListChecks, Calendar, Users, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gray-50">
        <Sidebar>
          <SidebarHeader className="border-b pb-0">
            <div className="flex items-center px-2 py-3">
              <img 
                src="/lovable-uploads/sb_logo_type.svg" 
                alt="Sagebright" 
                className="h-8 w-auto" 
              />
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  isActive={true} 
                  tooltip="Dashboard"
                  className="!bg-sagebright-green/10 text-sagebright-green font-medium transition-colors data-[active=true]:!bg-sagebright-green/20 data-[active=true]:!text-sagebright-green hover:!bg-sagebright-green/20"
                >
                  <Link to="/dashboard">
                    <LayoutDashboard className="text-sagebright-green" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  tooltip="Ask Sage"
                  className="text-sagebright-coral transition-colors hover:!bg-sagebright-coral/10 hover:!text-sagebright-coral"
                >
                  <Link to="#">
                    <HelpCircle className="text-sagebright-coral" />
                    <span>Ask Sage</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  tooltip="Onboarding Roadmap"
                  className="text-sagebright-navy transition-colors hover:!bg-sagebright-navy/10 hover:!text-sagebright-navy"
                >
                  <Link to="#">
                    <ListChecks className="text-sagebright-navy" />
                    <span>Onboarding Roadmap</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  tooltip="Schedules"
                  className="text-sagebright-gold transition-colors hover:!bg-sagebright-gold/10 hover:!text-sagebright-gold"
                >
                  <Link to="#">
                    <Calendar className="text-sagebright-gold" />
                    <span>Schedules</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  tooltip="People"
                  className="text-sagebright-accent transition-colors hover:!bg-sagebright-accent/10 hover:!text-sagebright-accent"
                >
                  <Link to="#">
                    <Users className="text-sagebright-accent" />
                    <span>People</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  tooltip="Settings"
                  className="text-gray-600 transition-colors hover:!bg-gray-200 hover:!text-gray-800"
                >
                  <Link to="#">
                    <Settings className="text-gray-600" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="border-t pt-2">
            <div className="px-3 py-2">
              <Button variant="outline" className="w-full justify-start text-gray-600 hover:text-red-500 hover:border-red-200" asChild>
                <Link to="/">
                  <LogOut className="mr-2 h-4 w-4 text-red-500" />
                  <span>Log Out</span>
                </Link>
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
