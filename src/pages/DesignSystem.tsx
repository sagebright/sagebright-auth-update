
import React from "react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ColorReference from "@/components/design-system/ColorReference";
import FormValidationExamples from "@/components/design-system/FormValidationExamples";
import ImageUsageGuidelines from "@/components/design-system/ImageUsageGuidelines";
import LoadingStateGuidelines from "@/components/design-system/LoadingStateGuidelines";
import AnimationGuidelines from "@/components/design-system/AnimationGuidelines";

const DesignSystem = () => {
  return (
    <div className="min-h-screen bg-background p-6 md:p-10">
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-heading-xl text-charcoal">Sagebright Design System</h1>
            <p className="text-body-lg text-muted-foreground mt-2">
              Developer reference for consistent implementation
            </p>
          </div>
          <Link
            to="/"
            className="text-primary hover:text-primary/80 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </header>

      <main>
        <Tabs defaultValue="colors">
          <TabsList className="mb-8">
            <TabsTrigger value="colors">Colors</TabsTrigger>
            <TabsTrigger value="forms">Form Validation</TabsTrigger>
            <TabsTrigger value="images">Image Guidelines</TabsTrigger>
            <TabsTrigger value="loading">Loading States</TabsTrigger>
            <TabsTrigger value="animations">Animations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="colors">
            <ColorReference />
          </TabsContent>
          
          <TabsContent value="forms">
            <FormValidationExamples />
          </TabsContent>
          
          <TabsContent value="images">
            <ImageUsageGuidelines />
          </TabsContent>
          
          <TabsContent value="loading">
            <LoadingStateGuidelines />
          </TabsContent>
          
          <TabsContent value="animations">
            <AnimationGuidelines />
          </TabsContent>
        </Tabs>
      </main>

      <footer className="mt-16 pt-8 border-t text-center text-muted-foreground">
        <p>Sagebright Design System • Last updated April 2025</p>
      </footer>
    </div>
  );
};

export default DesignSystem;
