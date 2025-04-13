
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  RefreshCw, 
  ArrowRight, 
  Clock,
  Calendar 
} from 'lucide-react';

interface Integration {
  id: number;
  name: string;
  description: string;
  status: 'active' | 'error' | 'inactive' | 'pending';
  lastSync: string | null;
  syncFrequency: 'manual' | 'daily' | 'hourly' | 'real-time';
  icon: string;
}

interface IntegrationCardProps {
  integration: Integration;
  handleManualSync: (integrationId: number) => void;
}

export const renderStatusBadge = (status: string) => {
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

export const renderSyncFrequency = (integration: Integration) => {
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

export function IntegrationCard({ integration, handleManualSync }: IntegrationCardProps) {
  return (
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
  );
}
