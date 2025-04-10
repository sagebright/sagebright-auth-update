
import type { Preview } from "@storybook/react";
import "../src/index.css"; // Include the main CSS file to get Tailwind styles

const preview: Preview = {
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
};

export default preview;
