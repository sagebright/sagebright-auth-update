
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface NavbarButtonProps {
  user: any;
}

const NavbarButton = ({ user }: NavbarButtonProps) => {
  return (
    <Button 
      asChild 
      className="bg-accent1 hover:bg-accent1/90 text-accent1-foreground text-cta font-dmSans rounded-md transition-transform duration-300 hover:scale-103 hover:brightness-105"
      aria-label={user ? "Go to dashboard" : "Request access"}
    >
      <Link to={user ? "/user-dashboard" : "/auth/login"}>
        {user ? "Dashboard" : "Request Access"}
      </Link>
    </Button>
  );
};

export default NavbarButton;
