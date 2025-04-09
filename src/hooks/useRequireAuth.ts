
import { useEffect, useState } from 'react';
import { useLocation, NavigateFunction } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { getOrgFromUrl, redirectToOrgUrl, getOrgById } from '@/lib/subdomainUtils';

export function useRequireAuth(navigate: NavigateFunction) {
  const [user, setUser] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [orgId, setOrgId] = useState<string | null>(null);
  const [orgSlug, setOrgSlug] = useState<string | null>(null);
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
              // If on a subdomain, redirect to /auth/login instead of the default path
              const orgSlug = getOrgFromUrl();
              const loginPath = orgSlug ? '/auth/login' : '/auth/login';
              
              navigate(loginPath, { replace: true });
              setIsAuthenticated(false);
            }
          }
        } else if (isMounted) {
          const extractedOrgId = user.user_metadata?.org_id;
          const userRole = user.user_metadata?.role || 'user';

          if (!extractedOrgId) {
            console.warn("⚠️ No org_id found in user metadata for user:", user.id);
          } else {
            // Get org details including slug
            const orgDetails = await getOrgById(extractedOrgId);
            const orgSlug = orgDetails?.slug;
            
            if (orgSlug) {
              // Check if we need to redirect to the org subdomain
              const currentOrgSlug = getOrgFromUrl();
              
              if ((!currentOrgSlug || currentOrgSlug !== orgSlug) && 
                  !location.pathname.startsWith("/auth")) {
                console.log("🔄 Redirecting to org subdomain:", orgSlug);
                
                // Store path for after subdomain redirect, with role-based default
                const redirectTo = userRole === 'admin' ? '/hr-dashboard' : '/user-dashboard';
                const pathToStore = location.pathname !== '/' ? 
                  (location.pathname + location.search) : 
                  redirectTo;
                  
                sessionStorage.setItem('lastAuthenticatedPath', pathToStore);
                
                redirectToOrgUrl(orgSlug);
                return;
              }
              
              // If on the root path, redirect based on role
              if (location.pathname === '/' && user) {
                const targetPath = userRole === 'admin' ? '/hr-dashboard' : '/user-dashboard';
                if (isMounted) {
                  navigate(targetPath, { replace: true });
                }
                return;
              }
            } else {
              console.warn("⚠️ No slug found for org ID:", extractedOrgId);
            }
          }

          setUser(user);
          setUserId(user.id);
          setOrgId(extractedOrgId || null);
          
          // Get and set the org slug if we have an org ID
          if (extractedOrgId) {
            const orgDetails = await getOrgById(extractedOrgId);
            setOrgSlug(orgDetails?.slug || null);
          }
          
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
      async (event, session) => {
        console.log("🔄 Auth state changed:", event);
        
        if (event === 'SIGNED_IN' && isMounted) {
          if (session?.user) {
            setUser(session.user);
            setUserId(session.user.id);
            setOrgId(session.user.user_metadata?.org_id || null);
            
            // Get and set the org slug if we have an org ID
            if (session.user.user_metadata?.org_id) {
              const orgDetails = await getOrgById(session.user.user_metadata.org_id);
              const orgSlug = orgDetails?.slug || null;
              setOrgSlug(orgSlug);
              
              // Handle org subdomain routing
              const currentOrgSlug = getOrgFromUrl();
              if (orgSlug && (!currentOrgSlug || currentOrgSlug !== orgSlug)) {
                console.log("🔄 Redirecting to org subdomain after login:", orgSlug);
                
                // Determine target based on role
                const userRole = session.user.user_metadata?.role || 'user';
                const targetPath = userRole === 'admin' ? '/hr-dashboard' : '/user-dashboard';
                
                // Store path for after subdomain redirect
                sessionStorage.setItem('lastAuthenticatedPath', targetPath);
                redirectToOrgUrl(orgSlug);
                return;
              }
              
              // If already on correct subdomain, redirect based on role
              const userRole = session.user.user_metadata?.role || 'user';
              const targetPath = userRole === 'admin' ? '/hr-dashboard' : '/user-dashboard';
              
              // Only redirect if we're on a login page or root
              if (location.pathname === '/' || location.pathname.startsWith('/auth/')) {
                console.log("🚀 Redirecting to role-specific dashboard:", targetPath);
                navigate(targetPath, { replace: true });
              }
            }
            
            setIsAuthenticated(true);
          }
        } else if (event === 'SIGNED_OUT' && isMounted) {
          setUser(null);
          setUserId(null);
          setOrgId(null);
          setOrgSlug(null);
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

  return { user, userId, orgId, orgSlug, loading, isAuthenticated };
}
