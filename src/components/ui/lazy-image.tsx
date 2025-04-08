
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  placeholderColor?: string;
  aspectRatio?: string;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  loading?: 'lazy' | 'eager';
  sizes?: string;
}

const LazyImage = ({
  src,
  alt,
  className = '',
  placeholderColor = '#f3f4f6',
  aspectRatio = '16/9',
  objectFit = 'cover',
  loading = 'lazy',
  sizes,
  onLoad: externalOnLoad,
  onError: externalOnError,
  style,
  ...rest
}: LazyImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [inView, setInView] = useState(loading === 'eager');
  const [imgError, setImgError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  
  useEffect(() => {
    // Skip intersection observer for priority/eager loading
    if (loading === 'eager') {
      setInView(true);
      return;
    }
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );
    
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    
    return () => {
      observer.disconnect();
    };
  }, [loading]);
  
  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setIsLoaded(true);
    if (externalOnLoad) externalOnLoad(e);
  };
  
  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setImgError(true);
    if (externalOnError) externalOnError(e);
  };
  
  const containerStyle: React.CSSProperties = {
    aspectRatio: aspectRatio !== 'auto' ? aspectRatio : undefined,
    backgroundColor: placeholderColor,
    ...style,
  };

  // Use aspect-ratio CSS when available, otherwise use paddingBottom technique
  if (aspectRatio !== 'auto' && !('aspectRatio' in document.createElement('div').style)) {
    if (aspectRatio.includes('/')) {
      const [width, height] = aspectRatio.split('/').map(Number);
      const paddingPercentage = (height / width) * 100;
      containerStyle.paddingBottom = `${paddingPercentage}%`;
    }
  }
  
  return (
    <div 
      ref={containerRef}
      className={cn('relative w-full overflow-hidden', className)}
      style={containerStyle}
    >
      {/* Placeholder element */}
      <div 
        className={cn(
          'absolute inset-0 bg-gray-100',
          isLoaded ? 'opacity-0' : 'opacity-100 animate-pulse'
        )}
        style={{ transition: 'opacity 0.3s ease' }}
        aria-hidden="true"
      />
      
      {inView && (
        <img
          ref={imageRef}
          src={src}
          alt={alt}
          loading={loading}
          decoding="async"
          sizes={sizes}
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            'w-full h-full transition-opacity duration-500',
            isLoaded ? 'opacity-100' : 'opacity-0'
          )}
          style={{ objectFit }}
          {...rest}
        />
      )}
      
      {/* Error state fallback */}
      {imgError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500">
          <span className="text-sm">{alt || 'Image not available'}</span>
        </div>
      )}
    </div>
  );
};

export default LazyImage;
