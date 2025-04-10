
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';

interface NavbarButtonProps {
  user: any;
}

const NavbarButton = ({ user }: NavbarButtonProps) => {
  const { t } = useTranslation();
  
  return (
    <Button 
      asChild 
      className="bg-accent1 hover:bg-accent1/90 text-accent1-foreground text-cta font-dmSans rounded-md transition-transform duration-300 hover:scale-103 hover:brightness-105"
      aria-label={user ? t('common.dashboard') as string : t('common.requestAccess') as string}
    >
      <Link to={user ? "/user-dashboard" : "/auth/login"}>
        {user ? t('common.dashboard') : t('common.requestAccess')}
      </Link>
    </Button>
  );
};

export default NavbarButton;
