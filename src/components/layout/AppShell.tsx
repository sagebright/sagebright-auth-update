
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { useIsMobile } from '@/hooks/use-mobile';
import { SagePanel } from './SagePanel';
import { SidebarProvider, Sidebar, SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { MessageCircle, X } from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
  sidebarContent?: React.ReactNode;
  showSagePanel?: boolean;
  className?: string;
}

export function AppShell({
  children,
  sidebarContent,
  showSagePanel = true,
  className,
}: AppShellProps) {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [sagePanelOpen, setSagePanelOpen] = useState(false);

  // Close Sage panel when route changes on mobile
  useEffect(() => {
    if (isMobile && sagePanelOpen) {
      setSagePanelOpen(false);
    }
  }, [location.pathname, isMobile]);

  return (
    <SidebarProvider>
      <div className={cn("min-h-screen w-full flex bg-gray-50/50", className)}>
        {/* Sidebar - collapses on mobile */}
        <Sidebar className="border-r border-border">
          {sidebarContent}
        </Sidebar>
        
        {/* Main content area */}
        <div className="flex flex-col flex-1 h-screen overflow-hidden">
          <div className="flex relative flex-1 overflow-hidden">
            {/* Main content */}
            <div className={cn(
              "flex flex-col flex-1 h-full transition-all duration-300 ease-in-out",
              sagePanelOpen && !isMobile && "mr-[350px]", // Create space for sage panel on desktop
            )}>
              <main className="flex-1 overflow-auto">{children}</main>
              
              {/* Mobile Sage trigger (fixed position) */}
              {showSagePanel && isMobile && !sagePanelOpen && (
                <Button
                  variant="outline"
                  size="icon"
                  className="fixed right-4 bottom-4 h-12 w-12 rounded-full shadow-lg bg-background border border-border z-50"
                  onClick={() => setSagePanelOpen(true)}
                >
                  <MessageCircle className="h-6 w-6 text-primary" />
                  <span className="sr-only">Open Sage</span>
                </Button>
              )}
            </div>

            {/* Sage Panel - slides in on mobile, side panel on desktop */}
            {showSagePanel && sagePanelOpen && (
              <div 
                className={cn(
                  "bg-background border-l border-border transition-all duration-300 ease-in-out",
                  isMobile 
                    ? "fixed inset-0 z-50 flex flex-col" 
                    : "w-[350px] absolute right-0 top-0 bottom-0"
                )}
              >
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <h2 className="font-medium">Sage Assistant</h2>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setSagePanelOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <SagePanel className="flex-1" />
              </div>
            )}

            {/* Desktop Sage trigger */}
            {showSagePanel && !isMobile && !sagePanelOpen && (
              <Button 
                variant="outline"
                className="absolute right-4 top-4 pl-2 pr-3 py-1 text-xs gap-1 border border-border shadow-sm"
                onClick={() => setSagePanelOpen(true)}
              >
                <MessageCircle className="h-3 w-3" />
                Ask Sage
              </Button>
            )}

            {/* Overlay when Sage panel is open on mobile */}
            {showSagePanel && sagePanelOpen && isMobile && (
              <div 
                className="fixed inset-0 bg-black/20 z-40"
                onClick={() => setSagePanelOpen(false)}
              />
            )}
          </div>
          
          {/* Mobile sidebar trigger */}
          <div className="block md:hidden border-t border-border p-2">
            <SidebarTrigger />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
