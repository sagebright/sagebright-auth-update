
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  SidebarContent, SidebarMenu, SidebarMenuItem, 
  SidebarMenuButton, SidebarHeader, SidebarFooter 
} from "@/components/ui/sidebar";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth/AuthContext";

export interface SidebarItem {
  path: string;
  label: string;
  icon: React.ElementType;
  isActive?: (path: string) => boolean;
}

interface BaseSidebarProps {
  items: SidebarItem[];
}

export const BaseSidebar: React.FC<BaseSidebarProps> = ({ items }) => {
  const { signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Enhanced navigation handler that prevents default and uses navigate
  const handleNavigation = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    console.log(`🧭 Navigating to: ${path} from current path: ${location.pathname}`);
    navigate(path);
  };

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
          {items.map((item, index) => (
            <SidebarMenuItem key={index}>
              <SidebarMenuButton 
                asChild 
                isActive={item.isActive ? item.isActive(location.pathname) : location.pathname === item.path} 
                tooltip={item.label}
                className={index === 0 
                  ? "font-medium transition-all text-charcoal/70 data-[active=true]:!bg-sagebright-accent/25 data-[active=true]:!text-sagebright-green hover:!bg-sagebright-accent/25 hover:!text-sagebright-green hover:scale-[1.02]"
                  : "text-charcoal/70 font-normal transition-all duration-200 hover:!bg-sagebright-accent/25 hover:!text-sagebright-green hover:scale-[1.02] data-[active=true]:!bg-sagebright-accent/25 data-[active=true]:!text-sagebright-green"
                }
              >
                <a 
                  href={item.path} 
                  className="flex items-center"
                  onClick={(e) => handleNavigation(e, item.path)}
                >
                  <item.icon className="text-charcoal/70 group-hover:text-sagebright-green" />
                  <span>{item.label}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
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
};
