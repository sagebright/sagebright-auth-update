
import React from "react";
import { ExampleForm } from "@/components/form";
import AppLayout from "@/components/layout/AppShell";
import { useToast } from "@/hooks/use-toast";

const FormComponentsExample = () => {
  const { toast } = useToast();

  const handleFormComplete = (data: any) => {
    toast({
      title: "Form Data",
      description: (
        <pre className="mt-2 w-full max-w-xs rounded-md bg-slate-950 p-4 overflow-x-auto">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
      duration: 10000,
    });
  };

  return (
    <AppLayout>
      <div className="container mx-auto py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-charcoal mb-2">Form Components Example</h1>
          <p className="text-muted-foreground">
            This page demonstrates the standard form components and validation pattern.
          </p>
        </div>

        <div className="mb-12">
          <ExampleForm onComplete={handleFormComplete} />
        </div>
      </div>
    </AppLayout>
  );
};

export default FormComponentsExample;
