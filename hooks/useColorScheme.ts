/**
 * Color scheme implementation using React Native's Appearance API
 */

import { useEffect, useState } from 'react';
import { useColorScheme as useNativeColorScheme, Appearance } from 'react-native';

// We'll use a simple in-memory state instead of AsyncStorage
let storedTheme: 'light' | 'dark' | 'system' = 'system';

type ColorScheme = 'light' | 'dark';

export function useColorScheme(): ColorScheme {
  const systemColorScheme = useNativeColorScheme() as ColorScheme;
  const [userTheme, setUserTheme] = useState<'light' | 'dark' | 'system'>(storedTheme);

  // The effective color scheme is either the user's explicit choice or the system's
  return userTheme === 'system' ? systemColorScheme : userTheme as ColorScheme;
}

// Helper functions to manage theme
export function setAppTheme(theme: 'light' | 'dark' | 'system'): void {
  storedTheme = theme;
}

export function getAppTheme(): 'light' | 'dark' | 'system' {
  return storedTheme;
}
