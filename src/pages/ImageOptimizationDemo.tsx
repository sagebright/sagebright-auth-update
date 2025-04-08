
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import SmartImage from '@/components/ui/smart-image';
import LazyImage from '@/components/ui/lazy-image';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { InfoIcon } from 'lucide-react';

export default function ImageOptimizationDemo() {
  const [placeholderType, setPlaceholderType] = useState<'blur' | 'color' | 'skeleton' | 'none'>('skeleton');
  const [objectFit, setObjectFit] = useState<'cover' | 'contain' | 'fill' | 'none'>('cover');
  const [aspectRatio, setAspectRatio] = useState('16/9');
  const [quality, setQuality] = useState(80);
  const [loading, setLoading] = useState<'lazy' | 'eager'>('lazy');
  
  // Demo image URLs with different aspect ratios
  const images = [
    {
      src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
      alt: "Laptop with code",
      description: "High resolution tech image"
    },
    {
      src: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7", 
      alt: "Woman using laptop",
      description: "Portrait orientation photo"
    },
    {
      src: "/lovable-uploads/dashboard-screenshot.webp",
      alt: "Sagebright Dashboard",
      description: "Product screenshot (WebP format)"
    },
    {
      src: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
      alt: "Programming screen",
      description: "Code editor screenshot"
    },
    {
      src: "https://this-image-does-not-exist.jpg",
      alt: "Broken image example",
      description: "Tests fallback handling"
    }
  ];
  
  const customAspectRatio = aspectRatio === 'custom' ? '1/1' : aspectRatio;
  
  return (
    <div className="container max-w-6xl py-12 space-y-12">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Image Optimization Demo</h1>
        <p className="text-muted-foreground">
          Demonstrating the SmartImage component and image optimization strategies for Sagebright.
        </p>
      </div>
      
      <Tabs defaultValue="demo">
        <TabsList className="mb-6">
          <TabsTrigger value="demo">Interactive Demo</TabsTrigger>
          <TabsTrigger value="usage">Usage Examples</TabsTrigger>
          <TabsTrigger value="responsive">Responsive Patterns</TabsTrigger>
          <TabsTrigger value="placeholders">Placeholder Strategies</TabsTrigger>
        </TabsList>
      
        <TabsContent value="demo" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>SmartImage Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="placeholder-type">Placeholder Type</Label>
                  <Select value={placeholderType} onValueChange={(value: any) => setPlaceholderType(value)}>
                    <SelectTrigger id="placeholder-type">
                      <SelectValue placeholder="Placeholder Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="skeleton">Skeleton</SelectItem>
                      <SelectItem value="color">Solid Color</SelectItem>
                      <SelectItem value="blur">Blur</SelectItem>
                      <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="object-fit">Object Fit</Label>
                  <Select value={objectFit} onValueChange={(value: any) => setObjectFit(value)}>
                    <SelectTrigger id="object-fit">
                      <SelectValue placeholder="Object Fit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cover">Cover</SelectItem>
                      <SelectItem value="contain">Contain</SelectItem>
                      <SelectItem value="fill">Fill</SelectItem>
                      <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="aspect-ratio">Aspect Ratio</Label>
                  <Select value={aspectRatio} onValueChange={setAspectRatio}>
                    <SelectTrigger id="aspect-ratio">
                      <SelectValue placeholder="Aspect Ratio" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="16/9">16:9 (Landscape)</SelectItem>
                      <SelectItem value="4/3">4:3 (Standard)</SelectItem>
                      <SelectItem value="1/1">1:1 (Square)</SelectItem>
                      <SelectItem value="9/16">9:16 (Portrait)</SelectItem>
                      <SelectItem value="auto">Auto (Original)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="loading-strategy">Loading Strategy</Label>
                  <Select value={loading} onValueChange={(value: any) => setLoading(value)}>
                    <SelectTrigger id="loading-strategy">
                      <SelectValue placeholder="Loading Strategy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lazy">Lazy Load</SelectItem>
                      <SelectItem value="eager">Eager Load (Priority)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="quality">Quality: {quality}%</Label>
                </div>
                <Slider 
                  id="quality" 
                  defaultValue={[quality]} 
                  min={10} 
                  max={100} 
                  step={5}
                  onValueChange={(values) => setQuality(values[0])} 
                />
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {images.map((image, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{image.alt}</CardTitle>
                  <p className="text-sm text-muted-foreground">{image.description}</p>
                </CardHeader>
                <CardContent className="h-[300px] relative">
                  <SmartImage
                    src={image.src}
                    alt={image.alt}
                    aspectRatio={customAspectRatio}
                    objectFit={objectFit}
                    placeholderType={placeholderType}
                    placeholderColor={placeholderType === 'color' ? '#e2e8f0' : '#f3f4f6'}
                    loading={loading}
                    quality={quality}
                    fallbackSrc="/placeholder.svg"
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="usage" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Basic Usage Examples</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-muted p-4 rounded-md overflow-x-auto">
                <pre className="text-sm">
{`// Basic usage
<SmartImage 
  src="/image.jpg" 
  alt="Description" 
  aspectRatio="16/9"
/>

// With all options
<SmartImage 
  src="/image.jpg" 
  alt="Detailed description for accessibility"
  aspectRatio="4/3"
  objectFit="cover"
  placeholderType="skeleton"
  placeholderColor="#f3f4f6"
  priority={true}
  quality={85}
  sizes="(max-width: 768px) 100vw, 50vw"
  className="rounded-lg shadow-sm"
  fallbackSrc="/placeholder.svg"
/>`}
                </pre>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h3 className="font-medium">Basic Example</h3>
                  <div className="aspect-w-16 aspect-h-9 border border-gray-200 rounded-md overflow-hidden">
                    <SmartImage 
                      src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"
                      alt="Computer with code" 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Within Card Component</h3>
                  <Card>
                    <AspectRatio ratio={16/9}>
                      <SmartImage 
                        src="https://images.unsplash.com/photo-1518770660439-4636190af475"
                        alt="Circuit board macro" 
                        objectFit="cover"
                      />
                    </AspectRatio>
                    <CardContent className="pt-4">
                      <h4 className="font-medium">Tech Image Example</h4>
                      <p className="text-sm text-muted-foreground">Using SmartImage inside AspectRatio</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="responsive" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Responsive Image Patterns</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="prose max-w-none">
                <p>The SmartImage component handles several responsive patterns automatically:</p>
                <ul>
                  <li><strong>Resolution switching</strong>: Uses srcSet to deliver the right size for the viewport</li>
                  <li><strong>Aspect ratio preservation</strong>: Maintains consistent ratios across viewports</li>
                  <li><strong>Lazy loading</strong>: Only loads images when they enter the viewport</li>
                </ul>
              </div>
              
              <Separator />
              
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Example: Same Image at Different Breakpoints</h3>
                
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">This image adjusts to container width at each breakpoint</p>
                  <div className="w-full border border-gray-200 rounded-md overflow-hidden">
                    <SmartImage 
                      src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d"
                      alt="Person using laptop" 
                      aspectRatio="16/9"
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 75vw, 50vw"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Resize your browser to see how the image responds to different viewports
                  </p>
                </div>
                
                <div className="bg-muted p-4 rounded-md overflow-x-auto">
                  <pre className="text-sm">
{`// Using sizes attribute for responsive delivery
<SmartImage 
  src="/image.jpg" 
  alt="Description" 
  aspectRatio="16/9"
  sizes="(max-width: 640px) 100vw, (max-width: 768px) 75vw, 50vw"
/>`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="placeholders" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Placeholder Strategies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p>Different placeholder strategies enhance perceived performance during image loading:</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-sm">Skeleton</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="aspect-w-1 aspect-h-1 border border-gray-200 rounded-md overflow-hidden">
                      <SmartImage 
                        src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"
                        alt="Computer with code"
                        placeholderType="skeleton" 
                        loading="lazy"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Animated pulse effect</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-sm">Color</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="aspect-w-1 aspect-h-1 border border-gray-200 rounded-md overflow-hidden">
                      <SmartImage 
                        src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"
                        alt="Computer with code"
                        placeholderType="color"
                        placeholderColor="#e2e8f0"
                        loading="lazy"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Solid color background</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-sm">Blur</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="aspect-w-1 aspect-h-1 border border-gray-200 rounded-md overflow-hidden">
                      <SmartImage 
                        src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"
                        alt="Computer with code"
                        placeholderType="blur"
                        loading="lazy"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Blurred placeholder effect</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-sm">None</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="aspect-w-1 aspect-h-1 border border-gray-200 rounded-md overflow-hidden">
                      <SmartImage 
                        src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"
                        alt="Computer with code"
                        placeholderType="none"
                        loading="lazy"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">No placeholder (blank until loaded)</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
