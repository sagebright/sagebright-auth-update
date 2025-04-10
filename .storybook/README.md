
# Sagebright Storybook

This directory contains the configuration for Sagebright's Storybook setup.

## Getting Started

To run Storybook locally:

```bash
npm run storybook
```

To build Storybook for deployment:

```bash
npm run build-storybook
```

## Creating Stories

### Basic Story Structure

Stories should be placed in the same directory as the component they document, with a `.stories.tsx` extension:

```tsx
// Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    // Describe props here
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: 'default',
    children: 'Button',
  },
};
```

### Organizing Stories

Stories are organized into categories:

- **UI**: Basic UI components (Button, Card, etc.)
- **Forms**: Form elements (Input, Checkbox, etc.)
- **Layout**: Layout components (Grid, Container, etc.)
- **Sage**: Sage-specific components (ChatBubble, ReflectionForm, etc.)

### Documentation

Use JSDoc style comments and prop tables to document components:

```tsx
/**
 * Button component for triggering actions.
 * 
 * @example
 * ```tsx
 * <Button variant="primary">Click me</Button>
 * ```
 */
```

### Testing in Storybook

You can use Storybook for interaction testing. See the official docs for more details:
https://storybook.js.org/docs/react/writing-tests/interaction-testing

## Configuration

- `main.ts`: Main Storybook configuration
- `preview.ts`: Preview configuration, including global decorators
- `manager.ts`: Manager configuration, including theme

## Theming

This Storybook is themed to match Sagebright's visual identity. To modify the theme, edit `manager.ts`.
