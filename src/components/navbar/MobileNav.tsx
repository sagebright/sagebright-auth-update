
import React, { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/auth/AuthContext';
import Logo from '@/components/Logo';

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    setOpen(false);
  };

  const closeSheet = () => {
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="md:hidden" size="icon">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <div className="px-2 py-6 flex flex-col h-full">
          <div className="mb-8 flex justify-start">
            <Logo />
          </div>
          <nav className="flex flex-col gap-4">
            <NavLink
              to="/"
              onClick={closeSheet}
              className={({ isActive }) =>
                cn(
                  "px-3 py-2 rounded-md text-lg font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/70 hover:text-foreground hover:bg-accent"
                )
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/features"
              onClick={closeSheet}
              className={({ isActive }) =>
                cn(
                  "px-3 py-2 rounded-md text-lg font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/70 hover:text-foreground hover:bg-accent"
                )
              }
            >
              Features
            </NavLink>
            <NavLink
              to="/pricing"
              onClick={closeSheet}
              className={({ isActive }) =>
                cn(
                  "px-3 py-2 rounded-md text-lg font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/70 hover:text-foreground hover:bg-accent"
                )
              }
            >
              Pricing
            </NavLink>
            <NavLink
              to="/about"
              onClick={closeSheet}
              className={({ isActive }) =>
                cn(
                  "px-3 py-2 rounded-md text-lg font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/70 hover:text-foreground hover:bg-accent"
                )
              }
            >
              About
            </NavLink>
          </nav>
          <div className="mt-auto pt-6 border-t">
            {isAuthenticated ? (
              <div className="space-y-3">
                <NavLink
                  to="/dashboard"
                  onClick={closeSheet}
                  className="block w-full px-3 py-2 text-lg font-medium text-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Dashboard
                </NavLink>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleSignOut}
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <NavLink
                  to="/signin"
                  onClick={closeSheet}
                  className="block w-full px-3 py-2 text-lg font-medium text-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Sign In
                </NavLink>
                <NavLink
                  to="/signup"
                  onClick={closeSheet}
                  className="block w-full px-3 py-2 text-lg font-medium text-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                >
                  Sign Up
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Add default export for backward compatibility
export default MobileNav;
