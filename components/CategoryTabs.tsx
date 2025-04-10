import React, { useState } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';

type Tab = {
  id: string;
  label: string;
};

type CategoryTabsProps = {
  tabs: Tab[];
  onTabChange?: (tab: Tab) => void;
};

export function CategoryTabs({ tabs, onTabChange }: CategoryTabsProps) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id);
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  
  const handleTabPress = (tab: Tab) => {
    setActiveTab(tab.id);
    onTabChange?.(tab);
  };

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <Pressable
            key={tab.id}
            style={[
              styles.tab,
              isActive && [styles.activeTab, { backgroundColor: '#FFFFFF' }]
            ]}
            onPress={() => handleTabPress(tab)}>
            <ThemedText
              style={[
                styles.tabText,
                { color: isActive ? '#333333' : textColor },
                isActive && styles.activeTabText
              ]}>
              {tab.label}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
  },
  activeTab: {
    backgroundColor: '#FFF',
  },
  tabText: {
    fontSize: 14,
  },
  activeTabText: {
    fontWeight: '600',
  },
}); 