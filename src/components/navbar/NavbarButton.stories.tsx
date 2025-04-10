
import type { Meta, StoryObj } from '@storybook/react';
import NavbarButton from '@/components/navbar/NavbarButton';
import { BrowserRouter } from 'react-router-dom';

/**
 * NavbarButton component stories for Storybook
 */
const meta: Meta<typeof NavbarButton> = {
  title: 'Sage/NavbarButton',
  component: NavbarButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
  argTypes: {
    user: {
      control: 'object',
      description: 'The current user object from authentication context',
    },
  },
};

export default meta;
type Story = StoryObj<typeof NavbarButton>;

/**
 * NavbarButton when user is not logged in
 */
export const LoggedOut: Story = {
  args: {
    user: null,
  },
};

/**
 * NavbarButton when user is logged in
 */
export const LoggedIn: Story = {
  args: {
    user: {
      id: '123',
      email: 'user@example.com',
      // Using properties that exist in the Supabase User type
      // Removed firstName which was causing the error
      app_metadata: {},
      aud: 'authenticated',
      confirmed_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      last_sign_in_at: new Date().toISOString(),
      role: 'authenticated',
      updated_at: new Date().toISOString(),
      user_metadata: {
        full_name: 'Test User'
      }
    },
  },
};
