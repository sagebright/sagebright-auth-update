
# Authentication Components

This directory contains components used in the Sagebright application's authentication flows.

## Components

### EmailInput

A styled input field specifically designed for email addresses with an appropriate icon.

#### Features

- Email-specific input with mail icon
- Styled consistently with Sagebright design system
- Supports form control props like disabled, value, onChange
- Supports internationalization

#### Usage

```tsx
import EmailInput from '@/components/auth/EmailInput';
import { useState } from 'react';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  
  return (
    <EmailInput 
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      aria-required="true"
    />
  );
};
```

#### Props

| Name            | Type                                       | Default          | Description                        |
|-----------------|--------------------------------------------|------------------|------------------------------------|
| `disabled`      | `boolean`                                  | `false`          | Disables the input field           |
| `value`         | `string`                                   | -                | Current input value                |
| `onChange`      | `(e: React.ChangeEvent<HTMLInputElement>) => void` | -       | Change handler function            |
| `onBlur`        | `() => void`                               | -                | Blur handler function              |
| `name`          | `string`                                   | -                | Input field name                   |
| `id`            | `string`                                   | -                | Input field ID                     |
| `placeholder`   | `string`                                   | `"you@example.com"` | Placeholder text               |
| `className`     | `string`                                   | `""`             | Additional CSS classes            |
| `aria-required` | `"true" \| "false"`                        | -                | ARIA required attribute           |

### AuthDivider

A visual divider used in authentication forms to separate different authentication methods.

#### Features

- Provides a clear visual separation in auth forms
- Contains internationalized text
- Stylistically consistent with the design system

#### Usage

```tsx
import AuthDivider from '@/components/auth/AuthDivider';

const AuthForm = () => {
  return (
    <>
      <SocialAuthButtons />
      <AuthDivider />
      <EmailPasswordForm />
    </>
  );
};
```
