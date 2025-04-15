
import { useEffect, useRef } from 'react';
import { NavigateFunction } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

interface AuthCheckProps {
  user: any;
  loading: boolean;
  isAuthenticated: boolean;
  requiredRole?: string;
  requiredPermission?: string;
  navigate: NavigateFunction;
  pathname: string;
}

export const useAuthCheck = ({
  user,
  loading,
  isAuthenticated,
  requiredRole,
  requiredPermission,
  navigate,
  pathname
}: AuthCheckProps) => {
  const redirectAttempted = useRef(false);

  useEffect(() => {
    if (loading || redirectAttempted.current) return;

    if (!isAuthenticated) {
      redirectAttempted.current = true;
      console.log("🔑 Not authenticated, redirecting to login");
      localStorage.setItem("redirectAfterLogin", pathname);
      navigate('/auth/login', { replace: true });
      return;
    }

    if (requiredRole) {
      const userRole = user?.user_metadata?.role || 'user';
      
      if (userRole !== requiredRole) {
        console.log("🚫 User lacks required role:", requiredRole);
        
        toast({
          variant: "destructive",
          title: "Access denied",
          description: `You need ${requiredRole} access for this page.`
        });
        
        redirectAttempted.current = true;
        const fallbackPath = userRole === 'admin' ? '/hr-dashboard' : '/ask-sage';
        navigate(fallbackPath, { replace: true });
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
      
      redirectAttempted.current = true;
      const userRole = user?.user_metadata?.role || 'user';
      const fallbackPath = userRole === 'admin' ? '/hr-dashboard' : '/ask-sage';
      navigate(fallbackPath, { replace: true });
    }
  }, [loading, isAuthenticated, user, requiredRole, requiredPermission, navigate, pathname]);
};
