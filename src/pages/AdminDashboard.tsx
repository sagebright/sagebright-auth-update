
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
import { Home } from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('users');

  // Mapping for breadcrumb titles
  const tabTitles = {
    users: 'Users',
    documents: 'Documents',
    integrations: 'Integrations',
    engagement: 'Engagement Questions'
  };

  return (
    <AdminDashboardLayout>
      <div className="flex flex-col h-full">
        <AdminTopNavbar />
        
        <div className="flex-1 p-6 overflow-auto">
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

            {/* Page Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold">{tabTitles[activeTab]}</h1>
              <p className="text-muted-foreground">
                {activeTab === 'users' && 'Manage user accounts and onboarding'}
                {activeTab === 'documents' && 'View and manage organizational documents'}
                {activeTab === 'integrations' && 'Configure system integrations'}
                {activeTab === 'engagement' && 'Review and modify engagement questions'}
              </p>
            </div>
            
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
