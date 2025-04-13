
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Link2, 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  RefreshCw, 
  ArrowRight, 
  Clock,
  Calendar 
} from 'lucide-react';

export function IntegrationsPanel() {
  const [activeTab, setActiveTab] = useState('available');
  
  // Sample integration data
  const integrations = [
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

  // Function to render the appropriate status badge
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return (
          <Badge variant="success" className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Active
          </Badge>
        );
      case 'error':
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Error
          </Badge>
        );
      case 'inactive':
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            Not Connected
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="warning" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Setup Pending
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            Unknown
          </Badge>
        );
    }
  };

  // Function to render the sync frequency selector
  const renderSyncFrequency = (integration) => {
    return (
      <div className="flex items-center mt-2">
        <span className="text-xs text-muted-foreground mr-2">Sync:</span>
        <select 
          className="text-xs bg-background border rounded px-2 py-1"
          value={integration.syncFrequency}
          onChange={(e) => console.log(`Changed ${integration.name} sync to ${e.target.value}`)}
          disabled={integration.status !== 'active'}
        >
          <option value="manual">Manual</option>
          <option value="daily">Daily</option>
          <option value="hourly">Hourly</option>
          <option value="real-time">Real-time</option>
        </select>
      </div>
    );
  };

  // Function to handle manual sync
  const handleManualSync = (integrationId) => {
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
          <div className="grid grid-cols-1 gap-4">
            {integrations.map((integration) => (
              <Card key={integration.id} className="overflow-hidden">
                <div className="flex border-b border-border">
                  <div className="flex-1 p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <span className="text-2xl mr-2">{integration.icon}</span>
                        <div>
                          <h3 className="font-medium">{integration.name}</h3>
                          <p className="text-sm text-muted-foreground">{integration.description}</p>
                        </div>
                      </div>
                      <div>
                        {renderStatusBadge(integration.status)}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 border-b border-border">
                  <div className="p-4 border-r border-border">
                    <h4 className="text-sm font-medium mb-1">Last Sync</h4>
                    <div className="flex items-center text-sm">
                      {integration.lastSync ? (
                        <>
                          <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                          <span>{integration.lastSync}</span>
                        </>
                      ) : (
                        <span className="text-muted-foreground">Never</span>
                      )}
                    </div>
                    
                    {integration.status === 'active' && (
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="mt-2"
                        onClick={() => handleManualSync(integration.id)}
                      >
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Sync Now
                      </Button>
                    )}
                  </div>
                  
                  <div className="p-4 border-r border-border">
                    <h4 className="text-sm font-medium mb-1">Sync Frequency</h4>
                    {renderSyncFrequency(integration)}
                  </div>
                  
                  <div className="p-4">
                    <h4 className="text-sm font-medium mb-1">Status</h4>
                    <p className="text-sm text-muted-foreground">
                      {integration.status === 'active' && 'Connected and syncing data.'}
                      {integration.status === 'error' && 'Connection error. Authentication failed.'}
                      {integration.status === 'inactive' && 'Not currently connected.'}
                      {integration.status === 'pending' && 'Setup started but not completed.'}
                    </p>
                  </div>
                </div>
                
                <CardFooter className="flex justify-end p-4">
                  <Button 
                    variant={integration.status === 'active' ? "outline" : "default"} 
                    size="sm"
                  >
                    {integration.status === 'active' ? "Edit Configuration" : 
                     integration.status === 'error' ? "Troubleshoot" : "Set Up Integration"}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="configured" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 gap-4">
            {integrations
              .filter(int => int.status === 'active' || int.status === 'error')
              .map((integration) => (
                <Card key={integration.id} className="overflow-hidden">
                  {/* Same card content as above, but filtered to show only configured integrations */}
                  <div className="flex border-b border-border">
                    <div className="flex-1 p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center">
                          <span className="text-2xl mr-2">{integration.icon}</span>
                          <div>
                            <h3 className="font-medium">{integration.name}</h3>
                            <p className="text-sm text-muted-foreground">{integration.description}</p>
                          </div>
                        </div>
                        <div>
                          {renderStatusBadge(integration.status)}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 border-b border-border">
                    <div className="p-4 border-r border-border">
                      <h4 className="text-sm font-medium mb-1">Last Sync</h4>
                      <div className="flex items-center text-sm">
                        {integration.lastSync ? (
                          <>
                            <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                            <span>{integration.lastSync}</span>
                          </>
                        ) : (
                          <span className="text-muted-foreground">Never</span>
                        )}
                      </div>
                      
                      {integration.status === 'active' && (
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="mt-2"
                          onClick={() => handleManualSync(integration.id)}
                        >
                          <RefreshCw className="h-3 w-3 mr-1" />
                          Sync Now
                        </Button>
                      )}
                    </div>
                    
                    <div className="p-4 border-r border-border">
                      <h4 className="text-sm font-medium mb-1">Sync Frequency</h4>
                      {renderSyncFrequency(integration)}
                    </div>
                    
                    <div className="p-4">
                      <h4 className="text-sm font-medium mb-1">Status</h4>
                      <p className="text-sm text-muted-foreground">
                        {integration.status === 'active' && 'Connected and syncing data.'}
                        {integration.status === 'error' && 'Connection error. Authentication failed.'}
                        {integration.status === 'inactive' && 'Not currently connected.'}
                        {integration.status === 'pending' && 'Setup started but not completed.'}
                      </p>
                    </div>
                  </div>
                  
                  <CardFooter className="flex justify-end p-4">
                    <Button 
                      variant={integration.status === 'active' ? "outline" : "default"} 
                      size="sm"
                    >
                      {integration.status === 'active' ? "Edit Configuration" : 
                      integration.status === 'error' ? "Troubleshoot" : "Set Up Integration"}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>
      
      <Card>
        <CardHeader>
          <CardTitle>API Access</CardTitle>
          <CardDescription>Manage API keys and access for developers.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border p-8 flex justify-center items-center">
            <div className="text-center">
              <Link2 className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <h3 className="text-lg font-medium">API Key Management</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                This is a placeholder for API key management where you could create, revoke, and monitor usage of API keys.
              </p>
              <Button variant="outline" className="mt-4">Generate New API Key</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
