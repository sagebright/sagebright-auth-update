
import { useAuth } from '@/contexts/auth/AuthContext';

/**
 * Debug component to display authentication state in development environments
 * This component is only rendered in development and testing environments
 */
export const AuthDebug = () => {
  // Skip rendering in production
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  const auth = useAuth();

  return (
    <div className="fixed bottom-0 right-0 max-w-xs p-2 bg-black/80 text-white text-xs z-50 overflow-hidden rounded-tl-md">
      <div className="font-semibold mb-1">Auth Debug (Non-Production)</div>
      <div className="space-y-1 overflow-auto max-h-[300px]">
        <div><span className="opacity-70">User ID:</span> {auth.userId || 'none'}</div>
        <div><span className="opacity-70">Org ID:</span> {auth.orgId || 'none'}</div>
        <div><span className="opacity-70">Org Slug:</span> {auth.orgSlug || 'none'}</div>
        <div><span className="opacity-70">Ready:</span> {auth.sessionUserReady ? 'yes' : 'no'}</div>
        <div><span className="opacity-70">Authenticated:</span> {auth.isAuthenticated ? 'yes' : 'no'}</div>
        <div><span className="opacity-70">Loading:</span> {auth.loading ? 'yes' : 'no'}</div>
        <div><span className="opacity-70">Session:</span> {auth.session ? 'active' : 'none'}</div>
        <div><span className="opacity-70">User Role:</span> {auth.user?.user_metadata?.role || 'none'}</div>
      </div>
    </div>
  );
};

export default AuthDebug;
