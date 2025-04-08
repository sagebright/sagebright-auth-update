
import React from 'react';
import NavLink from './NavLink';
import { useLocation } from 'react-router-dom';

interface DesktopNavProps {
  isContactPage: boolean;
}

const DesktopNav = ({ isContactPage }: DesktopNavProps) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.hash === path;
  };
  
  return (
    <nav className="hidden md:flex items-center space-x-6 ml-8">
      {isContactPage ? (
        <>
          <NavLink to="/#employees">
            Meet Sage
          </NavLink>
          <NavLink to="/#admins">
            Built for Teams
          </NavLink>
          <NavLink to="/#how">
            From Intro to Impact
          </NavLink>
          <NavLink to="/#human">
            Designed for People
          </NavLink>
        </>
      ) : (
        <>
          <NavLink to="#employees" isHashLink isActive={isActive('#employees')}>
            Meet Sage
          </NavLink>
          <NavLink to="#admins" isHashLink isActive={isActive('#admins')}>
            Built for Teams
          </NavLink>
          <NavLink to="#how" isHashLink isActive={isActive('#how')}>
            From Intro to Impact
          </NavLink>
          <NavLink to="#human" isHashLink isActive={isActive('#human')}>
            Designed for People
          </NavLink>
        </>
      )}
      <NavLink to="/contact-us">
        Contact Us
      </NavLink>
    </nav>
  );
};

export default DesktopNav;
