
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link2 } from 'lucide-react';
import { IntegrationList } from './integrations/IntegrationList';
import { ApiAccessSection } from './integrations/ApiAccessSection';
import { Integration } from './integrations/types';

export function IntegrationsPanel() {
  const [activeTab, setActiveTab] = useState('available');
  
  // Sample integration data
  const integrations: Integration[] = [
    {
      id: 1,
      name: 'Slack',
      description: 'Connect Sage to your Slack workspace for automated updates.',
      status: 'active',
      lastSync: '2025-04-13 09:30 AM',
      syncFrequency: 'daily',
      icon: '🔗',
    },
    {
      id: 2,
      name: 'Google Workspace',
      description: 'Sync with Google Calendar and Drive for document access.',
      status: 'active',
      lastSync: '2025-04-12 11:45 PM',
      syncFrequency: 'real-time',
      icon: '📅',
    },
    {
      id: 3,
      name: 'Microsoft Teams',
      description: 'Connect Sage to Microsoft Teams for collaborative onboarding.',
      status: 'error',
      lastSync: '2025-04-10 03:22 PM',
      syncFrequency: 'manual',
      icon: '👥',
    },
    {
      id: 4,
      name: 'Zendesk',
      description: 'Connect your help desk for seamless support ticket creation.',
      status: 'inactive',
      lastSync: null,
      syncFrequency: 'daily',
      icon: '🎫',
    },
    {
      id: 5,
      name: 'Zapier',
      description: 'Create workflows with thousands of apps through Zapier.',
      status: 'pending',
      lastSync: null,
      syncFrequency: 'manual',
      icon: '⚡',
    }
  ];

  // Function to handle manual sync
  const handleManualSync = (integrationId: number) => {
    console.log(`Manual sync triggered for integration ${integrationId}`);
    // In a real app, this would trigger an API call to sync the integration
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-medium">System Integrations</h2>
          <p className="text-sm text-muted-foreground">Connect Sage to your favorite tools</p>
        </div>
        <Button variant="outline">
          <Link2 className="h-4 w-4 mr-2" />
          Add New Integration
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="available">Available Integrations</TabsTrigger>
          <TabsTrigger value="configured">Configured</TabsTrigger>
        </TabsList>
        
        <TabsContent value="available" className="space-y-4 mt-4">
          <IntegrationList 
            integrations={integrations} 
            handleManualSync={handleManualSync} 
          />
        </TabsContent>
        
        <TabsContent value="configured" className="space-y-4 mt-4">
          <IntegrationList 
            integrations={integrations} 
            filter="configured"
            handleManualSync={handleManualSync} 
          />
        </TabsContent>
      </Tabs>
      
      <ApiAccessSection />
    </div>
  );
}
