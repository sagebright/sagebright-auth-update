
import React from 'react';
import LazyImage from './lazy-image';
import { cn } from '@/lib/utils';

export type PlaceholderType = 'blur' | 'color' | 'skeleton' | 'none';
export type ImageLayout = 'fill' | 'responsive' | 'fixed' | 'intrinsic';

export interface SmartImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number | string;
  height?: number | string;
  sizes?: string;
  priority?: boolean;
  quality?: number;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  placeholderType?: PlaceholderType;
  placeholderColor?: string;
  aspectRatio?: string;
  layout?: ImageLayout;
  loading?: 'lazy' | 'eager';
  fallbackSrc?: string;
  onError?: () => void;
  onLoad?: () => void;
}

/**
 * SmartImage - A comprehensive image component with optimization features
 * 
 * Provides consistent handling for:
 * - Lazy loading with IntersectionObserver
 * - Responsive sizing and srcSet handling
 * - Placeholder strategies while loading
 * - Aspect ratio management
 * - Fallback handling
 */
const SmartImage = ({
  src,
  alt,
  className = '',
  width,
  height,
  sizes = '100vw',
  priority = false,
  quality = 80,
  objectFit = 'cover',
  placeholderType = 'skeleton',
  placeholderColor = '#f3f4f6',
  aspectRatio = 'auto',
  layout = 'responsive',
  loading: loadingProp,
  fallbackSrc,
  onError,
  onLoad,
  ...rest
}: SmartImageProps) => {
  const [error, setError] = React.useState(false);
  
  // Determine loading strategy based on priority prop
  const loading = priority ? 'eager' : loadingProp || 'lazy';
  
  // Handle error state and fallback image
  const handleError = () => {
    setError(true);
    onError?.();
  };
  
  // Set proper src based on error state and fallback availability
  const imageSrc = (error && fallbackSrc) ? fallbackSrc : src;
  
  // Calculate srcSet for responsive images if width/height are numbers
  const generateSrcSet = () => {
    if (typeof width !== 'number' || !src || src.startsWith('data:') || src.startsWith('blob:')) {
      return undefined;
    }
    
    // Assuming a CDN or image service that can resize via URL parameters
    // This is a simplified implementation - replace with actual image service logic
    const widths = [0.5, 1, 1.5, 2].map(scale => Math.round(width * scale));
    return widths.map(w => `${src} ${w}w`).join(', ');
  };
  
  const srcSet = generateSrcSet();
  
  // Choose placeholder strategy based on type
  const getPlaceholderStyles = () => {
    switch (placeholderType) {
      case 'color':
        return { backgroundColor: placeholderColor };
      case 'skeleton':
        return { backgroundColor: placeholderColor, animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' };
      case 'blur':
        return { backdropFilter: 'blur(8px)' };
      default:
        return {};
    }
  };
  
  // Process dimensions based on layout
  const getDimensionStyles = () => {
    if (layout === 'fill') {
      return { width: '100%', height: '100%', position: 'absolute' as const };
    }
    
    const styles: React.CSSProperties = {};
    
    if (width) styles.width = width;
    if (height) styles.height = height;
    
    return styles;
  };
  
  return (
    <LazyImage
      src={imageSrc}
      alt={alt}
      className={cn('smart-image', className)}
      placeholderColor={placeholderColor}
      aspectRatio={aspectRatio} 
      objectFit={objectFit}
      onLoad={onLoad}
      onError={handleError}
      loading={loading}
      sizes={sizes}
      {...(srcSet ? { srcSet } : {})}
      style={{
        ...getPlaceholderStyles(),
        ...getDimensionStyles(),
      }}
      {...rest}
    />
  );
};

export default SmartImage;
