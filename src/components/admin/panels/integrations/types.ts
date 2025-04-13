
export interface Integration {
  id: number;
  name: string;
  description: string;
  status: 'active' | 'error' | 'inactive' | 'pending';
  lastSync: string | null;
  syncFrequency: 'manual' | 'daily' | 'hourly' | 'real-time';
  icon: string;
}
