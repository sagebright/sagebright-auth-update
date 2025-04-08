import React from "react";
import { 
  SkeletonText, 
  SkeletonAvatar, 
  SkeletonCard,
  ContactFormSkeleton
} from "@/components/ui/skeleton";

const SkeletonPreview = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-heading mb-8">Skeleton Components</h1>
      
      <section className="mb-12">
        <h2 className="text-subheading mb-4">Skeleton Text</h2>
        <div className="space-y-6 p-6 border rounded-lg">
          <div>
            <h3 className="text-body-sm mb-2">Single Line</h3>
            <SkeletonText />
          </div>
          
          <div>
            <h3 className="text-body-sm mb-2">Multiple Lines</h3>
            <SkeletonText lines={3} />
          </div>
          
          <div>
            <h3 className="text-body-sm mb-2">Varying Widths</h3>
            <SkeletonText 
              lines={4} 
              width={["100%", "80%", "90%", "70%"]} 
            />
          </div>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="text-subheading mb-4">Skeleton Avatar</h2>
        <div className="p-6 border rounded-lg">
          <div className="flex items-center gap-4 mb-6">
            <div>
              <h3 className="text-body-sm mb-2">Small</h3>
              <SkeletonAvatar size="sm" />
            </div>
            <div>
              <h3 className="text-body-sm mb-2">Medium</h3>
              <SkeletonAvatar size="md" />
            </div>
            <div>
              <h3 className="text-body-sm mb-2">Large</h3>
              <SkeletonAvatar size="lg" />
            </div>
            <div>
              <h3 className="text-body-sm mb-2">Extra Large</h3>
              <SkeletonAvatar size="xl" />
            </div>
          </div>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="text-subheading mb-4">Skeleton Card</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-body-sm mb-2">Card with Header</h3>
            <SkeletonCard />
          </div>
          <div>
            <h3 className="text-body-sm mb-2">Card with Header and Footer</h3>
            <SkeletonCard footer={true} />
          </div>
          <div>
            <h3 className="text-body-sm mb-2">Card without Header</h3>
            <SkeletonCard header={false} />
          </div>
          <div>
            <h3 className="text-body-sm mb-2">Custom Card</h3>
            <SkeletonCard className="border-primary" />
          </div>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="text-subheading mb-4">Contact Form Skeleton</h2>
        <ContactFormSkeleton />
      </section>
      
      <section className="mb-12">
        <h2 className="text-subheading mb-4">Composite Example</h2>
        <div className="p-6 border rounded-lg">
          <div className="flex gap-4 mb-6">
            <SkeletonAvatar size="lg" />
            <div className="flex-1">
              <SkeletonText className="mb-1" width="40%" />
              <SkeletonText className="mb-3" width="25%" />
              <SkeletonText lines={3} width={["100%", "95%", "90%"]} />
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <SkeletonCard header={false} />
            <SkeletonCard header={false} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default SkeletonPreview;
