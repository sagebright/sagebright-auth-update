
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SkeletonLoadersTab from "./loading/SkeletonLoadersTab";
import ButtonStatesTab from "./loading/ButtonStatesTab";
import PageLoadingTab from "./loading/PageLoadingTab";
import BestPracticesTab from "./loading/BestPracticesTab";

const LoadingStateGuidelines = () => {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-heading-sm mb-6">Loading State Guidelines</h2>
        <p className="text-body mb-4">
          Consistent loading states help provide a better user experience by reducing perceived wait times and providing feedback.
        </p>
      </section>

      <Tabs defaultValue="skeleton">
        <TabsList>
          <TabsTrigger value="skeleton">Skeleton Loaders</TabsTrigger>
          <TabsTrigger value="button">Button States</TabsTrigger>
          <TabsTrigger value="page">Page Loading</TabsTrigger>
          <TabsTrigger value="best-practices">Best Practices</TabsTrigger>
        </TabsList>
        
        <TabsContent value="skeleton" className="mt-6">
          <SkeletonLoadersTab />
        </TabsContent>
        
        <TabsContent value="button" className="mt-6">
          <ButtonStatesTab />
        </TabsContent>
        
        <TabsContent value="page" className="mt-6">
          <PageLoadingTab />
        </TabsContent>
        
        <TabsContent value="best-practices" className="mt-6">
          <BestPracticesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LoadingStateGuidelines;
