
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FocusRing, VisuallyHidden, AccessibleTooltip } from "@/components/ui/accessibility";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertTriangle, Info, Check } from "lucide-react";

const AccessibilityGuidelines = () => {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-heading-sm mb-6">Accessibility Guidelines</h2>

        <Tabs defaultValue="focus">
          <TabsList>
            <TabsTrigger value="focus">Focus Management</TabsTrigger>
            <TabsTrigger value="color">Color Contrast</TabsTrigger>
            <TabsTrigger value="aria">ARIA Usage</TabsTrigger>
            <TabsTrigger value="keyboard">Keyboard Navigation</TabsTrigger>
          </TabsList>

          <TabsContent value="focus" className="space-y-6 pt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-subheading-sm font-medium flex items-center">
                    <Check className="text-primary mr-2 h-5 w-5" />
                    Focus Visible States
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    All interactive elements should have a visible focus state to meet WCAG 2.1 Success Criterion 2.4.7 (Focus Visible).
                  </p>
                  
                  <div className="flex flex-col gap-4">
                    <div>
                      <h4 className="text-xs uppercase text-muted-foreground mb-2">Standard Focus Style</h4>
                      <FocusRing>
                        <Button>Focused Button</Button>
                      </FocusRing>
                    </div>
                    
                    <div>
                      <h4 className="text-xs uppercase text-muted-foreground mb-2">Focus Style on Form Fields</h4>
                      <FocusRing>
                        <Input placeholder="Type here..." />
                      </FocusRing>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-subheading-sm font-medium flex items-center">
                    <AlertTriangle className="text-destructive mr-2 h-5 w-5" />
                    Focus Order Guidelines
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Focus order should follow the visual layout and logical reading order to meet WCAG 2.1 Success Criterion 2.4.3 (Focus Order).
                  </p>
                  
                  <div className="space-y-4">
                    <div className="bg-muted p-4 rounded-md">
                      <h4 className="text-xs uppercase text-muted-foreground mb-2">Best Practices</h4>
                      <ul className="list-disc list-inside space-y-2 text-sm">
                        <li>Use logical tab order (avoid using tabindex > 0)</li>
                        <li>Maintain focus when modals open/close</li>
                        <li>Trap focus in dialogs and modals</li>
                        <li>Skip navigation links for keyboard users</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="color" className="space-y-6 pt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-subheading-sm font-medium flex items-center">
                    <Check className="text-primary mr-2 h-5 w-5" />
                    Color Contrast Requirements
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Text and interactive elements must meet minimum contrast ratios to meet WCAG 2.1 Success Criterion 1.4.3 (Contrast Minimum).
                  </p>
                  
                  <div className="space-y-4">
                    <div className="bg-muted p-4 rounded-md">
                      <h4 className="text-xs uppercase text-muted-foreground mb-2">WCAG AA Requirements</h4>
                      <ul className="list-disc list-inside space-y-2 text-sm">
                        <li>Normal text: 4.5:1 contrast ratio</li>
                        <li>Large text (18pt+): 3:1 contrast ratio</li>
                        <li>UI components and graphics: 3:1 contrast ratio</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-subheading-sm font-medium flex items-center">
                    <Info className="text-primary mr-2 h-5 w-5" />
                    Color Examples
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    The following examples demonstrate proper contrast ratios in our design system.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex flex-col gap-3">
                      <div className="bg-primary text-primary-foreground p-3 rounded-md">
                        Primary Button Text (Passes AA)
                      </div>
                      <div className="bg-secondary text-secondary-foreground p-3 rounded-md">
                        Secondary Button Text (Passes AA)
                      </div>
                      <div className="bg-destructive text-destructive-foreground p-3 rounded-md">
                        Error Button Text (Passes AA)
                      </div>
                      <div className="bg-muted text-muted-foreground p-3 rounded-md">
                        Muted Text (Passes AA)
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="aria" className="space-y-6 pt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-subheading-sm font-medium flex items-center">
                    <Check className="text-primary mr-2 h-5 w-5" />
                    ARIA Attributes
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    ARIA attributes should be used to enhance accessibility for custom components.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="bg-muted p-4 rounded-md">
                      <h4 className="text-xs uppercase text-muted-foreground mb-2">Common ARIA Attributes</h4>
                      <ul className="list-disc list-inside space-y-2 text-sm">
                        <li><code>aria-label</code>: Provides a text label</li>
                        <li><code>aria-labelledby</code>: References another element as a label</li>
                        <li><code>aria-describedby</code>: References descriptive text</li>
                        <li><code>aria-hidden</code>: Hides content from screen readers</li>
                        <li><code>aria-live</code>: Announces dynamic content changes</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-subheading-sm font-medium flex items-center">
                    <AlertTriangle className="text-destructive mr-2 h-5 w-5" />
                    ARIA Best Practices
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Follow these guidelines when implementing ARIA in components.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="bg-muted p-4 rounded-md">
                      <h4 className="text-xs uppercase text-muted-foreground mb-2">Do's and Don'ts</h4>
                      <ul className="list-disc list-inside space-y-2 text-sm">
                        <li>Use semantic HTML whenever possible</li>
                        <li>Only use ARIA when native semantics aren't sufficient</li>
                        <li>Test with screen readers (VoiceOver, NVDA, JAWS)</li>
                        <li>Don't use <code>role="presentation"</code> on interactive elements</li>
                        <li>Don't override native semantics unnecessarily</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="keyboard" className="space-y-6 pt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-subheading-sm font-medium flex items-center">
                    <Check className="text-primary mr-2 h-5 w-5" />
                    Keyboard Navigation Requirements
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    All functionality must be operable using a keyboard only to meet WCAG 2.1 Success Criterion 2.1.1 (Keyboard).
                  </p>
                  
                  <div className="space-y-4">
                    <div className="bg-muted p-4 rounded-md">
                      <h4 className="text-xs uppercase text-muted-foreground mb-2">Common Keyboard Interactions</h4>
                      <ul className="list-disc list-inside space-y-2 text-sm">
                        <li><strong>Tab/Shift+Tab:</strong> Navigate between focusable elements</li>
                        <li><strong>Enter/Space:</strong> Activate buttons and links</li>
                        <li><strong>Arrow keys:</strong> Navigate within components (menus, sliders)</li>
                        <li><strong>Escape:</strong> Close dialogs, menus, or cancel actions</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-subheading-sm font-medium flex items-center">
                    <AlertTriangle className="text-destructive mr-2 h-5 w-5" />
                    Keyboard Traps
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Users must be able to navigate away from all components using only a keyboard to meet WCAG 2.1 Success Criterion 2.1.2 (No Keyboard Trap).
                  </p>
                  
                  <div className="space-y-4">
                    <div className="bg-muted p-4 rounded-md">
                      <h4 className="text-xs uppercase text-muted-foreground mb-2">Trapping Focus Correctly</h4>
                      <p className="text-sm mb-2">Focus should only be trapped in:</p>
                      <ul className="list-disc list-inside space-y-2 text-sm">
                        <li>Modal dialogs (with ESC key to exit)</li>
                        <li>Full-screen experiences (with a clearly defined exit method)</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8">
              <h3 className="text-subheading-sm mb-4">Interactive Demo</h3>
              <div className="bg-card p-6 rounded-lg border">
                <p className="text-sm text-muted-foreground mb-4">
                  This demo showcases keyboard navigation. Try pressing Tab to navigate through the elements.
                </p>
                
                <div className="flex flex-col gap-4 max-w-md">
                  <Input placeholder="First Name" aria-label="First Name" />
                  <Input placeholder="Last Name" aria-label="Last Name" />
                  
                  <div className="flex gap-3">
                    <AccessibleTooltip content="Submit form">
                      <Button>Submit</Button>
                    </AccessibleTooltip>
                    
                    <AccessibleTooltip content="Clear the form">
                      <Button variant="outline">Reset</Button>
                    </AccessibleTooltip>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
};

export default AccessibilityGuidelines;
