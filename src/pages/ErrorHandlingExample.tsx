
import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { handleApiError, showSuccess, showInfo } from "@/lib/handleApiError";
import ErrorBoundary from "@/components/ErrorBoundary";

// Component that will throw an error
const ErrorComponent = () => {
  React.useEffect(() => {
    throw new Error("This is a component error");
  }, []);
  
  return <div>This will never render</div>;
};

const ErrorHandlingExample = () => {
  const triggerToastError = () => {
    handleApiError(new Error("This is an example error"), {
      fallbackMessage: "Something went wrong with the operation"
    });
  };

  const triggerToastSuccess = () => {
    showSuccess("Operation completed successfully!");
  };

  const triggerToastInfo = () => {
    showInfo("Here's some useful information");
  };

  const triggerApiError = async () => {
    try {
      // Simulate an API call that fails
      await new Promise((_, reject) => 
        setTimeout(() => reject(new Error("API request failed")), 500)
      );
    } catch (error) {
      handleApiError(error, {
        context: "example API call",
        fallbackMessage: "Failed to fetch data from the API"
      });
    }
  };

  return (
    <AppShell>
      <div className="container mx-auto py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-charcoal mb-2">Error Handling Examples</h1>
          <p className="text-muted-foreground">
            This page demonstrates the different ways to handle errors in the application.
          </p>
        </div>

        <div className="grid gap-8">
          {/* Toast notifications */}
          <section className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Toast Notifications</h2>
            <div className="flex flex-wrap gap-4">
              <Button onClick={triggerToastError} variant="destructive">
                Show Error Toast
              </Button>
              <Button onClick={triggerToastSuccess} variant="default">
                Show Success Toast
              </Button>
              <Button onClick={triggerToastInfo} variant="outline">
                Show Info Toast
              </Button>
            </div>
          </section>

          {/* API error handling */}
          <section className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold mb-4">API Error Handling</h2>
            <Button onClick={triggerApiError} variant="secondary">
              Simulate API Error
            </Button>
            <p className="mt-4 text-muted-foreground text-sm">
              This button simulates an API call that fails and shows how errors are handled
              using the handleApiError utility.
            </p>
          </section>

          {/* Error boundary example */}
          <section className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Error Boundary</h2>
            <p className="mb-4 text-muted-foreground">
              The component below will throw an error, but it will be caught by the ErrorBoundary.
            </p>
            <div className="border p-4 rounded-md">
              <ErrorBoundary>
                {/* This will trigger when button is clicked */}
                <Button
                  onClick={() => {
                    throw new Error("Deliberate error");
                  }}
                  variant="outline"
                  className="mb-4"
                >
                  Trigger Error
                </Button>
              </ErrorBoundary>
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  );
};

export default ErrorHandlingExample;
