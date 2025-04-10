
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { User } from '@supabase/supabase-js';

interface MobileNavProps {
  isContactPage: boolean;
  user: User | null;
}

const MobileNav = ({ isContactPage, user }: MobileNavProps) => {
  return (
    <div className="md:hidden ml-4">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[80vw] sm:w-[350px] pt-12">
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
                <Link to={user ? "/user-dashboard" : "/auth/login"}>
                  {user ? "Dashboard" : "Request Access"}
                </Link>
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNav;
