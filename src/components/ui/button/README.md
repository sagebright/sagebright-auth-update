
# Button Component

The Button component is a versatile, reusable button element that follows the Sagebright design system.

## Features

- Multiple variants: default, outline, secondary, destructive, ghost, link
- Multiple sizes: default, sm, lg, icon
- Loading state with spinner and optional loading text
- Support for polymorphic rendering (asChild)
- Fully accessible with keyboard navigation and ARIA attributes
- Consistent with Sagebright brand styling

## Usage

```tsx
import { Button } from '@/components/ui/button';

// Basic usage
<Button>Click me</Button>

// With variant and size
<Button variant="outline" size="lg">Large Outline Button</Button>

// Loading state
<Button loading loadingText="Processing...">Submit</Button>

// As a link
<Button asChild variant="link">
  <a href="/some-page">Visit Page</a>
</Button>
```

## Props

| Name          | Type                                                             | Default     | Description                                    |
|---------------|------------------------------------------------------------------|-------------|------------------------------------------------|
| `variant`     | `'default' \| 'destructive' \| 'outline' \| 'secondary' \| 'ghost' \| 'link'` | `'default'` | Button style variant                  |
| `size`        | `'default' \| 'sm' \| 'lg' \| 'icon'`                            | `'default'` | Button size                           |
| `asChild`     | `boolean`                                                        | `false`     | Whether to render as child component (polymorphic) |
| `loading`     | `boolean`                                                        | `false`     | Whether the button is in a loading state       |
| `loadingText` | `string`                                                         | `''`        | Text to display during loading                 |
| `className`   | `string`                                                         | `''`        | Additional CSS classes                         |
| `disabled`    | `boolean`                                                        | `false`     | Whether the button is disabled                 |
| `children`    | `React.ReactNode`                                                | -           | Button content                                 |

The component also accepts all standard button HTML attributes.

## Examples

### Basic Button

```tsx
<Button>Click me</Button>
```

### Destructive Action Button

```tsx
<Button 
  variant="destructive" 
  onClick={handleDelete}
  aria-label="Delete item"
>
  Delete
</Button>
```

### Loading Button

```tsx
<Button 
  loading={isSubmitting} 
  loadingText="Submitting..." 
  disabled={isSubmitting}
>
  Submit Form
</Button>
```

### Button with Icon

```tsx
<Button size="icon">
  <PlusIcon className="h-4 w-4" />
  <span className="sr-only">Add item</span>
</Button>
```

## Accessibility

- Uses native button element for proper semantics
- Maintains focus states for keyboard navigation
- Supports aria-label for icon-only buttons
- Disables button during loading states to prevent multiple submissions
- Communicates loading state visually and via screen readers

## Design Tokens

The Button component uses these design tokens from the theme:

- Font families: `font-dmSans`
- Colors: Uses primary, secondary, accent colors from the theme
- Border radius: Rounded corners consistent with design system
- Transitions: Smooth hover and active states
