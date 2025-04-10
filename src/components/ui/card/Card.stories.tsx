
import type { Meta, StoryObj } from '@storybook/react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

/**
 * Card component stories for Storybook
 */
const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-md w-full">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Card>;

/**
 * Basic card with all sections
 */
export const Complete: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here explaining the purpose of this card.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This is the main content of the card. You can place any elements here such as text, images, or other components.</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Submit</Button>
      </CardFooter>
    </Card>
  ),
};

/**
 * Simple card with just content
 */
export const Simple: Story = {
  render: () => (
    <Card className="p-6">
      <p>A simple card with just content and padding, no header or footer.</p>
    </Card>
  ),
};

/**
 * Card with custom styling
 */
export const CustomStyling: Story = {
  render: () => (
    <Card className="border-primary/50 bg-primary/5">
      <CardHeader>
        <CardTitle className="text-primary">Custom Styled Card</CardTitle>
        <CardDescription>Using Sagebright brand colors</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This card uses custom border and background colors from the Sagebright palette.</p>
      </CardContent>
      <CardFooter>
        <Button className="w-full" variant="accent1">Accent Button</Button>
      </CardFooter>
    </Card>
  ),
};

/**
 * Card as a clickable element
 */
export const Clickable: Story = {
  render: () => (
    <Card className="hover:shadow-card-hover transition-shadow cursor-pointer">
      <CardHeader>
        <CardTitle>Clickable Card</CardTitle>
        <CardDescription>This card has hover effects</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Click or tap on this card to perform an action. The entire card is clickable.</p>
      </CardContent>
    </Card>
  ),
};
