
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavigationLinksProps {
  isContactPage: boolean;
}

const NavigationLinks: React.FC<NavigationLinksProps> = ({ isContactPage }) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.hash === path;
  };

  return (
    <>
      {isContactPage ? (
        <>
          <Link 
            to="/#employees" 
            className="text-base font-medium font-helvetica tracking-tight text-charcoal hover:text-sagebright-green transition-colors duration-200 group"
          >
            Meet Sage
            <span className="block h-0.5 bg-sagebright-green transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
          </Link>
          <Link 
            to="/#admins" 
            className="text-base font-medium font-helvetica tracking-tight text-charcoal hover:text-sagebright-green transition-colors duration-200 group"
          >
            Built for Teams
            <span className="block h-0.5 bg-sagebright-green transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
          </Link>
          <Link 
            to="/#how" 
            className="text-base font-medium font-helvetica tracking-tight text-charcoal hover:text-sagebright-green transition-colors duration-200 group"
          >
            From Intro to Impact
            <span className="block h-0.5 bg-sagebright-green transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
          </Link>
          <Link 
            to="/#human" 
            className="text-base font-medium font-helvetica tracking-tight text-charcoal hover:text-sagebright-green transition-colors duration-200 group"
          >
            Designed for People
            <span className="block h-0.5 bg-sagebright-green transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
          </Link>
        </>
      ) : (
        <>
          <a 
            href="#employees" 
            className={`text-base font-medium font-helvetica tracking-tight text-charcoal hover:text-sagebright-green transition-colors duration-200 group ${isActive('#employees') ? 'font-medium text-sagebright-green' : ''}`}
          >
            Meet Sage
            <span className={`block h-0.5 bg-sagebright-green transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 ${isActive('#employees') ? 'scale-x-100' : ''}`}></span>
          </a>
          <a 
            href="#admins" 
            className={`text-base font-medium font-helvetica tracking-tight text-charcoal hover:text-sagebright-green transition-colors duration-200 group ${isActive('#admins') ? 'font-medium text-sagebright-green' : ''}`}
          >
            Built for Teams
            <span className={`block h-0.5 bg-sagebright-green transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 ${isActive('#admins') ? 'scale-x-100' : ''}`}></span>
          </a>
          <a 
            href="#how" 
            className={`text-base font-medium font-helvetica tracking-tight text-charcoal hover:text-sagebright-green transition-colors duration-200 group ${isActive('#how') ? 'font-medium text-sagebright-green' : ''}`}
          >
            From Intro to Impact
            <span className={`block h-0.5 bg-sagebright-green transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 ${isActive('#how') ? 'scale-x-100' : ''}`}></span>
          </a>
          <a 
            href="#human" 
            className={`text-base font-medium font-helvetica tracking-tight text-charcoal hover:text-sagebright-green transition-colors duration-200 group ${isActive('#human') ? 'font-medium text-sagebright-green' : ''}`}
          >
            Designed for People
            <span className={`block h-0.5 bg-sagebright-green transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 ${isActive('#human') ? 'scale-x-100' : ''}`}></span>
          </a>
        </>
      )}
      <Link 
        to="/contact-us" 
        className="text-base font-medium font-helvetica tracking-tight text-charcoal hover:text-sagebright-green transition-colors duration-200 group"
      >
        Contact Us
        <span className="block h-0.5 bg-sagebright-green transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
      </Link>
    </>
  );
};

export default NavigationLinks;
