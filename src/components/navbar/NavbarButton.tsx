
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface NavbarButtonProps {
  user: any;
}

const NavbarButton = ({ user }: NavbarButtonProps) => {
  return (
    <Button asChild className="bg-sagebright-coral hover:bg-sagebright-coral/90 text-white text-cta font-dmSans rounded-md transition-transform duration-300 hover:scale-103 hover:brightness-105">
      <Link to={user ? "/user-dashboard" : "/auth/login"}>
        {user ? "Dashboard" : "Request Access"}
      </Link>
    </Button>
  );
};

export default NavbarButton;
