
/**
 * Sagebright Component Styles
 * 
 * This file contains styles specific to UI components like
 * border-radius, shadows, etc.
 */

export const components = {
  borderRadius: {
    'lg': 'var(--radius)',
    'md': 'calc(var(--radius) - 2px)',
    'sm': 'calc(var(--radius) - 4px)',
    '2xl': '12px',  
    'DEFAULT': '0.5rem', // 8px (standard radius)
  },
  boxShadow: {
    'card': '0 4px 12px rgba(0, 0, 0, 0.05)',
    'card-hover': '0 8px 16px rgba(0, 0, 0, 0.08)',
    'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    'DEFAULT': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)', // standard shadow
    'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    'none': 'none',
  },
};
