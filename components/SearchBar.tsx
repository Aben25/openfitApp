import React from 'react';
import { StyleSheet, TextInput, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useThemeColor } from '@/hooks/useThemeColor';

type SearchBarProps = {
  placeholder?: string;
  onPress?: () => void;
};

export function SearchBar({ placeholder = 'Search places', onPress }: SearchBarProps) {
  const backgroundColor = useThemeColor({}, 'searchBackground');
  const textColor = useThemeColor({}, 'text');
  const iconColor = useThemeColor({}, 'icon');

  return (
    <Pressable style={[styles.container, { backgroundColor }]} onPress={onPress}>
      <View style={styles.iconContainer}>
        <Ionicons name="search" size={20} color={iconColor} />
      </View>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#999"
        style={[styles.input, { color: textColor }]}
        editable={false}
      />
      <View style={styles.filterIconContainer}>
        <Ionicons name="options" size={20} color={iconColor} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 24,
    paddingHorizontal: 8,
    marginVertical: 16,
  },
  iconContainer: {
    width: 40,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterIconContainer: {
    width: 40,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: '100%',
  },
}); 