
import React from 'react';
import { IntegrationCard } from './IntegrationCard';

interface Integration {
  id: number;
  name: string;
  description: string;
  status: 'active' | 'error' | 'inactive' | 'pending';
  lastSync: string | null;
  syncFrequency: 'manual' | 'daily' | 'hourly' | 'real-time';
  icon: string;
}

interface IntegrationListProps {
  integrations: Integration[];
  filter?: string;
  handleManualSync: (integrationId: number) => void;
}

export function IntegrationList({ integrations, filter, handleManualSync }: IntegrationListProps) {
  const filteredIntegrations = filter === 'configured' 
    ? integrations.filter(int => int.status === 'active' || int.status === 'error')
    : integrations;

  return (
    <div className="grid grid-cols-1 gap-4">
      {filteredIntegrations.map((integration) => (
        <IntegrationCard 
          key={integration.id} 
          integration={integration} 
          handleManualSync={handleManualSync} 
        />
      ))}
    </div>
  );
}
