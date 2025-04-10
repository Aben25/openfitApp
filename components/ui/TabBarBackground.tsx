import { Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createContext, useContext } from 'react';

const TabBarOverflowContext = createContext(0);

export function useBottomTabOverflow() {
  return useContext(TabBarOverflowContext);
}

export default function TabBarBackground(props: React.PropsWithChildren) {
  const insets = useSafeAreaInsets();
  
  // Simple transparent background - our actual tab bar has its own background
  return (
    <View 
      style={[styles.container]} 
      {...props} 
    />
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
});
