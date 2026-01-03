/**
 * Modern, professional color palette for the Expense Tracker.
 * Designed for clarity, professionalism, and visual appeal.
 */

import { Platform } from 'react-native';

const palette = {
  // Primary Brand Colors (Deep Indigo/Violet)
  primary: '#4F46E5', // Indigo 600
  primaryLight: '#818CF8', // Indigo 400
  primaryDark: '#3730A3', // Indigo 800

  // Secondary/Accent (Teal/Emerald)
  secondary: '#10B981', // Emerald 500
  secondaryLight: '#34D399', // Emerald 400

  // Functional Colors
  error: '#EF4444', // Red 500
  warning: '#F59E0B', // Amber 500
  success: '#10B981', // Emerald 500
  info: '#3B82F6', // Blue 500

  // Neutrals (Light Mode)
  white: '#FFFFFF',
  slate50: '#F8FAFC', // Very light background
  slate100: '#F1F5F9', // Light background
  slate200: '#E2E8F0', // Borders
  slate300: '#CBD5E1', // Disabled/Placeholder
  slate400: '#94A3B8', // Icons
  slate500: '#64748B', // Secondary Text
  slate700: '#334155', // Primary Text
  slate900: '#0F172A', // Headings

  // Neutrals (Dark Mode)
  darkBg: '#0F172A', // Slate 900
  darkSurface: '#1E293B', // Slate 800
  darkBorder: '#334155', // Slate 700
};

export const Colors = {
  light: {
    text: palette.slate900,
    textSecondary: palette.slate500,
    background: palette.slate50,
    surface: palette.white,
    tint: palette.primary,
    icon: palette.slate400,
    tabIconDefault: palette.slate400,
    tabIconSelected: palette.primary,
    border: palette.slate200,
    error: palette.error,
    success: palette.success,
    warning: palette.warning,
    primary: palette.primary,
    primaryGradient: [palette.primary, palette.primaryLight] as const,
  },
  dark: {
    text: palette.slate50,
    textSecondary: palette.slate400,
    background: palette.darkBg,
    surface: palette.darkSurface,
    tint: palette.primaryLight,
    icon: palette.slate300,
    tabIconDefault: palette.slate500,
    tabIconSelected: palette.primaryLight,
    border: palette.darkBorder,
    error: palette.error,
    success: palette.success,
    warning: palette.warning,
    primary: palette.primaryLight,
    primaryGradient: [palette.primaryDark, palette.primary] as const,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'System',
    serif: 'Georgia',
    rounded: 'System',
    mono: 'Menlo',
  },
  default: {
    sans: 'sans-serif',
    serif: 'serif',
    rounded: 'sans-serif-medium',
    mono: 'monospace',
  },
});

