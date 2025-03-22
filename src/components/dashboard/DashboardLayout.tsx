
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
                <SidebarMenuButton asChild isActive={true} tooltip="Dashboard">
                  <Link to="/dashboard">
                    <LayoutDashboard />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Ask Sage">
                  <Link to="#">
                    <HelpCircle />
                    <span>Ask Sage</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Onboarding Roadmap">
                  <Link to="#">
                    <ListChecks />
                    <span>Onboarding Roadmap</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Schedules">
                  <Link to="#">
                    <Calendar />
                    <span>Schedules</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="People">
                  <Link to="#">
                    <Users />
                    <span>People</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Settings">
                  <Link to="#">
                    <Settings />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="border-t pt-2">
            <div className="px-3 py-2">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/">
                  <LogOut className="mr-2 h-4 w-4" />
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
