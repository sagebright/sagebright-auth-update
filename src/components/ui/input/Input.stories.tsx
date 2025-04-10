
import type { Meta, StoryObj } from '@storybook/react';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

/**
 * Input component stories for Storybook
 */
const meta: Meta<typeof Input> = {
  title: 'Forms/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'password', 'email', 'number', 'search', 'tel', 'url'],
      description: 'The input type',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the input is disabled',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
    onChange: { action: 'changed' },
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-sm">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Input>;

/**
 * Default input
 */
export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
    type: 'text',
  },
};

/**
 * Email input
 */
export const Email: Story = {
  args: {
    type: 'email',
    placeholder: 'Email address',
  },
};

/**
 * Password input
 */
export const Password: Story = {
  args: {
    type: 'password',
    placeholder: '••••••••',
  },
};

/**
 * Disabled input
 */
export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: 'Disabled input',
    value: 'You cannot change this',
  },
};

/**
 * Input with error style
 */
export const WithError: Story = {
  render: () => (
    <div className="space-y-2">
      <Input 
        placeholder="Invalid input" 
        className="border-red-500 focus-visible:ring-red-500" 
      />
      <p className="text-sm text-red-500">Please enter a valid value</p>
    </div>
  ),
};

/**
 * Input with success style
 */
export const WithSuccess: Story = {
  render: () => (
    <div className="space-y-2">
      <Input 
        placeholder="Valid input" 
        className="border-green-500 focus-visible:ring-green-500"
        value="Correct value"
        readOnly
      />
      <p className="text-sm text-green-500">Looks good!</p>
    </div>
  ),
};
