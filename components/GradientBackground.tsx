import React from 'react';
import { StyleSheet, ViewProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

type GradientBackgroundProps = ViewProps & {
  children: React.ReactNode;
};

export function GradientBackground({ children, style, ...otherProps }: GradientBackgroundProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const gradientColors = [
    Colors[colorScheme].gradientStart,
    Colors[colorScheme].gradientEnd,
  ];

  return (
    <LinearGradient
      colors={gradientColors}
      style={[styles.container, style]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      {...otherProps}>
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
