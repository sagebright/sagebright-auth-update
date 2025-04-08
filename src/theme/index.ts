
/**
 * Sagebright Theme Index
 * 
 * This file exports all theme-related constants and configurations
 * to be imported by the tailwind config.
 */

import { colors } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';
import { screens } from './screens';
import { components } from './components';
import { animations } from './animations';

export const themeConfig = {
  colors,
  fontFamily: typography.fontFamily,
  fontSize: typography.fontSize,
  spacing,
  screens,
  borderRadius: components.borderRadius,
  boxShadow: components.boxShadow,
  keyframes: animations.keyframes,
  animation: animations.animation,
  transitionDuration: animations.transitionDuration,
  scale: animations.scale,
  brightness: animations.brightness,
};
