
import React from 'react';
import NavbarButton from './NavbarButton';

export default {
  title: 'Components/Navigation/NavbarButton',
  component: NavbarButton,
};

export const Default = {
  args: {
    children: 'Button Text',
    variant: 'default',
  },
};

export const Secondary = {
  args: {
    children: 'Secondary Button',
    variant: 'secondary',
  },
};
