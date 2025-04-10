
# Navbar Components

This directory contains components used in the Sagebright application's navigation system.

## Components

### NavbarButton

A button component used in the navigation bar that changes its text and destination based on user authentication status.

#### Features

- Changes text based on authentication state
- Changes destination link based on authentication state
- Follows Sagebright brand styling
- Supports internationalization (i18n)

#### Usage

```tsx
import NavbarButton from '@/components/navbar/NavbarButton';
import { useAuth } from '@/contexts/auth/AuthContext';

const YourComponent = () => {
  const { user } = useAuth();
  
  return <NavbarButton user={user} />;
};
```

#### Props

| Name   | Type         | Default | Description                                    |
|--------|--------------|---------|------------------------------------------------|
| `user` | `User \| null` | `null`  | The current user object from authentication context |

### MobileNav

A mobile navigation menu that displays a hamburger menu icon and a slide-out drawer with navigation links.

#### Features

- Responsive design for mobile devices
- Slide-out drawer with navigation links
- Conditional navigation based on current page
- Supports authentication state

#### Props

| Name           | Type         | Default | Description                                   |
|----------------|--------------|---------|-----------------------------------------------|
| `isContactPage` | `boolean`    | -       | Whether the current page is the contact page  |
| `user`         | `User \| null` | `null`  | The current user object from authentication  |
