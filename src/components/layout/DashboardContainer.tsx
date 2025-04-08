
import React from 'react';
import { cn } from "@/lib/utils";
import { AppShell } from './AppShell';
import { UserSidebar } from '@/components/dashboard/UserSidebar';
import { AdminSidebar } from '@/components/dashboard/AdminSidebar';
import { useLocation } from 'react-router-dom';

interface DashboardContainerProps {
  children: React.ReactNode;
  className?: string;
  showSagePanel?: boolean;
}

export function DashboardContainer({
  children,
  className,
  showSagePanel = true,
}: DashboardContainerProps) {
  const location = useLocation();
  const isAdminDashboard = location.pathname === "/hr-dashboard";

  return (
    <AppShell
      sidebarContent={isAdminDashboard ? <AdminSidebar /> : <UserSidebar />}
      showSagePanel={showSagePanel}
      className={className}
    >
      <div className="p-4 md:p-8 h-full overflow-auto">
        {children}
      </div>
    </AppShell>
  );
}
