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
        const {
            data: { session },
            error: sessionError,
          } = await supabase.auth.getSession();
          
          const {
            data: { user },
            error: userError,
          } = await supabase.auth.getUser();
          

          if (sessionError || userError || !session || !user) {
            localStorage.setItem("redirectAfterLogin", location.pathname);
            navigate('/auth/login', { replace: true });
          }
           else {
        setUser(user);
        setUserId(user.id);
        setOrgId(user.user_metadata?.org_id || 'lumon');
      }

      setLoading(false);
    };

    checkAuth();
  }, [navigate, location]);

  return { user, userId, orgId, loading };
}