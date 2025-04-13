
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Link as LinkIcon, 
  MessageSquare, 
  Home,
  Settings,
  HelpCircle
} from 'lucide-react';
import { useLocation } from 'react-router-dom';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
}

function SidebarItem({ icon, label, href, active }: SidebarItemProps) {
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center px-4 py-3 text-sm font-medium rounded-md",
        active 
          ? "bg-primary/10 text-primary" 
          : "text-gray-700 hover:bg-gray-100"
      )}
    >
      <span className="mr-3 h-5 w-5">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}

export function AdminSidebar() {
  const location = useLocation();
  
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-4 border-b">
        <Link to="/" className="flex items-center">
          <span className="text-xl font-bold text-primary">SageBright</span>
        </Link>
      </div>
      
      {/* Navigation Links */}
      <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        <SidebarItem 
          icon={<Home size={18} />} 
          label="Back to App" 
          href="/user-dashboard" 
        />
        
        <SidebarItem 
          icon={<LayoutDashboard size={18} />} 
          label="Dashboard" 
          href="/admin-dashboard" 
          active={location.pathname === '/admin-dashboard'}
        />
        
        <SidebarItem 
          icon={<Users size={18} />} 
          label="Users" 
          href="/admin-dashboard?tab=users" 
        />
        
        <SidebarItem 
          icon={<FileText size={18} />} 
          label="Documents" 
          href="/admin-dashboard?tab=documents" 
        />
        
        <SidebarItem 
          icon={<LinkIcon size={18} />} 
          label="Integrations" 
          href="/admin-dashboard?tab=integrations" 
        />
        
        <SidebarItem 
          icon={<MessageSquare size={18} />} 
          label="Engagement" 
          href="/admin-dashboard?tab=engagement" 
        />
        
        <SidebarItem 
          icon={<Settings size={18} />} 
          label="Settings" 
          href="/admin-settings" 
        />
        
        <SidebarItem 
          icon={<HelpCircle size={18} />} 
          label="Help" 
          href="#" 
        />
      </div>
      
      {/* User */}
      <div className="p-4 border-t">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">
            A
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium">Admin User</p>
            <p className="text-xs text-gray-500">admin@sagebright.ai</p>
          </div>
        </div>
      </div>
    </div>
  );
}
