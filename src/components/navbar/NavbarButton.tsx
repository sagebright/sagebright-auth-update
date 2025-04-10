
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';
import { NavbarButtonProps } from '@/types'; 

/**
 * NavbarButton - Navigation button that adapts based on authentication status
 * 
 * Renders a button that changes its text and destination based on whether a user
 * is authenticated or not. Uses i18n for text localization.
 *
 * @example
 * ```tsx
 * const { user } = useAuth();
 * <NavbarButton user={user} />
 * ```
 */
const NavbarButton: React.FC<NavbarButtonProps> = ({ user }) => {
  const { t } = useTranslation();
  
  return (
    <Button 
      asChild 
      className="bg-accent1 hover:bg-accent1/90 text-accent1-foreground text-cta font-dmSans rounded-md transition-transform duration-300 hover:scale-103 hover:brightness-105"
      aria-label={user ? t('common.dashboard') as string : t('common.requestAccess') as string}
    >
      <Link to={user ? "/user-dashboard" : "/auth/login"}>
        {user ? t('common.dashboard') as string : t('common.requestAccess') as string}
      </Link>
    </Button>
  );
};

export default NavbarButton;
