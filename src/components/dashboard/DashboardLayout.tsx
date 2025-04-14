
import React from "react";
import { useLocation } from "react-router-dom";
import { SidebarProvider, Sidebar } from "@/components/ui/sidebar"; // This import path stays the same
import { useAuth } from "@/contexts/auth/AuthContext";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation();
  const { user } = useAuth();
  
  // Determine if we should show admin sidebar based on path OR role
  const isAdminView = location.pathname === "/hr-dashboard" || 
                      location.pathname === "/admin-dashboard" || 
                      user?.user_metadata?.role === "admin";
  
  // Use dynamic imports to load the appropriate sidebar component
  const SidebarComponent = React.lazy(() => 
    isAdminView 
      ? import("./AdminSidebar") 
      : import("./UserSidebar")
  );

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gray-50">
        <Sidebar>
          <React.Suspense fallback={<div className="p-4">Loading sidebar...</div>}>
            <SidebarComponent />
          </React.Suspense>
        </Sidebar>
        <div className="flex flex-col flex-1 overflow-hidden">
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
}
