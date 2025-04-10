
import { addons } from '@storybook/manager-api';
import { create } from '@storybook/theming/create';

const sagebrighTheme = create({
  base: 'light',
  
  // Brand
  brandTitle: 'Sagebright UI',
  
  // UI
  appBg: '#F6F9FC',
  appContentBg: '#FFFFFF',
  appBorderColor: 'rgba(0,0,0,.1)',
  appBorderRadius: 8,
  
  // Typography
  fontBase: '"Roboto", "Helvetica Neue", sans-serif',
  fontCode: 'monospace',
  
  // Text colors
  textColor: '#274754', // charcoal
  textInverseColor: '#FFFFFF',
  
  // Toolbar default and active colors
  barTextColor: '#999999',
  barSelectedColor: '#2A9D90', // primary
  barBg: '#FFFFFF',
  
  // Form colors
  inputBg: '#FFFFFF',
  inputBorder: 'rgba(0,0,0,.1)',
  inputTextColor: '#274754',
  inputBorderRadius: 4,
  
  // Colors
  colorPrimary: '#2A9D90', // persian green
  colorSecondary: '#88D8B0', // celadon
});

addons.setConfig({
  theme: sagebrighTheme,
  showToolbar: true,
});
