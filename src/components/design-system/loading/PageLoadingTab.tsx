
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

const PageLoadingTab = () => {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Page-Level Loading</CardTitle>
          <CardDescription>
            For initial loads and major content changes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-subheading-sm">Initial Page Load</h3>
            <div className="border rounded-md p-4 flex flex-col items-center justify-center min-h-[200px]">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Loading application...</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-subheading-sm">Section Loading</h3>
            <div className="border rounded-md p-4">
              <div className="mb-4">
                <h4 className="text-body font-medium">Dashboard Overview</h4>
              </div>
              <div className="space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <div className="grid grid-cols-3 gap-4">
                  <Skeleton className="h-24" />
                  <Skeleton className="h-24" />
                  <Skeleton className="h-24" />
                </div>
                <Skeleton className="h-64 w-full" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Implementation Guidelines</CardTitle>
          <CardDescription>
            Best practices for page-level loading states
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-subheading-sm">Loading Hierarchies</h3>
              <div className="prose max-w-none text-sm">
                <ol className="list-decimal pl-5">
                  <li><strong>Progressive loading</strong>: Show layout and navigation first, then content</li>
                  <li><strong>Prioritize above-the-fold</strong>: Load visible content before off-screen</li>
                  <li><strong>Maintain structure</strong>: Use skeletons that match final content dimensions</li>
                  <li><strong>Reduce layout shift</strong>: Reserve space for elements that will appear</li>
                </ol>
              </div>
            </div>
            
            <LoadingDurationGuidelines />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const LoadingDurationGuidelines = () => (
  <div className="space-y-2">
    <h3 className="text-subheading-sm">Loading State Duration Guidelines</h3>
    <div className="space-y-2">
      <div className="bg-muted p-3 rounded-md">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium">0-300ms</span>
          <span className="text-xs text-muted-foreground">No indicator needed</span>
        </div>
        <div className="w-full h-1.5 bg-background rounded-full overflow-hidden">
          <div className="h-full bg-primary w-1/6"></div>
        </div>
      </div>
      
      <div className="bg-muted p-3 rounded-md">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium">300ms-1s</span>
          <span className="text-xs text-muted-foreground">Spinner or minimal indicator</span>
        </div>
        <div className="w-full h-1.5 bg-background rounded-full overflow-hidden">
          <div className="h-full bg-primary w-1/3"></div>
        </div>
      </div>
      
      <div className="bg-muted p-3 rounded-md">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium">1s+</span>
          <span className="text-xs text-muted-foreground">Skeleton or detailed indicator</span>
        </div>
        <div className="w-full h-1.5 bg-background rounded-full overflow-hidden">
          <div className="h-full bg-primary w-2/3"></div>
        </div>
      </div>
      
      <div className="bg-muted p-3 rounded-md">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium">10s+</span>
          <span className="text-xs text-muted-foreground">Progress indicator</span>
        </div>
        <div className="w-full h-1.5 bg-background rounded-full overflow-hidden">
          <div className="h-full bg-primary w-full"></div>
        </div>
      </div>
    </div>
  </div>
);

export default PageLoadingTab;
