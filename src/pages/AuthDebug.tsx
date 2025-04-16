
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthContext';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useOrgContext } from '@/contexts/auth/hooks/useOrgContext';

const StatusBadge = ({ status }: { status: 'success' | 'warning' | 'error' }) => {
  const variants = {
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500'
  };

  const icons = {
    success: '✅',
    warning: '⚠️',
    error: '⛔️'
  };

  return (
    <Badge className={variants[status]}>
      {icons[status]}
    </Badge>
  );
};

const InfoCard = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <Card className="p-4 mb-4">
    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
      {title}
    </h3>
    <div className="space-y-2">
      {children}
    </div>
  </Card>
);

const DataRow = ({ label, value, status }: { label: string, value: string | null | undefined, status?: 'success' | 'warning' | 'error' }) => (
  <div className="flex items-center justify-between py-1">
    <span className="text-sm text-muted-foreground">{label}:</span>
    <div className="flex items-center gap-2">
      <span className="font-mono text-sm">{value || 'Not set'}</span>
      {status && <StatusBadge status={status} />}
    </div>
  </div>
);

const AuthDebug = () => {
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { orgSlug } = useOrgContext(user?.id, isAuthenticated);
  const [redirectPath, setRedirectPath] = useState<string | null>(null);

  useEffect(() => {
    setRedirectPath(localStorage.getItem('redirectAfterLogin'));
  }, []);

  const getVoiceParam = () => {
    const params = new URLSearchParams(location.search);
    return params.get('voice');
  };

  return (
    <div className="container max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Auth & Routing Debug</h1>

      <InfoCard title="🧭 Routing State">
        <DataRow 
          label="Current Path" 
          value={location.pathname}
          status={location.pathname ? 'success' : 'error'}
        />
        <DataRow 
          label="Search Params" 
          value={location.search}
          status={location.search ? 'success' : 'warning'}
        />
        <DataRow 
          label="Stored Redirect" 
          value={redirectPath}
          status={redirectPath ? 'success' : 'warning'}
        />
      </InfoCard>

      <InfoCard title="👤 Session State">
        <DataRow 
          label="User ID" 
          value={user?.id}
          status={user?.id ? 'success' : 'error'}
        />
        <DataRow 
          label="User Role" 
          value={user?.user_metadata?.role}
          status={user?.user_metadata?.role ? 'success' : 'warning'}
        />
        <DataRow 
          label="Authentication" 
          value={isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
          status={isAuthenticated ? 'success' : 'error'}
        />
      </InfoCard>

      <InfoCard title="🏢 Organization">
        <DataRow 
          label="Org Slug" 
          value={orgSlug}
          status={orgSlug ? 'success' : 'warning'}
        />
      </InfoCard>

      <InfoCard title="🎤 Voice Parameters">
        <DataRow 
          label="Voice Param" 
          value={getVoiceParam()}
          status={getVoiceParam() ? 'success' : 'warning'}
        />
      </InfoCard>
    </div>
  );
};

export default AuthDebug;
