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
        console.log("🔍 Checking auth status...");
        const { data: { user }, error } = await supabase.auth.getUser();
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (!isMounted) return;

        console.log("🧑‍💻 Supabase user returned:", user);
        console.log("📦 Supabase session returned:", session);

        if (error || sessionError || !user || !session) {
          console.log("❌ No authenticated user found");
          // Only redirect to login if we're not already on an auth route
          if (!location.pathname.startsWith("/auth")) {
            // Store the full URL with search params for redirect after login
            const fullPath = location.pathname + location.search;
            console.log("📝 Storing redirect path:", fullPath);
            localStorage.setItem("redirectAfterLogin", fullPath);
            
            if (isMounted) {
              // If on a subdomain, redirect to /auth/login
              const orgSlug = getOrgFromUrl();
              const loginPath = '/auth/login';
              
              console.log("🔄 Redirecting to login:", loginPath);
              navigate(loginPath, { replace: true });
              setIsAuthenticated(false);
            }
          }
        } else if (isMounted) {
          console.log("✅ User is authenticated:", user.id);
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
                
                if (isMounted) {
                  redirectToOrgUrl(orgSlug);
                }
                return;
              }
              
              // If on the root path, redirect based on role
              if (location.pathname === '/' && user) {
                const targetPath = userRole === 'admin' ? '/hr-dashboard' : '/user-dashboard';
                if (isMounted) {
                  console.log("🏠 Redirecting to role-based dashboard:", targetPath);
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

    checkAuth();

    // Set up listener for auth state changes to keep auth state in sync
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("🔄 Auth state changed in useRequireAuth:", event);
        
        if (!isMounted) return;
        
        if (event === 'SIGNED_IN') {
          if (session?.user) {
            setUser(session.user);
            setUserId(session.user.id);
            setOrgId(session.user.user_metadata?.org_id || null);
            setIsAuthenticated(true);
            
            // Get and set the org slug if we have an org ID
            if (session.user.user_metadata?.org_id) {
              const orgDetails = await getOrgById(session.user.user_metadata.org_id);
              const orgSlug = orgDetails?.slug || null;
              setOrgSlug(orgSlug);
              
              if (orgSlug) {
                // Handle org subdomain routing
                const currentOrgSlug = getOrgFromUrl();
                if ((!currentOrgSlug || currentOrgSlug !== orgSlug) && isMounted) {
                  console.log("🔄 Redirecting to org subdomain after login:", orgSlug);
                  
                  // Determine target based on role
                  const userRole = session.user.user_metadata?.role || 'user';
                  const targetPath = userRole === 'admin' ? '/hr-dashboard' : '/user-dashboard';
                  
                  // Store path for after subdomain redirect
                  sessionStorage.setItem('lastAuthenticatedPath', targetPath);
                  redirectToOrgUrl(orgSlug);
                  return;
                }
              }
            }
          }
        } else if (event === 'SIGNED_OUT' && isMounted) {
          setUser(null);
          setUserId(null);
          setOrgId(null);
          setOrgSlug(null);
          setIsAuthenticated(false);
          
          // Redirect to root domain on signout
          const orgSlug = getOrgFromUrl();
          if (orgSlug) {
            console.log("🚪 Signing out from subdomain, redirecting to root domain");
            window.location.href = window.location.protocol + '//' + 
              window.location.hostname.split('.').slice(1).join('.');
          } else if (!location.pathname.startsWith("/auth") && isMounted) {
            navigate('/auth/login', { replace: true });
          }
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname]);

  return { user, userId, orgId, orgSlug, loading, isAuthenticated };
}
