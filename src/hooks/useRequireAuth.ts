import { useEffect, useState } from 'react';
import { useLocation, NavigateFunction } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';

export function useRequireAuth(navigate: NavigateFunction) {
  const [user, setUser] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [orgId, setOrgId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    console.log("🔐 useRequireAuth running on:", location.pathname);

    // Skip auth check on public routes
    if (location.pathname.startsWith("/auth")) {
      setLoading(false);
      return;
    }

    const checkAuth = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      console.log("🧑‍💻 Supabase user returned:", user);
      console.log("📦 Supabase session returned:", session);

      if (error || sessionError || !user || !session) {
        localStorage.setItem("redirectAfterLogin", location.pathname);
        navigate('/auth/login', { replace: true });
      } else {
        const extractedOrgId = user.user_metadata?.org_id;

        if (!extractedOrgId) {
          console.warn("⚠️ No org_id found in user metadata for user:", user.id);
        }

        setUser(user);
        setUserId(user.id);
        setOrgId(extractedOrgId || null);
      }

      setLoading(false);
    };

    checkAuth();
  }, [navigate, location]);

  return { user, userId, orgId, loading };
}
