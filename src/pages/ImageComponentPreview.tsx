
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SmartImage from '@/components/ui/smart-image';
import { Skeleton } from '@/components/ui/skeleton';

const ImageComponentPreview = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-heading mb-8">Image Component System</h1>
      
      <Tabs defaultValue="examples">
        <TabsList>
          <TabsTrigger value="examples">Examples</TabsTrigger>
          <TabsTrigger value="usage">Usage Guide</TabsTrigger>
        </TabsList>
        
        <TabsContent value="examples" className="mt-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Usage</CardTitle>
                <CardDescription>Default settings with responsive behavior</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border border-dashed p-4 rounded-md">
                  <SmartImage 
                    src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b" 
                    alt="Computer code on screen" 
                  />
                </div>
                <pre className="bg-muted p-4 rounded-md text-xs overflow-x-auto">
{`<SmartImage 
  src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b" 
  alt="Computer code on screen" 
/>`}
                </pre>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Custom Aspect Ratio</CardTitle>
                <CardDescription>Using 1/1 aspect ratio for square images</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border border-dashed p-4 rounded-md">
                  <SmartImage 
                    src="https://images.unsplash.com/photo-1518770660439-4636190af475" 
                    alt="Circuit board macro" 
                    aspectRatio="1/1"
                  />
                </div>
                <pre className="bg-muted p-4 rounded-md text-xs overflow-x-auto">
{`<SmartImage 
  src="https://images.unsplash.com/photo-1518770660439-4636190af475" 
  alt="Circuit board macro" 
  aspectRatio="1/1"
/>`}
                </pre>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Object Fit Contain</CardTitle>
                <CardDescription>Full image visible without cropping</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border border-dashed p-4 rounded-md">
                  <SmartImage 
                    src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6" 
                    alt="Code on monitor" 
                    objectFit="contain"
                    aspectRatio="16/9"
                  />
                </div>
                <pre className="bg-muted p-4 rounded-md text-xs overflow-x-auto">
{`<SmartImage 
  src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6" 
  alt="Code on monitor" 
  objectFit="contain"
  aspectRatio="16/9"
/>`}
                </pre>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Error Fallback</CardTitle>
                <CardDescription>Shows alt text when image fails to load</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border border-dashed p-4 rounded-md">
                  <SmartImage 
                    src="https://invalid-url-that-will-fail.jpg" 
                    alt="This is a fallback text for failed image" 
                  />
                </div>
                <pre className="bg-muted p-4 rounded-md text-xs overflow-x-auto">
{`<SmartImage 
  src="https://invalid-url-that-will-fail.jpg" 
  alt="This is a fallback text for failed image" 
/>`}
                </pre>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Fallback Image</CardTitle>
                <CardDescription>Loads alternative image on error</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border border-dashed p-4 rounded-md">
                  <SmartImage 
                    src="https://invalid-url-that-will-fail.jpg" 
                    alt="Image with fallback" 
                    fallbackSrc="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d"
                  />
                </div>
                <pre className="bg-muted p-4 rounded-md text-xs overflow-x-auto">
{`<SmartImage 
  src="https://invalid-url-that-will-fail.jpg" 
  alt="Image with fallback" 
  fallbackSrc="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d"
/>`}
                </pre>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Rounded Variants</CardTitle>
                <CardDescription>Different border radius options</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <SmartImage 
                      src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7"
                      alt="Rounded sm" 
                      aspectRatio="1/1"
                      rounded="sm"
                    />
                    <p className="text-xs text-center">rounded="sm"</p>
                  </div>
                  <div className="space-y-2">
                    <SmartImage 
                      src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7"
                      alt="Rounded lg" 
                      aspectRatio="1/1"
                      rounded="lg"
                    />
                    <p className="text-xs text-center">rounded="lg"</p>
                  </div>
                  <div className="space-y-2">
                    <SmartImage 
                      src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7"
                      alt="Rounded full" 
                      aspectRatio="1/1"
                      rounded="full"
                    />
                    <p className="text-xs text-center">rounded="full"</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="usage" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>SmartImage Usage Guide</CardTitle>
              <CardDescription>
                Implementation details and best practices
              </CardDescription>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <h3>Basic Usage</h3>
              <pre className="bg-muted p-4 rounded-md text-xs overflow-x-auto">
{`import SmartImage from '@/components/ui/smart-image';

// Basic usage
<SmartImage src="/image.jpg" alt="Description" />`}
              </pre>
              
              <h3>Key Features</h3>
              <ul>
                <li><strong>Lazy Loading:</strong> Images only load when scrolled into view</li>
                <li><strong>Responsive:</strong> Adapts to container width by default</li>
                <li><strong>Fallbacks:</strong> Handles image loading failures gracefully</li>
                <li><strong>Aspect Ratio Control:</strong> Maintains consistent layouts</li>
                <li><strong>Loading States:</strong> Shows placeholders while loading</li>
              </ul>
              
              <h3>Props Reference</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left">Prop</th>
                    <th className="text-left">Type</th>
                    <th className="text-left">Default</th>
                    <th className="text-left">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>src</td>
                    <td>string</td>
                    <td>-</td>
                    <td>Image URL (required)</td>
                  </tr>
                  <tr>
                    <td>alt</td>
                    <td>string</td>
                    <td>-</td>
                    <td>Alt text for accessibility (required)</td>
                  </tr>
                  <tr>
                    <td>aspectRatio</td>
                    <td>string</td>
                    <td>"16/9"</td>
                    <td>Controls aspect ratio (e.g., "1/1", "4/3")</td>
                  </tr>
                  <tr>
                    <td>objectFit</td>
                    <td>string</td>
                    <td>"cover"</td>
                    <td>How the image fills its container</td>
                  </tr>
                  <tr>
                    <td>rounded</td>
                    <td>boolean | string</td>
                    <td>"md"</td>
                    <td>Border radius (true, "sm", "md", "lg", "xl", "full")</td>
                  </tr>
                  <tr>
                    <td>fallbackSrc</td>
                    <td>string</td>
                    <td>-</td>
                    <td>Fallback image URL if main image fails</td>
                  </tr>
                  <tr>
                    <td>priority</td>
                    <td>boolean</td>
                    <td>false</td>
                    <td>Whether to prioritize loading (for above-fold images)</td>
                  </tr>
                </tbody>
              </table>
              
              <h3>Best Practices</h3>
              <ol>
                <li><strong>Always provide alt text</strong> for accessibility</li>
                <li><strong>Choose appropriate aspect ratios</strong> for your content type:
                  <ul>
                    <li>16/9 for landscapes and videos</li>
                    <li>4/3 for standard photos</li>
                    <li>1/1 for avatars and profile pictures</li>
                  </ul>
                </li>
                <li><strong>Use fallbackSrc</strong> for critical images that must display something</li>
                <li><strong>Use priority</strong> for important above-the-fold images only</li>
              </ol>
              
              <h3>Implementation Notes</h3>
              <p>
                This component uses <code>LazyImage</code> internally for intersection observer-based lazy loading.
                It adds error handling, aspect ratio control, and flexible styling options.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ImageComponentPreview;
