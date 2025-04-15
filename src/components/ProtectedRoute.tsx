import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useRouteProtection, ROLE_LANDING_PAGES } from '@/hooks/useRouteProtection';
import { useRedirectLogic } from '@/hooks/useRedirectLogic';
import { getOrgFromUrl, redirectToOrgUrl } from '@/lib/subdomainUtils';
import { toast } from '@/components/ui/use-toast';
import { checkAuth } from '@/lib/supabaseClient';

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
  const [initialCheckComplete, setInitialCheckComplete] = useState(false);
  const [hasVerifiedSession, setHasVerifiedSession] = useState(false);
  const redirectAttempted = useRef(false);
  const protectionPropsChecked = useRef(false);
  
  const {
    redirectInProgressRef,
    userDashboardRedirectBlocker,
    locationRef,
    sessionStabilizedRef
  } = useRouteProtection(navigate);
  
  const { safeRedirect } = useRedirectLogic(
    navigate,
    locationRef,
    userDashboardRedirectBlocker,
    redirectInProgressRef,
    () => {}
  );
  
  useEffect(() => {
    if (!hasVerifiedSession) {
      const verifySession = async () => {
        try {
          const isValidSession = await checkAuth();
          console.log("🔐 Manual session validation in ProtectedRoute:", { isValidSession });
          
          if (!isValidSession && !redirectAttempted.current) {
            redirectAttempted.current = true;
            console.log("🔑 Session validation failed, redirecting to login");
            localStorage.setItem("redirectAfterLogin", location.pathname + location.search);
            navigate('/auth/login', { replace: true });
            return;
          }
          
          setHasVerifiedSession(true);
        } catch (error) {
          console.error("❌ Error verifying session:", error);
        }
      };
      
      if (!loading && !isAuthenticated) {
        verifySession();
      } else {
        setHasVerifiedSession(true);
      }
    }
  }, [hasVerifiedSession, loading, isAuthenticated, location, navigate]);
  
  useEffect(() => {
    if (!isAuthenticated && !redirectAttempted.current) {
      const fullPath = location.pathname + location.search;
      if (!localStorage.getItem("redirectAfterLogin") && 
          location.pathname !== '/' && 
          !location.pathname.startsWith('/auth')) {
        console.log("📝 Storing redirect path:", fullPath);
        localStorage.setItem("redirectAfterLogin", fullPath);
      }
    }
  }, [location, isAuthenticated]);
  
  useEffect(() => {
    if (location.search && location.search.includes('voice=')) {
      localStorage.setItem("preserveSearchParams", location.search);
      localStorage.setItem("redirectAfterLogin", location.pathname + location.search);
      console.log("📝 Stored voice param and redirect path:", location.pathname + location.search);
    }
  }, [location]);
  
  useEffect(() => {
    if (!loading && !initialCheckComplete) {
      setInitialCheckComplete(true);
    }
  }, [loading, initialCheckComplete]);
  
  const shouldPreventRouteRedirect = (path: string): boolean => {
    if (location.pathname !== '/' && 
        location.pathname !== '/auth/login' && 
        !location.pathname.startsWith('/auth/')) {
      console.log(`🛑 Preventing unwanted redirect: Current path ${location.pathname} is valid`);
      return true;
    }

    if ((location.pathname === '/ask-sage' && path === '/user-dashboard') ||
        (location.pathname === '/user-dashboard' && path === '/ask-sage')) {
      console.log(`🛑 Preventing unwanted redirect: ${location.pathname} → ${path}`);
      return true;
    }
    
    if (location.pathname === '/hr-dashboard' && path === '/hr-dashboard') {
      return true;
    }
    
    if (location.pathname === '/admin-dashboard' && path === '/admin-dashboard') {
      return true;
    }
    
    return false;
  };
  
  useEffect(() => {
    if (!initialCheckComplete || protectionPropsChecked.current || !isAuthenticated || !user) {
      return;
    }
    
    if (!sessionStabilizedRef.current) {
      console.log("⏳ ProtectedRoute waiting for session to stabilize before role checks");
      return;
    }
    
    protectionPropsChecked.current = true;
    
    if (requiredRole) {
      const userRole = user?.user_metadata?.role || 'user';
      
      if (userRole !== requiredRole) {
        console.log("🚫 User lacks required role:", requiredRole, "Current role:", userRole);
        
        toast({
          variant: "destructive",
          title: "Access denied",
          description: `You need ${requiredRole} access for this page.`
        });
        
        const fallbackPath = userRole === 'admin' ? '/hr-dashboard' : '/ask-sage';
        
        if (!shouldPreventRouteRedirect(fallbackPath) && !redirectAttempted.current) {
          redirectAttempted.current = true;
          navigate(fallbackPath, { replace: true });
        }
        return;
      }
    }
    
    if (requiredPermission && 
        (!user?.user_metadata?.permissions || 
        !user.user_metadata.permissions.includes(requiredPermission))) {
      console.log("🚫 User lacks required permission:", requiredPermission);
      
      toast({
        variant: "destructive",
        title: "Access denied",
        description: "You don't have permission to access this page."
      });
      
      const userRole = user?.user_metadata?.role || 'user';
      const fallbackPath = userRole === 'admin' ? '/hr-dashboard' : '/ask-sage';
      
      if (!shouldPreventRouteRedirect(fallbackPath) && !redirectAttempted.current) {
        redirectAttempted.current = true;
        navigate(fallbackPath, { replace: true });
      }
      return;
    }
  }, [initialCheckComplete, isAuthenticated, user, requiredRole, requiredPermission, navigate, location.pathname, sessionStabilizedRef]);
  
  useEffect(() => {
    const currentOrgSlug = getOrgFromUrl();
    
    if (initialCheckComplete && orgSlug && !redirectAttempted.current && isAuthenticated) {
      if (orgSlug && (!currentOrgSlug || currentOrgSlug !== orgSlug)) {
        console.log("🏢 ProtectedRoute redirecting to correct org subdomain:", orgSlug);
        redirectAttempted.current = true;
        sessionStorage.setItem('lastAuthenticatedPath', location.pathname + location.search);
        redirectToOrgUrl(orgSlug);
      }
    }
    
    if (currentOrgSlug && !loading && !isAuthenticated && !redirectAttempted.current) {
      console.log("🔑 On subdomain but not authenticated, redirecting to login");
      redirectAttempted.current = true;
      navigate('/auth/login', { replace: true });
    }
  }, [initialCheckComplete, orgSlug, location, isAuthenticated, loading, navigate]);
  
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
}

export default ProtectedRoute;
