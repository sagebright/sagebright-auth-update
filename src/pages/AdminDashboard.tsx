
import React, { useState } from 'react';
import { AdminDashboardLayout } from '../components/admin/AdminDashboardLayout';
import { AdminTopNavbar } from '../components/admin/AdminTopNavbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UsersPanel } from '../components/admin/panels/UsersPanel';
import { DocumentsPanel } from '../components/admin/panels/DocumentsPanel';
import { IntegrationsPanel } from '../components/admin/panels/IntegrationsPanel';
import { EngagementQuestionsPanel } from '../components/admin/panels/EngagementQuestionsPanel';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('users');

  return (
    <AdminDashboardLayout>
      <div className="flex flex-col h-full">
        <AdminTopNavbar />
        
        <div className="flex-1 p-6 overflow-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your organization's settings and data</p>
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
