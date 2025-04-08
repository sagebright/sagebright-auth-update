
import { useEffect, useState } from 'react';
import { useLocation, NavigateFunction } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { getOrgFromUrl, redirectToOrgUrl } from '@/lib/subdomainUtils';

export function useRequireAuth(navigate: NavigateFunction) {
  const [user, setUser] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [orgId, setOrgId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    console.log("🔐 useRequireAuth running on:", location.pathname);

    // Skip auth check on public routes or if we're already on an auth route
    if (location.pathname.startsWith("/auth")) {
      setLoading(false);
      return;
    }

    let isMounted = true;
    
    const checkAuth = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        console.log("🧑‍💻 Supabase user returned:", user);
        console.log("📦 Supabase session returned:", session);

        if (error || sessionError || !user || !session) {
          // Only redirect to login if we're not already on an auth route
          if (!location.pathname.startsWith("/auth")) {
            // Store the full URL with search params for redirect after login
            const fullPath = location.pathname + location.search;
            console.log("📝 Storing redirect path:", fullPath);
            localStorage.setItem("redirectAfterLogin", fullPath);
            
            if (isMounted) {
              navigate('/auth/login', { replace: true });
              setIsAuthenticated(false);
            }
          }
        } else if (isMounted) {
          const extractedOrgId = user.user_metadata?.org_id;

          if (!extractedOrgId) {
            console.warn("⚠️ No org_id found in user metadata for user:", user.id);
          } else {
            // Check if we need to redirect to the org subdomain
            const currentOrg = getOrgFromUrl();
            if ((!currentOrg || currentOrg !== extractedOrgId) && 
                !location.pathname.startsWith("/auth")) {
              console.log("🔄 Redirecting to org subdomain:", extractedOrgId);
              // Store path for after subdomain redirect
              sessionStorage.setItem('lastAuthenticatedPath', location.pathname + location.search);
              redirectToOrgUrl(extractedOrgId);
              return;
            }
          }

          setUser(user);
          setUserId(user.id);
          setOrgId(extractedOrgId || null);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("⚠️ Error checking auth:", error);
        if (isMounted) {
          setIsAuthenticated(false);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    // Use a debounced approach to prevent frequent checks
    // Only check auth once when the component mounts or pathname changes (not search params)
    const timer = setTimeout(() => {
      checkAuth();
    }, 100);

    // Set up listener for auth state changes to keep auth state in sync
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("🔄 Auth state changed:", event);
        
        if (event === 'SIGNED_IN' && isMounted) {
          // Handle org subdomain routing
          const orgFromMetadata = session?.user?.user_metadata?.org_id;
          if (orgFromMetadata) {
            const currentOrg = getOrgFromUrl();
            if (!currentOrg || currentOrg !== orgFromMetadata) {
              console.log("🔄 Redirecting to org subdomain after login:", orgFromMetadata);
              // Store path for after subdomain redirect
              sessionStorage.setItem('lastAuthenticatedPath', 
                localStorage.getItem("redirectAfterLogin") || '/user-dashboard');
              redirectToOrgUrl(orgFromMetadata);
              return;
            }
          }

          // When user signs in, redirect to stored path
          const redirectPath = localStorage.getItem("redirectAfterLogin");
          if (redirectPath) {
            console.log("🚀 Redirecting to:", redirectPath);
            navigate(redirectPath, { replace: true });
            localStorage.removeItem("redirectAfterLogin");
          }
          
          if (session?.user) {
            setUser(session.user);
            setUserId(session.user.id);
            setOrgId(session.user.user_metadata?.org_id || null);
            setIsAuthenticated(true);
          }
        } else if (event === 'SIGNED_OUT' && isMounted) {
          setUser(null);
          setUserId(null);
          setOrgId(null);
          setIsAuthenticated(false);
          
          // Redirect to root domain on signout
          if (getOrgFromUrl()) {
            window.location.href = window.location.protocol + '//' + 
              window.location.hostname.split('.').slice(1).join('.');
          }
        }
      }
    );

    return () => {
      isMounted = false;
      clearTimeout(timer);
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname]); // Only depend on pathname, not full location object or search params

  return { user, userId, orgId, loading, isAuthenticated };
}
