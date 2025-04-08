
import React, { useState } from 'react';
import LazyImage from './lazy-image';
import { cn } from '@/lib/utils';

export interface SmartImageProps {
  /**
   * Image source URL
   */
  src: string;
  /**
   * Alt text for accessibility (required)
   */
  alt: string;
  /**
   * Optional width
   */
  width?: number | string;
  /**
   * Optional height
   */
  height?: number | string;
  /**
   * Optional CSS classes
   */
  className?: string;
  /**
   * Aspect ratio (default: "16/9")
   */
  aspectRatio?: string;
  /**
   * Object fit property (default: "cover")
   */
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  /**
   * Placeholder type while loading
   */
  placeholder?: 'skeleton' | 'color' | 'icon';
  /**
   * Custom placeholder color when using 'color' placeholder
   */
  placeholderColor?: string;
  /**
   * Whether to apply rounded corners
   */
  rounded?: boolean | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /**
   * Fallback image URL to use if the main image fails to load
   */
  fallbackSrc?: string;
  /**
   * Priority loading (important images above the fold)
   */
  priority?: boolean;
}

/**
 * SmartImage Component
 * 
 * A responsive image component with fallback support and optimized loading.
 * 
 * @example
 * // Basic usage
 * <SmartImage src="/image.jpg" alt="Description" />
 * 
 * // With custom styling
 * <SmartImage 
 *   src="/image.jpg" 
 *   alt="Description" 
 *   className="border-2" 
 *   rounded="lg"
 *   objectFit="contain" 
 * />
 * 
 * // With fallback
 * <SmartImage 
 *   src="/might-fail.jpg" 
 *   alt="Description" 
 *   fallbackSrc="/fallback.jpg" 
 *   placeholder="skeleton" 
 * />
 */
const SmartImage = ({
  src,
  alt,
  width,
  height,
  className,
  aspectRatio = '16/9',
  objectFit = 'cover',
  placeholder = 'skeleton',
  placeholderColor = '#f3f4f6',
  rounded = 'md',
  fallbackSrc,
  priority = false,
  ...props
}: SmartImageProps & React.ImgHTMLAttributes<HTMLImageElement>) => {
  const [imgSrc, setImgSrc] = useState<string>(src || '');
  const [hasError, setHasError] = useState<boolean>(false);

  // Handle image loading error
  const handleError = () => {
    setHasError(true);
    if (fallbackSrc) {
      setImgSrc(fallbackSrc);
    }
  };

  // Determine rounded corner classes based on the rounded prop
  const getRoundedClass = () => {
    if (rounded === true) return 'rounded';
    if (rounded === 'sm') return 'rounded-sm';
    if (rounded === 'md') return 'rounded-md';
    if (rounded === 'lg') return 'rounded-lg';
    if (rounded === 'xl') return 'rounded-xl';
    if (rounded === 'full') return 'rounded-full';
    return '';
  };

  // If src is empty and no fallback, render placeholder block
  if (!src && !fallbackSrc) {
    return (
      <div 
        className={cn(
          'flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400',
          getRoundedClass(),
          className
        )}
        style={{ 
          aspectRatio,
          width: width || '100%',
          height: height,
        }}
        {...props}
      >
        {alt || 'Image'}
      </div>
    );
  }

  // If there's an error and no fallback, show alt text block
  if (hasError && !fallbackSrc) {
    return (
      <div 
        className={cn(
          'flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400',
          getRoundedClass(),
          className
        )}
        style={{ 
          aspectRatio,
          width: width || '100%', 
          height: height,
        }}
        {...props}
      >
        {alt || 'Image not available'}
      </div>
    );
  }

  return (
    <LazyImage
      src={imgSrc}
      alt={alt}
      onError={handleError}
      aspectRatio={aspectRatio}
      objectFit={objectFit}
      placeholderColor={placeholderColor}
      className={cn(getRoundedClass(), className)}
      {...(priority ? { loading: 'eager' } : {})}
      {...props}
    />
  );
};

export default SmartImage;
