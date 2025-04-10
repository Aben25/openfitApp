/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#333333';
const tintColorDark = '#FFFFFF';

// Gradient colors for backgrounds
const gradientStartColor = '#FF8C42';
const gradientEndColor = '#FF5722';

// App colors
const primaryColor = '#FF8C42';

export const Colors = {
  light: {
    text: '#333333',
    secondaryText: '#666666',
    background: '#FFFFFF',
    tint: tintColorLight,
    icon: '#333333',
    tabIconDefault: '#999999',
    tabIconSelected: '#333333',
    primaryButton: primaryColor,
    searchBackground: '#F5F5F5',
    cardBackground: '#FFFFFF',
    tabBarBackground: 'rgba(255, 255, 255, 0.9)',
    cardInfoBackground: '#FFFFFF',
    favoriteIcon: '#FF375F',
    ratingIcon: '#FFD700',
    activeTab: '#FFFFFF',
    activeTabText: '#333333',
    inactiveTabText: '#333333',
    primaryColor: primaryColor,
    gradientStart: gradientStartColor,
    gradientEnd: gradientEndColor,
    inputBackground: '#F5F5F5',
    inputBorder: '#E0E0E0',
    socialButtonBorder: '#DDDDDD'
  },
  dark: {
    text: '#FFFFFF',
    secondaryText: '#AAAAAA', 
    background: '#000000',
    tint: tintColorDark,
    icon: '#FFFFFF',
    tabIconDefault: '#777777',
    tabIconSelected: '#FFFFFF',
    primaryButton: primaryColor,
    searchBackground: '#333333',
    cardBackground: '#1E1E1E',
    tabBarBackground: '#000000',
    cardInfoBackground: '#FFFFFF',
    favoriteIcon: '#FF375F',
    ratingIcon: '#FFD700',
    activeTab: '#FFFFFF',
    activeTabText: '#333333',
    inactiveTabText: '#FFFFFF',
    primaryColor: primaryColor,
    gradientStart: gradientStartColor,
    gradientEnd: gradientEndColor,
    inputBackground: '#222222',
    inputBorder: '#333333',
    socialButtonBorder: '#333333'
  },
};
