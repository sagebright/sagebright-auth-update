import { useEffect, useState } from 'react';
import { useLocation, NavigateFunction } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';

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
