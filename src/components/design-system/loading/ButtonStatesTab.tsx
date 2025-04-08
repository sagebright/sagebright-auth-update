
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Check } from "lucide-react";

const ButtonStatesTab = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const handleButtonClick = () => {
    setIsLoading(true);
    setIsSuccess(false);
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      
      setTimeout(() => {
        setIsSuccess(false);
      }, 2000);
    }, 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Button Loading States</CardTitle>
        <CardDescription>
          Provide feedback during form submissions and actions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-subheading-sm">Button States</h3>
              <div className="flex flex-wrap gap-4">
                <Button 
                  onClick={handleButtonClick} 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading
                    </>
                  ) : isSuccess ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Success
                    </>
                  ) : (
                    "Click Me"
                  )}
                </Button>
                
                <Button variant="outline">Default</Button>
                
                <Button disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading
                </Button>
                
                <Button variant="outline" disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing
                </Button>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-subheading-sm">Loading Indicators</h3>
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center justify-center h-10 w-10 bg-muted rounded-md">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-primary rounded-full animate-pulse"></div>
                  <div className="h-2 w-2 bg-primary rounded-full animate-pulse delay-150"></div>
                  <div className="h-2 w-2 bg-primary rounded-full animate-pulse delay-300"></div>
                </div>
                
                <div className="h-1 w-24 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-1/2"></div>
                </div>
                
                <div className="h-1 w-24 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-1/3 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <div className="bg-muted rounded-md p-4">
              <pre className="text-xs overflow-x-auto">
{`import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Check } from "lucide-react";

export function LoadingButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const handleClick = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      
      setTimeout(() => {
        setIsSuccess(false);
      }, 2000);
    }, 2000);
  };

  return (
    <Button 
      onClick={handleClick} 
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading
        </>
      ) : isSuccess ? (
        <>
          <Check className="mr-2 h-4 w-4" />
          Success
        </>
      ) : (
        "Click Me"
      )}
    </Button>
  );
}`}
              </pre>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ButtonStatesTab;
