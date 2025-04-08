
import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import Logo from './Logo';
import { useAuth } from '@/contexts/auth/AuthContext';
import DesktopNav from './navbar/DesktopNav';
import MobileNav from './navbar/MobileNav';
import NavbarButton from './navbar/NavbarButton';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const { user } = useAuth();
  const location = useLocation();
  
  const isContactPage = location.pathname === '/contact-us';

  const handleScroll = useCallback(() => {
    const isScrolled = window.scrollY > 20;
    if (isScrolled !== scrolled) {
      setScrolled(isScrolled);
    }
  }, [scrolled]);

  useEffect(() => {
    let scrollTimer: number;
    const throttledScroll = () => {
      if (!scrollTimer) {
        scrollTimer = window.setTimeout(() => {
          scrollTimer = 0;
          handleScroll();
        }, 100);
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', throttledScroll);
      clearTimeout(scrollTimer);
    };
  }, [handleScroll]);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white shadow-sm' : 'bg-white/90 backdrop-blur-sm'
    } border-b border-gray-100`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <Logo variant="full" size="md" />
          </div>
          
          {/* Desktop Navigation */}
          <DesktopNav isContactPage={isContactPage} />
          
          <div className="flex items-center ml-6 md:ml-8">
            <NavbarButton user={user} />
            
            {/* Mobile Menu Button */}
            <MobileNav isContactPage={isContactPage} user={user} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
