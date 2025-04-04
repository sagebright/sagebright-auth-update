
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

    const checkAuth = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        console.log("🧑‍💻 Supabase user returned:", user);
        console.log("📦 Supabase session returned:", session);

        if (error || sessionError || !user || !session) {
          // Only store path for redirect if we're actually redirecting due to auth
          localStorage.setItem("redirectAfterLogin", location.pathname + location.search);
          navigate('/auth/login', { replace: true });
          setIsAuthenticated(false);
        } else {
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
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    let didCancel = false;

    // Use a timer to ensure we don't repeatedly check auth in rapid succession
    const timer = setTimeout(() => {
      if (!didCancel) {
        checkAuth();
      }
    }, 100);

    return () => {
      didCancel = true;
      clearTimeout(timer);
    };
  }, [navigate, location.pathname]); // Removed location from dependencies to prevent re-renders on query params

  return { user, userId, orgId, loading, isAuthenticated };
}
