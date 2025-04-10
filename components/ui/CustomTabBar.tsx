import React from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions, Platform } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import { LayoutAnimation } from 'react-native';

import TabBarBackground from './TabBarBackground';
import { useThemeColor } from '@/hooks/useThemeColor';

const { width } = Dimensions.get('window');

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const primaryColor = useThemeColor({}, 'primaryColor');
  
  // iOS will often need a bit less padding than Android, because of the home indicator.
  const bottomPadding = Platform.OS === 'ios' ? 10 : 20;
  
  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom - 6, 0) }]}>
      <TabBarBackground />
      <View style={styles.tabBar}>
        {/* Left side tabs (0,1) */}
        <View style={styles.tabSide}>
          {state.routes.slice(0, 2).map((route, index) =>
            renderTabItem(route, index, state, descriptors, navigation, primaryColor)
          )}
        </View>

        {/* Right side tabs (3,4) */}
        <View style={styles.tabSide}>
          {state.routes.slice(3, 5).map((route, index) =>
            renderTabItem(route, index + 3, state, descriptors, navigation, primaryColor)
          )}
        </View>

        {/* Center floating (+) button */}
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: primaryColor }]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            console.log('Add button pressed');
            // Add your custom logic for the button
          }}
        >
          <Ionicons name="add" size={30} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Helper function
function renderTabItem(
  route: any, 
  index: number, 
  state: any, 
  descriptors: any, 
  navigation: any,
  primaryColor: string
) {
  const { options } = descriptors[route.key];
  const isFocused = state.index === index;

  // Adjust indices after the middle (+) tab
  const iconIndex = index > 2 ? index - 1 : index;

  // Customize each tab's icon
  const renderIcon = () => {
    switch (iconIndex) {
      case 0: // Home
        return <Ionicons name={isFocused ? 'home' : 'home-outline'} size={24} color={isFocused ? primaryColor : '#ffffff'} />;
      case 1: // Explore
        return <Ionicons name={isFocused ? 'compass' : 'compass-outline'} size={24} color={isFocused ? primaryColor : '#ffffff'} />;
      case 2: // Favorites (originally index 3)
        return <Ionicons name={isFocused ? 'heart' : 'heart-outline'} size={24} color={isFocused ? primaryColor : '#ffffff'} />;
      case 3: // Profile (originally index 4)
        return <Ionicons name={isFocused ? 'person' : 'person-outline'} size={24} color={isFocused ? primaryColor : '#ffffff'} />;
      default:
        return null;
    }
  };

  const onPress = () => {
    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });
    if (!isFocused && !event.defaultPrevented) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      navigation.navigate(route.name);
    }
  };

  return (
    <TouchableOpacity
      key={route.key}
      accessibilityRole="button"
      accessibilityState={isFocused ? { selected: true } : {}}
      accessibilityLabel={options.tabBarAccessibilityLabel}
      testID={options.tabBarTestID}
      onPress={onPress}
      style={styles.tabItem}
    >
      {renderIcon()}
      {isFocused && <View style={[styles.activeIndicator, { backgroundColor: primaryColor }]} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0, // pinned to bottom
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#111111',
    borderRadius: 30,
    height: 70,
    width: width - 40,
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    // Elevation for Android
    elevation: 8,
  },
  tabSide: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    height: '100%',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
  },
  addButton: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    top: -24,
    left: '50%',
    marginLeft: -30,
    // Shadow / elevation
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    zIndex: 10,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 12,
    height: 3,
    width: 18,
    borderRadius: 1.5,
  },
});