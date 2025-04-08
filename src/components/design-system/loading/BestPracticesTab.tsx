
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, ArrowRight } from "lucide-react";
import { Table, TableHead, TableBody, TR, TH, TD } from "./SimpleTable";

const BestPracticesTab = () => {
  return (
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
  );
};

export default BestPracticesTab;
