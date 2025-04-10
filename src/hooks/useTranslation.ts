
import { useTranslation as useReactI18nextTranslation } from 'react-i18next';
import { useMemo } from 'react';

// This extended hook helps with string extraction and management
export const useTranslation = () => {
  const translation = useReactI18nextTranslation();
  const { t, i18n } = translation;

  // Create a wrapped t function that logs missing translations in development
  const tWithTracking = useMemo(() => {
    const wrapped = (key: string, options?: any) => {
      const result = t(key, options);
      
      // In development, log keys that return the key itself (likely missing translations)
      if (process.env.NODE_ENV === 'development' && result === key) {
        console.warn(`[i18n] Missing translation for key: ${key}`);
      }
      
      return result;
    };
    
    return wrapped;
  }, [t]);
  
  return {
    ...translation,
    t: tWithTracking,
  };
};

// Utility to extract translatable keys from components for reference
export const extractTranslationKeys = (content: Record<string, any>) => {
  const keys: string[] = [];
  
  const extract = (obj: any, prefix = '') => {
    if (typeof obj === 'object' && obj !== null) {
      Object.entries(obj).forEach(([key, value]) => {
        const newPrefix = prefix ? `${prefix}.${key}` : key;
        
        if (typeof value === 'object' && value !== null) {
          extract(value, newPrefix);
        } else {
          keys.push(newPrefix);
        }
      });
    }
  };
  
  extract(content);
  return keys;
};
