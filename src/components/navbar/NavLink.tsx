import React from 'react';
import { Link } from 'react-router-dom';

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  isActive?: boolean;
  isHashLink?: boolean;
}

const NavLink = ({ to, children, isActive = false, isHashLink = false }: NavLinkProps) => {
  // If it's a hash link, we render an anchor tag instead of a Link
  if (isHashLink) {
    return (
      <a 
        href={to} 
        className={`text-base font-medium font-helvetica tracking-tight text-charcoal hover:text-sagebright-green transition-colors duration-200 group ${isActive ? 'font-medium text-sagebright-green' : ''}`}
      >
        {children}
        <span className={`block h-0.5 bg-sagebright-green transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 ${isActive ? 'scale-x-100' : ''}`}></span>
      </a>
    );
  }
  
  // Otherwise, we render a Link component
  return (
    <Link 
      to={to} 
      className="text-base font-medium font-helvetica tracking-tight text-charcoal hover:text-sagebright-green transition-colors duration-200 group"
    >
      {children}
      <span className="block h-0.5 bg-sagebright-green transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
    </Link>
  );
};

export default NavLink;
