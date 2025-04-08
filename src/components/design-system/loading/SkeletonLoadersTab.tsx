
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const SkeletonLoadersTab = () => {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Skeleton Components</CardTitle>
          <CardDescription>
            Use for content that takes time to load
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-12 w-3/4 rounded" />
          <Skeleton className="h-6 w-full rounded" />
          <Skeleton className="h-6 w-5/6 rounded" />
          <Skeleton className="h-6 w-4/6 rounded" />
          <div className="grid grid-cols-3 gap-2 mt-4">
            <Skeleton className="h-24 rounded" />
            <Skeleton className="h-24 rounded" />
            <Skeleton className="h-24 rounded" />
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <div className="space-y-2 w-full">
            <Skeleton className="h-4 w-1/3 rounded" />
            <Skeleton className="h-4 w-1/2 rounded" />
          </div>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Implementation</CardTitle>
          <CardDescription>
            How to use skeleton loaders
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted rounded-md p-4 mb-4">
            <pre className="text-xs overflow-x-auto">
{`import { Skeleton } from "@/components/ui/skeleton";

// Simple skeleton usage
<Skeleton className="h-12 w-3/4 rounded" />

// Card with skeleton loading state
function CardSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-[125px] w-full rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  );
}`}
            </pre>
          </div>
          
          <div className="prose max-w-none text-sm">
            <p><strong>When to use:</strong></p>
            <ul>
              <li>Content that takes {'>'}300ms to load</li>
              <li>Initial page load for main content</li>
              <li>Data that refreshes periodically</li>
              <li>Complex layouts with multiple data sources</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SkeletonLoadersTab;
