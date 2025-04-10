import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Switch, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme as useSystemColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useColorScheme, setAppTheme, getAppTheme } from '@/hooks/useColorScheme';

type SettingItemProps = {
  title: string;
  icon: React.ReactNode;
  right?: React.ReactNode;
  onPress?: () => void;
};

function SettingItem({ title, icon, right, onPress }: SettingItemProps) {
  return (
    <Pressable 
      style={styles.settingItem} 
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingLeft}>
        <View style={styles.iconContainer}>
          {icon}
        </View>
        <ThemedText style={styles.settingTitle}>{title}</ThemedText>
      </View>
      {right}
    </Pressable>
  );
}

export default function SettingsScreen() {
  const systemColorScheme = useSystemColorScheme();
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(getAppTheme());
  const currentTheme = useColorScheme();
  const router = useRouter();
  const { user } = useAuth();
  
  // Determine if dark mode is currently active
  const isDarkMode = theme === 'dark' || (theme === 'system' && systemColorScheme === 'dark');

  // Toggle between light and dark
  const toggleTheme = () => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    setTheme(newTheme);
    setAppTheme(newTheme);
  };

  // Set theme to system preference
  const useSystemTheme = () => {
    setTheme('system');
    setAppTheme('system');
  };

  // Test onboarding flow
  const testOnboarding = async () => {
    if (!user) return;
    
    Alert.alert(
      "Test Onboarding",
      "This will reset your onboarding status and take you to the onboarding screens. Continue?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "OK",
          onPress: async () => {
            try {
              // Reset onboarding status in database
              await supabase
                .from('profiles')
                .update({
                  onboarding_completed: false
                })
                .eq('id', user.id);
              
              // Navigate to first onboarding screen
              router.push('/(onboarding)/about-you');
            } catch (error) {
              console.error('Error resetting onboarding:', error);
              Alert.alert('Error', 'Failed to reset onboarding. Please try again.');
            }
          }
        }
      ]
    );
  };

  // Test assessment flow
  const testAssessment = async () => {
    if (!user) return;
    
    Alert.alert(
      "Test Assessment",
      "This will take you to the new assessment flow. Continue?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "OK",
          onPress: async () => {
            try {
              // Reset onboarding status in database
              await supabase
                .from('profiles')
                .update({
                  onboarding_completed: false
                })
                .eq('id', user.id);
                
              // Navigate to first assessment screen
              router.push('/(assessment)');
            } catch (error) {
              console.error('Error resetting onboarding:', error);
              Alert.alert('Error', 'Failed to reset assessment. Please try again.');
            }
          }
        }
      ]
    );
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">Settings</ThemedText>
      </View>
      
      <View style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Appearance</ThemedText>
        
        <SettingItem
          title="Dark Mode"
          icon={<Ionicons name="moon-outline" size={24} color={currentTheme === 'dark' ? '#fff' : '#333'} />}
          right={
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={isDarkMode ? '#f5dd4b' : '#f4f3f4'}
            />
          }
        />
        
        <SettingItem
          title="Use System Settings"
          icon={<Ionicons name="phone-portrait-outline" size={24} color={currentTheme === 'dark' ? '#fff' : '#333'} />}
          right={
            <Switch
              value={theme === 'system'}
              onValueChange={() => theme === 'system' ? toggleTheme() : useSystemTheme()}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={theme === 'system' ? '#f5dd4b' : '#f4f3f4'}
            />
          }
        />
      </View>

      <View style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Developer Options</ThemedText>
        
        <SettingItem
          title="Test Onboarding Flow"
          icon={<Ionicons name="construct-outline" size={24} color={currentTheme === 'dark' ? '#fff' : '#333'} />}
          onPress={testOnboarding}
          right={
            <Ionicons 
              name="chevron-forward" 
              size={20} 
              color={currentTheme === 'dark' ? '#fff' : '#333'} 
              style={styles.arrowIcon}
            />
          }
        />
        
        <SettingItem
          title="Test Assessment Flow"
          icon={<Ionicons name="fitness-outline" size={24} color={currentTheme === 'dark' ? '#fff' : '#333'} />}
          onPress={testAssessment}
          right={
            <Ionicons 
              name="chevron-forward" 
              size={20} 
              color={currentTheme === 'dark' ? '#fff' : '#333'} 
              style={styles.arrowIcon}
            />
          }
        />
      </View>

      <View style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>About</ThemedText>
        
        <SettingItem
          title="App Version"
          icon={<Ionicons name="information-circle-outline" size={24} color={currentTheme === 'dark' ? '#fff' : '#333'} />}
          right={<ThemedText style={styles.versionText}>1.0.0</ThemedText>}
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(150, 150, 150, 0.2)',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 30,
    alignItems: 'center',
    marginRight: 15,
  },
  settingTitle: {
    fontSize: 16,
  },
  versionText: {
    fontSize: 14,
    opacity: 0.7,
  },
  arrowIcon: {
    opacity: 0.7,
  },
}); 