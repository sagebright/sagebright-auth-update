
import React from "react";
import { useLocation } from "react-router-dom";
import { SidebarProvider, Sidebar } from "@/components/ui/sidebar"; // This import path stays the same
import { useAuth } from "@/contexts/AuthContext";
import UserSidebar from "./UserSidebar";
import AdminSidebar from "./AdminSidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation();
  const isAdminDashboard = location.pathname === "/hr-dashboard";

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gray-50">
        <Sidebar>
          {isAdminDashboard ? <AdminSidebar /> : <UserSidebar />}
        </Sidebar>
        <div className="flex flex-col flex-1 overflow-hidden">
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
}
