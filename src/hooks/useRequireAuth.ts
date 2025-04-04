
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

    // Skip auth check on public routes
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
          // Only store path for redirect if we're actually redirecting due to auth
          // Include the full URL with search params
          const fullPath = location.pathname + location.search;
          localStorage.setItem("redirectAfterLogin", fullPath);
          
          if (isMounted) {
            navigate('/auth/login', { replace: true });
            setIsAuthenticated(false);
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

    // Use a timer to ensure we don't repeatedly check auth in rapid succession
    // And only trigger once per auth change, not on every URL parameter change
    const timer = setTimeout(() => {
      checkAuth();
    }, 100);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [navigate, location.pathname]); // Only depend on pathname, not full location object

  return { user, userId, orgId, loading, isAuthenticated };
}
