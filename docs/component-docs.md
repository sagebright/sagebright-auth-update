
# Sagebright Component Documentation Standard

This document outlines the standardized approach to documenting components in the Sagebright application.

## Component Folder Structure

Components should be organized as follows:

```
src/components/
├── component-name/
│   ├── index.ts            // Exports the component and its types
│   ├── ComponentName.tsx   // Main component implementation
│   ├── ComponentName.test.tsx  // Tests for the component (optional)
│   ├── ComponentName.stories.tsx  // Storybook stories (when applicable)
│   ├── README.md           // Component documentation
│   └── subcomponents/      // (if applicable)
│       └── SubComponent.tsx
```

For simpler components, a flat structure is acceptable:

```
src/components/
├── ComponentName.tsx       // Component with JSDoc comments
└── index.ts                // Export barrel file (optional)
```

## Component Documentation

### README.md Format

Each complex component or component group should include a README.md with the following sections:

```markdown
# ComponentName

Brief description of the component's purpose and main functionality.

## Features

- Feature 1
- Feature 2
- Feature 3

## Usage

```tsx
import { ComponentName } from '@/components/component-name';

<ComponentName prop1="value" prop2={value} />
```

## Props

| Name     | Type                   | Default     | Description                      |
|----------|------------------------|-------------|----------------------------------|
| `prop1`  | `string`               | `"default"` | Description of prop1             |
| `prop2`  | `number`               | `0`         | Description of prop2             |
| `prop3`  | `'option1' \| 'option2'` | `'option1'` | Description of prop3 options     |

## Examples

### Basic Example
```tsx
<ComponentName prop1="example" />
```

### Advanced Example
```tsx
<ComponentName 
  prop1="advanced" 
  prop2={42} 
  prop3="option2"
  onChange={(value) => console.log(value)} 
/>
```

## Accessibility

Any accessibility considerations or ARIA attributes used.

## Notes

Additional information, edge cases, or known limitations.
```

### JSDoc Comments

For components without separate README files, use comprehensive JSDoc comments:

```tsx
/**
 * ComponentName - Brief description
 *
 * A component that provides [functionality description].
 *
 * @example
 * ```tsx
 * <ComponentName prop1="value" />
 * ```
 *
 * @accessibility Uses aria-label for better screen reader support
 */
export interface ComponentNameProps {
  /** Description of prop1 */
  prop1: string;
  /** Description of prop2 - defaults to 0 */
  prop2?: number;
  /** Callback when something happens */
  onChange?: (value: string) => void;
}

export const ComponentName: React.FC<ComponentNameProps> = ({ 
  prop1, 
  prop2 = 0,
  onChange 
}) => {
  // Component implementation
}
```

## Storybook Documentation

### Story Structure

Each component should have a Storybook file (`ComponentName.stories.tsx`) with:

1. A default export containing component metadata
2. A primary/default story showing typical usage
3. Additional stories for different states, variants, or use cases

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { ComponentName } from './ComponentName';

const meta: Meta<typeof ComponentName> = {
  title: 'Components/ComponentName',
  component: ComponentName,
  tags: ['autodocs'], // Enable automatic documentation
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    prop1: { 
      control: 'text',
      description: 'Description of prop1',
    },
    prop2: { 
      control: { type: 'number', min: 0, max: 100, step: 1 },
      description: 'Description of prop2',
    },
    onChange: { action: 'changed' },
  },
};

export default meta;
type Story = StoryObj<typeof ComponentName>;

export const Default: Story = {
  args: {
    prop1: 'Default Value',
    prop2: 10,
  },
};

export const Alternative: Story = {
  args: {
    prop1: 'Alternative Value',
    prop2: 50,
  },
};

// Story with decorators for context providers if needed
export const WithProvider: Story = {
  decorators: [
    (Story) => (
      <SomeProvider>
        <Story />
      </SomeProvider>
    ),
  ],
};
```

### Component Controls and Documentation

- Use controls to make props interactive in Storybook
- Add descriptions to all props
- Show usage examples in the docs tab
- Include accessibility information
- Document any state management or context requirements

## Best Practices

1. **Be Consistent**: Follow the same documentation pattern across components
2. **Keep Updated**: Update documentation when component functionality changes
3. **Document Behavior**: Explain not just props, but expected behaviors
4. **Include Examples**: Provide usage examples for different scenarios
5. **Consider Edge Cases**: Document limitations or special considerations
