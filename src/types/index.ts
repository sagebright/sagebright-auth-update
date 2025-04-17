
export interface Language {
  code: string;
  name: string;
  flag: string;
}

export interface UserProfile {
  id: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  avatar?: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  language?: string;
  theme?: 'light' | 'dark' | 'system';
  notifications?: NotificationPreferences;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  desktop: boolean;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
}

// Adding ButtonProps for button component
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  loading?: boolean;
  loadingText?: string;
  asChild?: boolean;
}

// Add NavbarButtonProps here too for consistency
export interface NavbarButtonProps {
  user?: any;
}
