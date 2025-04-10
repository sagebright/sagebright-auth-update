
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Animated, AnimatedList, HoverAnimation } from "@/components/ui/animated";

const AnimationGuidelines = () => {
  const [showDemo, setShowDemo] = useState(false);
  const [listDemo, setListDemo] = useState(false);

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Animation Timing Standards</CardTitle>
            <CardDescription>
              Consistent animation durations and timing functions across the application
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Standard Durations</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Fast (200ms):</strong> Button hover, small UI feedback</li>
                  <li><strong>Normal (300ms):</strong> Content transitions, fade effects</li>
                  <li><strong>Slow (500ms):</strong> Page transitions, major UI changes</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Timing Functions</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>ease-out:</strong> For entering animations (default)</li>
                  <li><strong>ease-in:</strong> For exiting animations</li>
                  <li><strong>ease-in-out:</strong> For continuous or looping animations</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Animation Use Cases</CardTitle>
            <CardDescription>
              When to use different animation types
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Recommended Uses</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Fade-in/out:</strong> Content loading, modals, alerts</li>
                  <li><strong>Scale:</strong> Button feedback, selections, focus states</li>
                  <li><strong>Slide:</strong> Sidebars, navigation, content transitions</li>
                  <li><strong>Combined:</strong> Page transitions, major UI changes</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Best Practices</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Keep animations subtle - they should enhance not distract</li>
                  <li>Use consistent animations for similar actions</li>
                  <li>Respect user preference for reduced motion</li>
                  <li>Stagger animations when multiple elements appear</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Animation Examples</CardTitle>
          <CardDescription>
            Interactive examples of Sagebright animation system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="entrance">
            <TabsList className="mb-4">
              <TabsTrigger value="entrance">Entrance Animations</TabsTrigger>
              <TabsTrigger value="hover">Hover Effects</TabsTrigger>
              <TabsTrigger value="staggered">Staggered Animations</TabsTrigger>
              <TabsTrigger value="loading">Loading States</TabsTrigger>
            </TabsList>
            
            <TabsContent value="entrance" className="space-y-4">
              <div className="flex gap-4 flex-wrap">
                <Button onClick={() => setShowDemo(!showDemo)}>
                  {showDemo ? "Reset Animations" : "Show Animations"}
                </Button>
              </div>
              
              {showDemo && (
                <div className="grid gap-4 md:grid-cols-3 mt-6">
                  <Animated animation="fade-in">
                    <Card className="h-32 flex items-center justify-center">
                      <span className="text-center font-medium">Fade In</span>
                    </Card>
                  </Animated>
                  
                  <Animated animation="scale-in">
                    <Card className="h-32 flex items-center justify-center">
                      <span className="text-center font-medium">Scale In</span>
                    </Card>
                  </Animated>
                  
                  <Animated animation="slide-up">
                    <Card className="h-32 flex items-center justify-center">
                      <span className="text-center font-medium">Slide Up</span>
                    </Card>
                  </Animated>
                  
                  <Animated animation="slide-in-right" delay="300">
                    <Card className="h-32 flex items-center justify-center">
                      <span className="text-center font-medium">Slide Right (delayed)</span>
                    </Card>
                  </Animated>
                  
                  <Animated animation="slide-in-left" delay="500">
                    <Card className="h-32 flex items-center justify-center">
                      <span className="text-center font-medium">Slide Left (delayed)</span>
                    </Card>
                  </Animated>
                  
                  <Animated animation="enter" delay="700">
                    <Card className="h-32 flex items-center justify-center">
                      <span className="text-center font-medium">Combined (delayed)</span>
                    </Card>
                  </Animated>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="hover" className="space-y-4">
              <p className="text-muted-foreground mb-4">Hover over the cards to see effects</p>
              
              <div className="grid gap-4 md:grid-cols-3">
                <HoverAnimation effect="scale">
                  <Card className="h-32 flex items-center justify-center cursor-pointer">
                    <span className="text-center font-medium">Scale Effect</span>
                  </Card>
                </HoverAnimation>
                
                <HoverAnimation effect="brightness">
                  <Card className="h-32 flex items-center justify-center cursor-pointer">
                    <span className="text-center font-medium">Brightness Effect</span>
                  </Card>
                </HoverAnimation>
                
                <HoverAnimation effect="scale-brightness">
                  <Card className="h-32 flex items-center justify-center cursor-pointer">
                    <span className="text-center font-medium">Combined Effect</span>
                  </Card>
                </HoverAnimation>
              </div>
            </TabsContent>
            
            <TabsContent value="staggered" className="space-y-4">
              <div className="flex gap-4 flex-wrap">
                <Button onClick={() => setListDemo(!listDemo)}>
                  {listDemo ? "Reset List Animation" : "Show Staggered List"}
                </Button>
              </div>
              
              {listDemo && (
                <AnimatedList 
                  animation="fade-in" 
                  staggerDelay={150}
                  className="grid gap-3 mt-6"
                >
                  {[1, 2, 3, 4, 5].map(i => (
                    <Card key={i} className="p-4">
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                          {i}
                        </div>
                        <div>
                          <h4 className="font-medium">List Item {i}</h4>
                          <p className="text-sm text-muted-foreground">
                            Staggered animation example
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </AnimatedList>
              )}
            </TabsContent>
            
            <TabsContent value="loading" className="space-y-4">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="p-6">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                    <span className="text-sm font-medium">Spinner</span>
                  </div>
                </Card>
                
                <Card className="p-6">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="relative flex h-8 w-8 items-center justify-center">
                      <span className="absolute h-full w-full rounded-full bg-primary opacity-75 animate-ping"></span>
                      <span className="relative rounded-full h-6 w-6 bg-primary"></span>
                    </div>
                    <span className="text-sm font-medium">Ping</span>
                  </div>
                </Card>
                
                <Card className="p-6">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="flex space-x-1">
                      <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
                      <div className="h-2 w-2 rounded-full bg-primary animate-pulse delay-150"></div>
                      <div className="h-2 w-2 rounded-full bg-primary animate-pulse delay-300"></div>
                    </div>
                    <span className="text-sm font-medium">Pulse</span>
                  </div>
                </Card>
                
                <Card className="p-6">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="h-6 w-6 animate-bounce rounded-full bg-primary"></div>
                    <span className="text-sm font-medium">Bounce</span>
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Usage Examples</CardTitle>
          <CardDescription>
            How to use the animation utilities in your components
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h4 className="font-medium mb-2">Simple Animation Component</h4>
              <pre className="p-4 rounded bg-muted overflow-x-auto">
                <code>{`<Animated animation="fade-in">
  <YourComponent />
</Animated>`}</code>
              </pre>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Delayed Animation</h4>
              <pre className="p-4 rounded bg-muted overflow-x-auto">
                <code>{`<Animated animation="slide-up" delay="300">
  <YourComponent />
</Animated>`}</code>
              </pre>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Staggered List Animation</h4>
              <pre className="p-4 rounded bg-muted overflow-x-auto">
                <code>{`<AnimatedList animation="fade-in" staggerDelay={100}>
  {items.map(item => (
    <ListItem key={item.id} {...item} />
  ))}
</AnimatedList>`}</code>
              </pre>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Hover Animation</h4>
              <pre className="p-4 rounded bg-muted overflow-x-auto">
                <code>{`<HoverAnimation effect="scale-brightness">
  <Card>Your content here</Card>
</HoverAnimation>`}</code>
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnimationGuidelines;
