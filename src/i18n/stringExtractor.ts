
import enTranslation from './locales/en.json';
import esTranslation from './locales/es.json';
import fs from 'fs';
import path from 'path';

/**
 * This is a utility for string extraction and management.
 * Not used at runtime, but useful for development workflows to identify 
 * missing translations or to generate references.
 */

// Function to compare translation objects and find missing keys
export const findMissingTranslations = (
  baseTranslation: any,
  targetTranslation: any,
  basePath = ''
): string[] => {
  const missingKeys: string[] = [];

  Object.keys(baseTranslation).forEach(key => {
    const currentPath = basePath ? `${basePath}.${key}` : key;
    
    if (!(key in targetTranslation)) {
      missingKeys.push(currentPath);
    } else if (
      typeof baseTranslation[key] === 'object' && 
      baseTranslation[key] !== null &&
      typeof targetTranslation[key] === 'object' &&
      targetTranslation[key] !== null
    ) {
      const nestedMissingKeys = findMissingTranslations(
        baseTranslation[key], 
        targetTranslation[key], 
        currentPath
      );
      missingKeys.push(...nestedMissingKeys);
    }
  });

  return missingKeys;
};

// Usage example (for documentation purposes):
// 
// // Find missing translations in Spanish compared to English
// const missingInSpanish = findMissingTranslations(enTranslation, esTranslation);
// 
// if (missingInSpanish.length > 0) {
//   console.log('Missing translations in Spanish:', missingInSpanish);
// } else {
//   console.log('All translations are complete in Spanish!');
// }
