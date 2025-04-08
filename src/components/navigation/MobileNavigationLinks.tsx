
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface MobileNavigationLinksProps {
  isContactPage: boolean;
}

const MobileNavigationLinks: React.FC<MobileNavigationLinksProps> = ({ isContactPage }) => {
  return (
    <div className="flex flex-col gap-6 py-4">
      {isContactPage ? (
        <>
          <Link 
            to="/#employees" 
            className="text-lg font-medium font-helvetica tracking-tight text-charcoal hover:text-sagebright-green transition-colors duration-200 py-2"
          >
            Meet Sage
          </Link>
          <Link 
            to="/#admins" 
            className="text-lg font-medium font-helvetica tracking-tight text-charcoal hover:text-sagebright-green transition-colors duration-200 py-2"
          >
            Built for Teams
          </Link>
          <Link 
            to="/#how" 
            className="text-lg font-medium font-helvetica tracking-tight text-charcoal hover:text-sagebright-green transition-colors duration-200 py-2"
          >
            From Intro to Impact
          </Link>
          <Link 
            to="/#human" 
            className="text-lg font-medium font-helvetica tracking-tight text-charcoal hover:text-sagebright-green transition-colors duration-200 py-2"
          >
            Designed for People
          </Link>
        </>
      ) : (
        <>
          <a 
            href="#employees" 
            className="text-lg font-medium font-helvetica tracking-tight text-charcoal hover:text-sagebright-green transition-colors duration-200 py-2"
          >
            Meet Sage
          </a>
          <a 
            href="#admins" 
            className="text-lg font-medium font-helvetica tracking-tight text-charcoal hover:text-sagebright-green transition-colors duration-200 py-2"
          >
            Built for Teams
          </a>
          <a 
            href="#how" 
            className="text-lg font-medium font-helvetica tracking-tight text-charcoal hover:text-sagebright-green transition-colors duration-200 py-2"
          >
            From Intro to Impact
          </a>
          <a 
            href="#human" 
            className="text-lg font-medium font-helvetica tracking-tight text-charcoal hover:text-sagebright-green transition-colors duration-200 py-2"
          >
            Designed for People
          </a>
        </>
      )}
      <Link 
        to="/contact-us" 
        className="text-lg font-medium font-helvetica tracking-tight text-charcoal hover:text-sagebright-green transition-colors duration-200 py-2"
      >
        Contact Us
      </Link>
      <div className="pt-4">
        <Button asChild className="w-full bg-sagebright-coral hover:bg-sagebright-coral/90 text-white text-cta font-dmSans rounded-md">
          <Link to="/auth/login">Request Access</Link>
        </Button>
      </div>
    </div>
  );
};

export default MobileNavigationLinks;
