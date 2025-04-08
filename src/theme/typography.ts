
/**
 * Sagebright Typography System
 * 
 * This file defines our font families, sizes, weights and line heights.
 * We use semantic naming (heading, body, etc.) for consistent text styling.
 */

export const typography = {
  fontFamily: {
    sans: ['Inter', 'sans-serif'],
    dmSans: ['DM Sans', 'sans-serif'],
    helvetica: ['"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
    roboto: ['Roboto', 'Arial', 'sans-serif'],
  },
  fontSize: {
    // Display typography
    'display-lg': ['4rem', { lineHeight: '1.2', fontWeight: '700' }],    // 64px
    'display': ['3.5rem', { lineHeight: '1.2', fontWeight: '700' }],     // 56px
    'display-sm': ['3rem', { lineHeight: '1.2', fontWeight: '700' }],    // 48px
    
    // Heading typography
    'heading-xl': ['2.5rem', { lineHeight: '1.3', fontWeight: '700' }],  // 40px
    'heading': ['2rem', { lineHeight: '1.3', fontWeight: '600' }],       // 32px
    'heading-sm': ['1.75rem', { lineHeight: '1.3', fontWeight: '600' }], // 28px
    
    // Subheading typography
    'subheading': ['1.5rem', { lineHeight: '1.4', fontWeight: '500' }],  // 24px
    'subheading-sm': ['1.25rem', { lineHeight: '1.4', fontWeight: '500' }], // 20px
    
    // Body text typography
    'body-lg': ['1.25rem', { lineHeight: '1.5', fontWeight: '400' }],    // 20px
    'body': ['1.125rem', { lineHeight: '1.5', fontWeight: '400' }],      // 18px
    'body-sm': ['1rem', { lineHeight: '1.5', fontWeight: '400' }],       // 16px
    'body-xs': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],   // 14px
    
    // Utility typography
    'caption': ['0.75rem', { lineHeight: '1.5', fontWeight: '400' }],    // 12px
    'cta': ['1.125rem', { lineHeight: '1.3', fontWeight: '600' }],       // 18px button text
    
    // Legacy font-sizes (for backward compatibility)
    'headline': ['2.5rem', { lineHeight: '1.3', fontWeight: '700' }],    // 40px
    'headline-lg': ['3.5rem', { lineHeight: '1.3', fontWeight: '700' }], // 56px
    'subheading-lg': ['2rem', { lineHeight: '1.3', fontWeight: '500' }], // 32px
  },
};
