
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, ArrowRight, Check } from "lucide-react";

const LoadingStateGuidelines = () => {
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
                    <li>Content that takes &gt;300ms to load</li>
                    <li>Initial page load for main content</li>
                    <li>Data that refreshes periodically</li>
                    <li>Complex layouts with multiple data sources</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="button" className="mt-6">
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
        </TabsContent>
        
        <TabsContent value="page" className="mt-6">
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
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="best-practices" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Loading State Best Practices</CardTitle>
              <CardDescription>
                Guidelines for consistent and effective loading indicators
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-subheading-sm mb-3">Do's</h3>
                    <ul className="space-y-3">
                      <li className="flex gap-3">
                        <Check className="h-5 w-5 text-green-500 shrink-0" />
                        <p className="text-sm">Match loading state visual style to final content</p>
                      </li>
                      <li className="flex gap-3">
                        <Check className="h-5 w-5 text-green-500 shrink-0" />
                        <p className="text-sm">Use skeleton loaders for content that takes {'>'}300ms to load</p>
                      </li>
                      <li className="flex gap-3">
                        <Check className="h-5 w-5 text-green-500 shrink-0" />
                        <p className="text-sm">Disable interactive elements during loading</p>
                      </li>
                      <li className="flex gap-3">
                        <Check className="h-5 w-5 text-green-500 shrink-0" />
                        <p className="text-sm">Add subtle animation to indicate activity</p>
                      </li>
                      <li className="flex gap-3">
                        <Check className="h-5 w-5 text-green-500 shrink-0" />
                        <p className="text-sm">Maintain consistent UX pattern across the application</p>
                      </li>
                      <li className="flex gap-3">
                        <Check className="h-5 w-5 text-green-500 shrink-0" />
                        <p className="text-sm">Show loading state immediately when an action is triggered</p>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-subheading-sm mb-3">Don'ts</h3>
                    <ul className="space-y-3">
                      <li className="flex gap-3">
                        <ArrowRight className="h-5 w-5 text-red-500 shrink-0" />
                        <p className="text-sm">Don't freeze the UI during loading – always show some feedback</p>
                      </li>
                      <li className="flex gap-3">
                        <ArrowRight className="h-5 w-5 text-red-500 shrink-0" />
                        <p className="text-sm">Avoid layout shifts when transitioning from loading to loaded states</p>
                      </li>
                      <li className="flex gap-3">
                        <ArrowRight className="h-5 w-5 text-red-500 shrink-0" />
                        <p className="text-sm">Don't use spinners for content loads longer than 1 second</p>
                      </li>
                      <li className="flex gap-3">
                        <ArrowRight className="h-5 w-5 text-red-500 shrink-0" />
                        <p className="text-sm">Avoid blocking the entire page for single component loading</p>
                      </li>
                      <li className="flex gap-3">
                        <ArrowRight className="h-5 w-5 text-red-500 shrink-0" />
                        <p className="text-sm">Don't use different loading indicators for similar components</p>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-subheading-sm mb-3">Component-specific Guidelines</h3>
                    <Table className="w-full">
                      <TableHead>
                        <TR>
                          <TH>Component</TH>
                          <TH>Loading Pattern</TH>
                        </TR>
                      </TableHead>
                      <TableBody>
                        <TR>
                          <TD>Buttons</TD>
                          <TD>Spinner + "Loading" text, disabled state</TD>
                        </TR>
                        <TR>
                          <TD>Forms</TD>
                          <TD>Disabled fields + loading button during submission</TD>
                        </TR>
                        <TR>
                          <TD>Cards</TD>
                          <TD>Skeleton with header, content, and action areas</TD>
                        </TR>
                        <TR>
                          <TD>Tables</TD>
                          <TD>Skeleton rows with column structure preserved</TD>
                        </TR>
                        <TR>
                          <TD>Lists</TD>
                          <TD>Skeleton items with consistent height</TD>
                        </TR>
                        <TR>
                          <TD>Images</TD>
                          <TD>Skeleton with correct aspect ratio + blur-up</TD>
                        </TR>
                        <TR>
                          <TD>Charts</TD>
                          <TD>Skeleton with axes + animated gradient</TD>
                        </TR>
                      </TableBody>
                    </Table>
                  </div>
                  
                  <div>
                    <h3 className="text-subheading-sm mb-3">Accessibility Considerations</h3>
                    <div className="prose max-w-none text-sm">
                      <ul>
                        <li>Add <code>aria-busy="true"</code> to elements that are loading</li>
                        <li>Use <code>aria-live="polite"</code> regions for loading state announcements</li>
                        <li>Ensure loading indicators have sufficient color contrast (min 3:1)</li>
                        <li>Avoid relying solely on color to indicate loading states</li>
                        <li>Announce when long loading processes are complete</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Simple table components for styling in this context
const Table = ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
  <div className="w-full overflow-auto">
    <table className={cn("w-full caption-bottom text-sm", className)} {...props} />
  </div>
);

const TableHead = (props: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <thead {...props} />
);

const TableBody = (props: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody {...props} />
);

const TR = (props: React.HTMLAttributes<HTMLTableRowElement>) => (
  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted" {...props} />
);

const TH = (props: React.ThHTMLAttributes<HTMLTableCellElement>) => (
  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground" {...props} />
);

const TD = (props: React.TdHTMLAttributes<HTMLTableCellElement>) => (
  <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0" {...props} />
);

// Helper function to combine class names
const cn = (...inputs: any[]): string => {
  return inputs.filter(Boolean).join(" ");
};

export default LoadingStateGuidelines;
