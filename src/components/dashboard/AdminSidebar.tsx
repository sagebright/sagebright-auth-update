
import React from "react";
import { 
  LayoutDashboard, HelpCircle, ListChecks, 
  Calendar, Users, Settings
} from "lucide-react";
import { BaseSidebar, type SidebarItem } from "./BaseSidebar";

export default function AdminSidebar() {
  const adminItems: SidebarItem[] = [
    {
      path: "/hr-dashboard",
      label: "Admin Dashboard",
      icon: LayoutDashboard,
    },
    {
      path: "/ask-sage",
      label: "Ask Sage",
      icon: HelpCircle,
    },
    {
      path: "#",
      label: "Reports",
      icon: ListChecks,
    },
    {
      path: "#",
      label: "Schedules",
      icon: Calendar,
    },
    {
      path: "#",
      label: "People",
      icon: Users,
    },
    {
      path: "#",
      label: "Settings",
      icon: Settings,
    }
  ];

  return <BaseSidebar items={adminItems} />;
}
