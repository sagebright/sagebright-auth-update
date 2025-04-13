
import React from "react";
import { 
  LayoutDashboard, HelpCircle, ListTodo, 
  Calendar, Users, Settings
} from "lucide-react";
import { BaseSidebar, type SidebarItem } from "./BaseSidebar";

export default function UserSidebar() {
  const userItems: SidebarItem[] = [
    {
      path: "/user-dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      path: "/ask-sage",
      label: "Ask Sage",
      icon: HelpCircle,
    },
    {
      path: "#",
      label: "Onboarding Roadmap",
      icon: ListTodo,
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

  return <BaseSidebar items={userItems} />;
}
