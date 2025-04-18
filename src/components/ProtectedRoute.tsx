
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useAuthCheck } from '@/hooks/useAuthCheck';
import { useOrgRedirect } from '@/hooks/useOrgRedirect';
import { useRedirectIntentManager } from '@/lib/redirect-intent';
import { getVoiceFromUrl } from '@/lib/utils';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  requiredPermission?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole,
  requiredPermission 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, isAuthenticated, user, orgId, orgSlug } = useRequireAuth(navigate);
  const { captureIntent, activeIntent, status: intentStatus } = useRedirectIntentManager({
    enableLogging: true,
    defaultPriority: 2 // Higher priority for auth protection intents
  });
  
  // Extract voice param if present
  const voiceParam = getVoiceFromUrl(location.search);

  // Check authentication and permissions
  useAuthCheck({
    user,
    loading,
    isAuthenticated,
    requiredRole,
    requiredPermission,
    navigate,
    pathname: location.pathname + location.search
  });

  // Use the updated useOrgRedirect hook - now returns redirectAttempted state
  const { redirectAttempted } = useOrgRedirect();
  
  // Enhanced logging for protected route rendering
  console.log(`🛡️ ProtectedRoute rendering: [path: ${location.pathname}] [authenticated: ${isAuthenticated}] [loading: ${loading}] [redirectAttempted: ${redirectAttempted}] [intentStatus: ${intentStatus}] [activeIntent: ${activeIntent?.destination || 'none'}]`);
  
  // Capture redirect intent if not authenticated and not loading with enhanced metadata
  useEffect(() => {
    if (!isAuthenticated && !loading && !redirectAttempted) {
      console.log(`🔒 Capturing intent for protected route: ${location.pathname}${location.search}`);
      
      // Create enhanced metadata with more context
      const metadata = {
        voiceParam: voiceParam !== 'default' ? voiceParam : undefined,
        source: 'protected_route',
        timestamp: Date.now(),
        pathname: location.pathname,
        originalSearch: location.search
      };
      
      // Set a high priority (3) for auth-based redirects since these are critical path
      captureIntent(
        location.pathname + location.search,
        'auth',
        metadata,
        3
      );
    }
  }, [isAuthenticated, loading, location.pathname, location.search, captureIntent, redirectAttempted, voiceParam]);
  
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        <span className="ml-2 text-primary">Loading...</span>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }
  
  console.log("✅ ProtectedRoute access granted for path:", location.pathname);
  
  return <>{children}</>;
};

export default ProtectedRoute;
