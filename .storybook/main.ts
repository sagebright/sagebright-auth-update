
import type { StorybookConfig } from "@storybook/react-vite";
import { dirname, join } from "path";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  viteFinal: async (config) => {
    // Add path alias for @ to src directory
    if (config.resolve) {
      config.resolve.alias = {
        ...(config.resolve.alias || {}),
        "@": join(dirname(__dirname), "src"),
      };
    }
    return config;
  },
};

export default config;
