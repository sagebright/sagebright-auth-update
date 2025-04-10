
# Contributing to Sagebright

Thank you for your interest in contributing to Sagebright! This document provides guidelines and best practices to follow when working on this project.

## TypeScript Standards

### Type Definitions

- Always use explicit types for component props using interfaces
- Place shared types in the `src/types` directory
- Avoid using `any` whenever possible; use proper typing or `unknown` if necessary
- Use TypeScript's utility types (e.g., `Partial<T>`, `Pick<T>`, `Omit<T>`) when appropriate

```typescript
// Good
interface ButtonProps {
  variant?: 'default' | 'primary' | 'secondary';
  onClick: () => void;
  children: React.ReactNode;
}

// Avoid
const Button = (props: any) => { ... }
```

### Component Structure

- Use functional components with React.FC type annotation
- Use proper React typings for event handlers

```typescript
// Good
const TextField: React.FC<TextFieldProps> = ({ label, value, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };
  
  return <input value={value} onChange={handleChange} />;
};
```

### Default Props

- Define default values in the destructuring pattern
- Use non-nullable types for required props

```typescript
interface CardProps {
  title: string;          // Required
  description?: string;   // Optional
  variant?: 'default' | 'outlined';
}

const Card: React.FC<CardProps> = ({ 
  title, 
  description = '', 
  variant = 'default' 
}) => {
  // ...
};
```

## Code Structure and Organization

### File Organization

- Group related files in dedicated directories
- Use index.ts files for exporting multiple components
- Place utility functions in dedicated utility files
- Organize components by feature or function

```
src/
├── components/
│   ├── auth/        # Authentication-related components
│   ├── ui/          # Basic UI components
│   └── form/        # Form-related components
├── contexts/        # React contexts
├── hooks/           # Custom hooks
├── pages/           # Page components
├── lib/            # Utility functions
└── types/           # TypeScript type definitions
```

### Component Structure

- Each component should have a single responsibility
- Keep components small and focused
- Extract complex logic into custom hooks
- Use composition to build complex components

## Naming Conventions

- Use PascalCase for component names and files
- Use camelCase for variables, functions, and instances
- Use UPPER_CASE for constants
- Use kebab-case for CSS class names and IDs

```typescript
// Component file name: Button.tsx
// Component name
const Button: React.FC<ButtonProps> = () => { ... };

// Variables and functions
const userProfile = { ... };
const handleSubmit = () => { ... };

// Constants
const API_URL = 'https://api.example.com';

// CSS classes
<div className="user-profile-card">...</div>
```

## Code Style

### Imports

- Group imports in the following order:
  1. React and React-related imports
  2. Third-party libraries
  3. Project components
  4. Project utilities, hooks, contexts
  5. Types, interfaces, assets

```typescript
// 1. React imports
import React, { useState, useEffect } from 'react';

// 2. Third-party imports
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// 3. Project components
import { Button } from '@/components/ui/button';

// 4. Project utilities, hooks, contexts
import { useAuth } from '@/contexts/auth/AuthContext';
import { handleApiError } from '@/lib/handleApiError';

// 5. Types, assets
import { UserProfile } from '@/types';
import userIcon from '@/assets/icons/user.svg';
```

### Error Handling

- Use try/catch blocks for error-prone operations
- Provide informative error messages
- Handle edge cases explicitly

### Comments

- Write comments that explain "why", not "what"
- Use JSDoc-style comments for functions and components

```typescript
/**
 * Calculates the total price including tax and shipping
 * @param {number} price - Base price of the item
 * @param {number} taxRate - Tax rate as a decimal (e.g., 0.07 for 7%)
 * @param {number} shipping - Shipping cost
 * @returns {number} Total price
 */
function calculateTotalPrice(price: number, taxRate: number, shipping: number): number {
  // Tax is exempted for international orders - that's why we check origin
  const shouldApplyTax = !isInternationalOrder();
  
  return price + (shouldApplyTax ? price * taxRate : 0) + shipping;
}
```

## Testing

- Write tests for all components and utilities
- Test both success and error cases
- Use meaningful test descriptions

## Pull Requests

- Keep PRs focused on a single feature or bug fix
- Include comprehensive descriptions
- Reference related issues
- Request review from at least one team member

By following these guidelines, you help maintain a consistent and high-quality codebase for Sagebright.
