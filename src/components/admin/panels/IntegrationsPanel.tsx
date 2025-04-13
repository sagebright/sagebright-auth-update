
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link2, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

export function IntegrationsPanel() {
  // Sample integration data
  const integrations = [
    {
      id: 1,
      name: 'Slack',
      description: 'Connect Sage to your Slack workspace for automated updates.',
      connected: true,
      icon: '🔗',
    },
    {
      id: 2,
      name: 'Google Workspace',
      description: 'Sync with Google Calendar and Drive for document access.',
      connected: true,
      icon: '📅',
    },
    {
      id: 3,
      name: 'Microsoft Teams',
      description: 'Connect Sage to Microsoft Teams for collaborative onboarding.',
      connected: false,
      icon: '👥',
    },
    {
      id: 4,
      name: 'Zendesk',
      description: 'Connect your help desk for seamless support ticket creation.',
      connected: false,
      icon: '🎫',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-medium">Available Integrations</h2>
          <p className="text-sm text-muted-foreground">Connect Sage to your favorite tools</p>
        </div>
        <Button variant="outline">
          <Link2 className="h-4 w-4 mr-2" />
          Explore More Integrations
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {integrations.map((integration) => (
          <Card key={integration.id} className="flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <span className="text-2xl mr-2">{integration.icon}</span>
                  <CardTitle>{integration.name}</CardTitle>
                </div>
                {integration.connected ? (
                  <span className="flex items-center text-xs text-green-600 font-medium">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Connected
                  </span>
                ) : (
                  <span className="flex items-center text-xs text-gray-500 font-medium">
                    <XCircle className="h-3 w-3 mr-1" />
                    Not Connected
                  </span>
                )}
              </div>
              <CardDescription>{integration.description}</CardDescription>
            </CardHeader>
            <CardFooter className="mt-auto">
              <Button 
                variant={integration.connected ? "outline" : "default"} 
                size="sm" 
                className="w-full mt-2"
              >
                {integration.connected ? "Manage Connection" : "Connect"}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
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
