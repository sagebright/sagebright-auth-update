
import React, { useState } from 'react';
import { AdminDashboardLayout } from '../components/admin/AdminDashboardLayout';
import { AdminTopNavbar } from '../components/admin/AdminTopNavbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Breadcrumb, 
  BreadcrumbList, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbSeparator, 
  BreadcrumbPage 
} from '@/components/ui/breadcrumb';
import { UsersPanel } from '../components/admin/panels/UsersPanel';
import { DocumentsPanel } from '../components/admin/panels/DocumentsPanel';
import { IntegrationsPanel } from '../components/admin/panels/IntegrationsPanel';
import { EngagementQuestionsPanel } from '../components/admin/panels/EngagementQuestionsPanel';
import { Home, Users, FileText, Link2, MessageSquare } from 'lucide-react';
import { StatsRow } from '../components/admin/StatsRow';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('users');

  // Mapping for breadcrumb titles
  const tabTitles = {
    users: 'Users',
    documents: 'Documents',
    integrations: 'Integrations',
    engagement: 'Engagement Questions'
  };

  // Summary stats data
  const summaryStats = [
    {
      title: "Total Users",
      value: "1,274",
      icon: Users,
      change: "+12% from last month"
    },
    {
      title: "Active Onboardings",
      value: "42",
      icon: FileText,
      change: "+5% from last month"
    },
    {
      title: "Docs Uploaded",
      value: "326",
      icon: FileText,
      change: "+18% from last month"
    },
    {
      title: "Integrations Connected",
      value: "8",
      icon: Link2,
      change: "+2 from last month"
    }
  ];

  return (
    <AdminDashboardLayout>
      <div className="flex flex-col h-full">
        <AdminTopNavbar />
        
        <div className="flex-1 p-6 overflow-auto">
          {/* Summary Stats Row */}
          <div className="mb-6">
            <StatsRow stats={summaryStats} />
          </div>

          <Tabs 
            defaultValue="users" 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="mb-6 bg-background border">
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="integrations">Integrations</TabsTrigger>
              <TabsTrigger value="engagement">Engagement Questions</TabsTrigger>
            </TabsList>

            {/* Breadcrumb for each tab */}
            <Breadcrumb className="mb-4">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/admin-dashboard">
                    <Home className="h-4 w-4 mr-2" />
                    Admin
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{tabTitles[activeTab]}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            
            <TabsContent value="users" className="space-y-4">
              <UsersPanel />
            </TabsContent>
            
            <TabsContent value="documents" className="space-y-4">
              <DocumentsPanel />
            </TabsContent>
            
            <TabsContent value="integrations" className="space-y-4">
              <IntegrationsPanel />
            </TabsContent>
            
            <TabsContent value="engagement" className="space-y-4">
              <EngagementQuestionsPanel />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
