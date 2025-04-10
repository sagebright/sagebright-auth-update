
import React from 'react';
import type { Preview } from "@storybook/react";
import "../src/index.css";
import { ThemeProvider } from './ThemeProvider';

// This is an example of how to update the preview.ts
// file to include theme toggling. You can merge this into
// the preview.ts file when ready.

const preview: Preview = {
  decorators: [
    (Story, context) => {
      // Get the current theme value from Storybook's global state
      const theme = context.globals.theme || 'light';
      
      return (
        <ThemeProvider theme={theme}>
          <div className={`${theme} bg-background text-foreground min-h-screen p-4`}>
            <Story />
          </div>
        </ThemeProvider>
      );
    },
  ],
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: 'hsl(var(--background))',
        },
        {
          name: 'dark',
          value: 'hsl(222.2 84% 4.9%)',
        },
      ],
    },
    layout: 'centered',
  },
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Global theme for components',
      defaultValue: 'light',
      toolbar: {
        icon: 'circlehollow',
        items: [
          { value: 'light', icon: 'circlehollow', title: 'Light' },
          { value: 'dark', icon: 'circle', title: 'Dark' },
        ],
        showName: true,
      },
    },
  },
};

export default preview;
