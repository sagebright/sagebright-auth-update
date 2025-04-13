
import React from 'react';
import { AdminSidebar } from './AdminSidebar';

interface AdminDashboardLayoutProps {
  children: React.ReactNode;
}

export function AdminDashboardLayout({ children }: AdminDashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Fixed Left Sidebar */}
      <div className="w-64 h-full bg-white border-r shadow-sm fixed left-0 top-0">
        <AdminSidebar />
      </div>
      
      {/* Main Content Area with left margin to account for fixed sidebar */}
      <div className="flex-1 ml-64 min-h-screen">
        {children}
      </div>
    </div>
  );
}
