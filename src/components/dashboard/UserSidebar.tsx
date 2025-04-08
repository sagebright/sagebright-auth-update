import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  SidebarContent, SidebarMenu, SidebarMenuItem, 
  SidebarMenuButton, SidebarHeader, SidebarFooter 
} from "@/components/ui/sidebar"; // This import path stays the same
import { 
  LayoutDashboard, HelpCircle, ListTodo, 
  Calendar, Users, Settings, LogOut 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth/AuthContext";

export default function UserSidebar() {
  const { signOut } = useAuth();
  const location = useLocation();

  return (
    <>
      <SidebarHeader className="border-b border-sagebright-accent/20 pb-0">
        <div className="flex items-center justify-center py-5">
          <img 
            src="/lovable-uploads/sb_logo_type.png" 
            alt="Sagebright" 
            className="h-12 w-auto"
            style={{ imageRendering: 'auto' }}
          />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="pt-4">
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              isActive={location.pathname === "/user-dashboard"} 
              tooltip="Dashboard"
              className="font-medium transition-all text-charcoal/70
              data-[active=true]:!bg-sagebright-accent/25 data-[active=true]:!text-sagebright-green 
              hover:!bg-sagebright-accent/25 hover:!text-sagebright-green hover:scale-[1.02]"
            >
              <Link to="/user-dashboard" className="flex items-center">
                <LayoutDashboard className="text-charcoal/70 group-hover:text-sagebright-green" />
                <span>Dashboard</span>
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
              tooltip="Onboarding Roadmap"
              className="text-charcoal/70 font-normal transition-all duration-200
              hover:!bg-sagebright-accent/25 hover:!text-sagebright-green hover:scale-[1.02]"
            >
              <Link to="#" className="flex items-center">
                <ListTodo className="text-charcoal/70 group-hover:text-sagebright-green" />
                <span>Onboarding Roadmap</span>
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
    </>
  );
}
