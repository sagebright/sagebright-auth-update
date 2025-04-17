
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
