
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { SubmitButton } from "@/components/form/SubmitButton";
import { useLoading } from "@/hooks/use-loading";
import { 
  SkeletonText, 
  SkeletonAvatar, 
  SkeletonCard, 
  SkeletonButton,
  SkeletonList,
  SkeletonDashboard,
  SkeletonForm
} from "@/components/ui/skeleton-elements";
import { Skeleton } from "@/components/ui/skeleton";
import { Send, Download, Check } from "lucide-react";

export default function LoadingStatesExample() {
  const [isLoadingData, setIsLoadingData] = useState(false);
  const { isLoading, withLoading } = useLoading();

  const handleLoadWithDelay = async () => {
    setIsLoadingData(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoadingData(false);
  };

  const handleWithLoadingHook = () => {
    withLoading(new Promise(resolve => setTimeout(resolve, 2000)));
  };

  return (
    <div className="container max-w-6xl py-12 space-y-12">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Loading States Example</h1>
        <p className="text-muted-foreground">
          This page demonstrates the various loading state components and patterns in the Sagebright design system.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Button Loading States</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Basic Loading Buttons</h3>
              <div className="flex flex-wrap gap-4">
                <LoadingButton isLoading={isLoading}>Default Button</LoadingButton>
                <LoadingButton 
                  isLoading={isLoading} 
                  loadingText="Saving..." 
                  variant="secondary"
                >
                  With Custom Text
                </LoadingButton>
                <LoadingButton 
                  variant="outline" 
                  isLoading={isLoading}
                >
                  <Send className="mr-2 h-4 w-4" /> Send
                </LoadingButton>
                <LoadingButton onClick={handleWithLoadingHook}>
                  Click to Load (Hook)
                </LoadingButton>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Submit Buttons</h3>
              <div className="flex flex-wrap gap-4">
                <SubmitButton isSubmitting={isLoadingData}>Submit Form</SubmitButton>
                <SubmitButton isSubmitting={isLoadingData} icon={Download} variant="secondary">
                  Download
                </SubmitButton>
                <Button onClick={handleLoadWithDelay}>
                  Toggle Loading
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Button Variants</h3>
              <div className="flex flex-wrap gap-4">
                <LoadingButton isLoading variant="default">Default</LoadingButton>
                <LoadingButton isLoading variant="secondary">Secondary</LoadingButton>
                <LoadingButton isLoading variant="accent1">Accent 1</LoadingButton>
                <LoadingButton isLoading variant="accent2">Accent 2</LoadingButton>
                <LoadingButton isLoading variant="charcoal">Charcoal</LoadingButton>
                <LoadingButton isLoading variant="outline">Outline</LoadingButton>
                <LoadingButton isLoading variant="ghost">Ghost</LoadingButton>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Spinner Components</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Sizes</h3>
              <div className="flex items-center gap-8">
                <LoadingSpinner size="sm" />
                <LoadingSpinner size="md" />
                <LoadingSpinner size="lg" />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Colors</h3>
              <div className="flex flex-wrap gap-8">
                <LoadingSpinner variant="primary" />
                <LoadingSpinner variant="secondary" />
                <LoadingSpinner variant="accent1" />
                <LoadingSpinner variant="accent2" />
                <LoadingSpinner variant="charcoal" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-1 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Skeleton Components</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Text Skeletons</h3>
                <div className="space-y-6">
                  <SkeletonText />
                  <SkeletonText lines={3} />
                  <SkeletonText width="3/4" />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Avatar &amp; UI Elements</h3>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <SkeletonAvatar />
                    <SkeletonText lines={2} className="flex-1" />
                  </div>
                  
                  <div className="space-y-2">
                    <SkeletonButton />
                    <div className="flex gap-2 mt-4">
                      <Skeleton className="h-8 w-8 rounded-md" />
                      <Skeleton className="h-8 w-8 rounded-md" />
                      <Skeleton className="h-8 w-8 rounded-md" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Cards &amp; Lists</h3>
                <SkeletonCard />
                <SkeletonList rows={3} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Dashboard Loading</CardTitle>
          </CardHeader>
          <CardContent>
            <SkeletonDashboard />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Form Loading</CardTitle>
          </CardHeader>
          <CardContent>
            <SkeletonForm fields={4} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
