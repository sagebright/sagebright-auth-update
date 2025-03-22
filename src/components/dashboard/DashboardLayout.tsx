
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
            <div className="flex items-center justify-center px-2 py-4">
              <img 
                src="/lovable-uploads/sb_logo_type.svg" 
                alt="Sagebright" 
                className="h-10 w-auto" 
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
                  className="!bg-sagebright-green/10 font-medium transition-colors text-sagebright-green
                  data-[active=true]:!bg-sagebright-green/15 data-[active=true]:!text-sagebright-green 
                  hover:!bg-sagebright-green/15 hover:!text-sagebright-green"
                >
                  <Link to="/dashboard" className="flex items-center">
                    <LayoutDashboard className="text-sagebright-green" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  tooltip="Ask Sage"
                  className="text-charcoal/70 font-medium transition-colors 
                  hover:!bg-sagebright-coral/10 hover:!text-sagebright-coral"
                >
                  <Link to="#" className="flex items-center">
                    <HelpCircle className="text-sagebright-coral" />
                    <span>Ask Sage</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  tooltip="Onboarding Roadmap"
                  className="text-charcoal/70 font-medium transition-colors 
                  hover:!bg-sagebright-navy/10 hover:!text-sagebright-navy"
                >
                  <Link to="#" className="flex items-center">
                    <ListChecks className="text-sagebright-navy" />
                    <span>Onboarding Roadmap</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  tooltip="Schedules"
                  className="text-charcoal/70 font-medium transition-colors 
                  hover:!bg-sagebright-gold/10 hover:!text-sagebright-gold"
                >
                  <Link to="#" className="flex items-center">
                    <Calendar className="text-sagebright-gold" />
                    <span>Schedules</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  tooltip="People"
                  className="text-charcoal/70 font-medium transition-colors 
                  hover:!bg-sagebright-accent/10 hover:!text-sagebright-accent"
                >
                  <Link to="#" className="flex items-center">
                    <Users className="text-sagebright-accent" />
                    <span>People</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  tooltip="Settings"
                  className="text-charcoal/70 font-medium transition-colors 
                  hover:!bg-gray-200 hover:!text-charcoal"
                >
                  <Link to="#" className="flex items-center">
                    <Settings className="text-charcoal/70" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="border-t pt-2">
            <div className="px-3 py-2">
              <Button 
                variant="outline" 
                className="w-full justify-start text-charcoal/70 font-medium 
                hover:text-red-500 hover:border-red-200 transition-colors" 
                asChild
              >
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
