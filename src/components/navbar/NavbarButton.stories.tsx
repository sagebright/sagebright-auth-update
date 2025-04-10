
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
      firstName: 'Test',
      lastName: 'User',
      // Add other required user properties here
    },
  },
};
