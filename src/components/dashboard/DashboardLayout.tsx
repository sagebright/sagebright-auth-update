
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
          <SidebarHeader className="border-b border-sagebright-accent/20 pb-0">
            <div className="flex items-center justify-center py-5">
              <img 
                src="/lovable-uploads/sb_logo_type.svg" 
                alt="Sagebright" 
                className="h-12 w-auto" 
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
                  className="!bg-sagebright-accent/20 font-medium transition-colors text-sagebright-green
                  data-[active=true]:!bg-sagebright-accent/25 data-[active=true]:!text-sagebright-green 
                  hover:!bg-sagebright-accent/25 hover:!text-sagebright-green"
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
                  hover:!bg-bittersweet/10 hover:!text-bittersweet"
                >
                  <Link to="#" className="flex items-center">
                    <HelpCircle className="text-bittersweet" />
                    <span>Ask Sage</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  tooltip="Onboarding Roadmap"
                  className="text-charcoal/70 font-medium transition-colors 
                  hover:!bg-charcoal/10 hover:!text-charcoal"
                >
                  <Link to="#" className="flex items-center">
                    <ListChecks className="text-charcoal" />
                    <span>Onboarding Roadmap</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  tooltip="Schedules"
                  className="text-charcoal/70 font-medium transition-colors 
                  hover:!bg-sunglow/10 hover:!text-sunglow"
                >
                  <Link to="#" className="flex items-center">
                    <Calendar className="text-sunglow" />
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
          <SidebarFooter className="border-t border-sagebright-accent/20 pt-2">
            <div className="px-3 py-2">
              <Button 
                variant="outline" 
                className="w-full justify-start text-charcoal/70 font-medium 
                hover:text-bittersweet hover:border-bittersweet/20 transition-colors" 
                asChild
              >
                <Link to="/">
                  <LogOut className="mr-2 h-4 w-4 text-bittersweet" />
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
