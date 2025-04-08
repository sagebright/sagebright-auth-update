
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import LazyImage from "@/components/ui/lazy-image";
import { Badge } from "@/components/ui/badge";

// Example SmartImage component to showcase proper image implementation
const SmartImage = ({ 
  src, 
  alt, 
  className, 
  sizes = "100vw", 
  priority = false,
  ...props 
}: React.ImgHTMLAttributes<HTMLImageElement> & { 
  sizes?: string;
  priority?: boolean;
}) => {
  return (
    <LazyImage 
      src={src || ""} 
      alt={alt || ""}
      className={className}
      {...props}
    />
  );
};

const ImageUsageGuidelines = () => {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-heading-sm mb-6">Image Usage Guidelines</h2>
        <p className="text-body mb-4">
          Sagebright follows best practices for image loading, sizing, and accessibility to ensure optimal user experience and performance.
        </p>
      </section>

      <Tabs defaultValue="components">
        <TabsList>
          <TabsTrigger value="components">Components</TabsTrigger>
          <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="responsive">Responsive Strategies</TabsTrigger>
        </TabsList>
        
        <TabsContent value="components" className="mt-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>LazyImage Component</CardTitle>
                <CardDescription>
                  Base component for optimized image loading
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-muted rounded-md p-4">
                    <pre className="text-xs overflow-x-auto">
{`<LazyImage 
  src="/path/to/image.jpg" 
  alt="Descriptive alt text"
  className="rounded-lg" 
  aspectRatio="16/9"
  objectFit="cover"
  placeholderColor="#f3f4f6"
/>`}
                    </pre>
                  </div>
                  
                  <div className="prose max-w-none text-sm">
                    <p><strong>Key Features:</strong></p>
                    <ul>
                      <li>Intersection Observer for lazy loading</li>
                      <li>Built-in placeholders while loading</li>
                      <li>Configurable aspect ratio</li>
                      <li>Object-fit control</li>
                      <li>Smooth fade-in transitions</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Implementation Example</CardTitle>
                <CardDescription>
                  Real-world usage with placeholder
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="h-48 overflow-hidden rounded-md border">
                  <SmartImage 
                    src="https://images.unsplash.com/photo-1498050108023-c5249f4df085" 
                    alt="Laptop with code on screen"
                    className="object-cover"
                  />
                </div>
                
                <div className="bg-muted rounded-md p-4">
                  <pre className="text-xs overflow-x-auto">
{`// Import the component
import LazyImage from '@/components/ui/lazy-image';

// Use in your component
<LazyImage
  src={imageUrl}
  alt="Descriptive alt text"
  className="object-cover"
  aspectRatio="16/9"
/>`}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="accessibility" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Image Accessibility Checklist</CardTitle>
              <CardDescription>
                Ensure all images follow these accessibility guidelines
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Requirement</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="w-[120px]">Priority</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Alt Text</TableCell>
                    <TableCell>All images must have descriptive alt text that conveys the purpose and content of the image</TableCell>
                    <TableCell><Badge variant="destructive">Required</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Decorative Images</TableCell>
                    <TableCell>Use empty alt text (alt="") for decorative images that don't add content value</TableCell>
                    <TableCell><Badge variant="destructive">Required</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Text in Images</TableCell>
                    <TableCell>Avoid text in images when possible. If unavoidable, ensure the text is included in alt text</TableCell>
                    <TableCell><Badge>Recommended</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Color Contrast</TableCell>
                    <TableCell>Ensure sufficient contrast between text and background in infographics and diagrams</TableCell>
                    <TableCell><Badge variant="destructive">Required</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Focus Indicators</TableCell>
                    <TableCell>Clickable images must have visible focus indicators</TableCell>
                    <TableCell><Badge variant="destructive">Required</Badge></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="performance" className="mt-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Optimization Techniques</CardTitle>
                <CardDescription>
                  Methods to ensure fast-loading images
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  <li>
                    <h3 className="text-subheading-sm mb-1">Proper Image Format</h3>
                    <p className="text-sm text-muted-foreground">Use WebP for photos with transparency, SVG for icons and logos, and AVIF for highest compression when supported.</p>
                  </li>
                  <li>
                    <h3 className="text-subheading-sm mb-1">Size Optimization</h3>
                    <p className="text-sm text-muted-foreground">Never serve images larger than their display size. Use responsive images to serve appropriate sizes.</p>
                  </li>
                  <li>
                    <h3 className="text-subheading-sm mb-1">Compression</h3>
                    <p className="text-sm text-muted-foreground">Use tools like ImageOptim, Squoosh, or TinyPNG to compress images without significant quality loss.</p>
                  </li>
                  <li>
                    <h3 className="text-subheading-sm mb-1">Lazy Loading</h3>
                    <p className="text-sm text-muted-foreground">Use LazyImage component to load images only when they enter the viewport.</p>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>
                  Targets for image optimization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Metric</TableHead>
                      <TableHead>Target</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Hero Images</TableCell>
                      <TableCell>&lt; 200KB</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Thumbnails</TableCell>
                      <TableCell>&lt; 50KB</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Background Images</TableCell>
                      <TableCell>&lt; 100KB</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Icons</TableCell>
                      <TableCell>&lt; 5KB (prefer SVG)</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Total Image Weight</TableCell>
                      <TableCell>&lt; 700KB per page</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="responsive" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Responsive Image Strategies</CardTitle>
              <CardDescription>
                Techniques for delivering appropriate images across device sizes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-subheading-sm mb-3">Fluid Width Images</h3>
                    <div className="bg-muted rounded-md p-4">
                      <pre className="text-xs overflow-x-auto">
{`// CSS/Tailwind approach
<img 
  src="/image.jpg" 
  alt="Description" 
  className="w-full h-auto" 
/>

// With aspect ratio control
<div className="aspect-w-16 aspect-h-9">
  <img 
    src="/image.jpg" 
    alt="Description" 
    className="object-cover w-full h-full" 
  />
</div>`}
                      </pre>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-subheading-sm mb-3">Art Direction with Picture Element</h3>
                    <div className="bg-muted rounded-md p-4">
                      <pre className="text-xs overflow-x-auto">
{`<picture>
  <source 
    media="(max-width: 640px)" 
    srcSet="/mobile-image.jpg" 
  />
  <source 
    media="(max-width: 1024px)" 
    srcSet="/tablet-image.jpg" 
  />
  <img 
    src="/desktop-image.jpg" 
    alt="Description" 
    className="w-full h-auto" 
  />
</picture>`}
                      </pre>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-subheading-sm mb-3">Responsive Breakpoint Guidelines</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Breakpoint</TableHead>
                        <TableHead>Width</TableHead>
                        <TableHead>Typical Image Width</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">sm</TableCell>
                        <TableCell>640px</TableCell>
                        <TableCell>Full width: 640px</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">md</TableCell>
                        <TableCell>768px</TableCell>
                        <TableCell>Full width: 768px<br/>Half width: 384px</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">lg</TableCell>
                        <TableCell>1024px</TableCell>
                        <TableCell>Full width: 1024px<br/>Half width: 512px<br/>Third width: 341px</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">xl</TableCell>
                        <TableCell>1280px</TableCell>
                        <TableCell>Full width: 1280px<br/>Half width: 640px<br/>Third width: 427px</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">2xl</TableCell>
                        <TableCell>1536px</TableCell>
                        <TableCell>Full width: 1536px<br/>Half width: 768px<br/>Third width: 512px</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ImageUsageGuidelines;
