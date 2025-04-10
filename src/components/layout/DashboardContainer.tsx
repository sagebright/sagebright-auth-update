
import React, { memo, useMemo } from 'react';
import { cn } from "@/lib/utils";
import { AppShell } from './AppShell';
import UserSidebar from '@/components/dashboard/UserSidebar';
import AdminSidebar from '@/components/dashboard/AdminSidebar';
import { useLocation } from 'react-router-dom';

interface DashboardContainerProps {
  children: React.ReactNode;
  className?: string;
  showSagePanel?: boolean;
}

export const DashboardContainer = memo(function DashboardContainer({
  children,
  className,
  showSagePanel = true,
}: DashboardContainerProps) {
  const location = useLocation();
  const isAdminDashboard = location.pathname === "/hr-dashboard";

  // Memoize the sidebar content to prevent unnecessary re-renders
  const sidebarContent = useMemo(() => {
    return isAdminDashboard ? <AdminSidebar /> : <UserSidebar />;
  }, [isAdminDashboard]);

  return (
    <AppShell
      sidebarContent={sidebarContent}
      showSagePanel={showSagePanel}
      className={className}
    >
      <div className="p-4 md:p-8 h-full overflow-auto">
        {children}
      </div>
    </AppShell>
  );
});
