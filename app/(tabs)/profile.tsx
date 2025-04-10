import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { AuthButton } from '@/components/ui/AuthButton';
import { useAuth } from '@/context/AuthContext';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(false);
  const colorScheme = useColorScheme();
  const iconColor = useThemeColor({}, 'icon');
  const primaryColor = useThemeColor({}, 'primaryColor');
  const router = useRouter();

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            await signOut();
            setLoading(false);
          },
        },
      ]
    );
  };

  // Test onboarding flow
  const testOnboarding = async () => {
    if (!user) return;
    
    Alert.alert(
      "Test Assessment",
      "This will reset your profile data and take you to the assessment screens. Continue?",
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
              
              // Navigate to assessment flow
              router.push('/(assessment)');
            } catch (error) {
              console.error('Error resetting assessment:', error);
              Alert.alert('Error', 'Failed to reset assessment. Please try again.');
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar style="light" />
      <ThemedView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.profileHeader}>
            <View style={styles.profileImageContainer}>
              <View style={styles.profileImagePlaceholder}>
                <Ionicons name="person" size={60} color="#FFFFFF" />
              </View>
            </View>
            
            <ThemedText type="title" style={styles.username}>
              {user?.email?.split('@')[0] || 'anuro'}
            </ThemedText>
            <ThemedText style={styles.email}>{user?.email || 'anuro@artba.org'}</ThemedText>
            <ThemedText style={styles.description}>
              Fitness enthusiast
            </ThemedText>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <ThemedText type="title" style={styles.statValue}>24</ThemedText>
              <ThemedText style={styles.statLabel}>Workouts</ThemedText>
            </View>
            <View style={styles.statItem}>
              <ThemedText type="title" style={styles.statValue}>78</ThemedText>
              <ThemedText style={styles.statLabel}>Hours</ThemedText>
            </View>
            <View style={styles.statItem}>
              <ThemedText type="title" style={styles.statValue}>12</ThemedText>
              <ThemedText style={styles.statLabel}>Programs</ThemedText>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.editButton} onPress={() => {}}>
              <Ionicons name="create-outline" size={20} color={iconColor} style={styles.buttonIcon} />
              <ThemedText style={styles.buttonText}>Edit Profile</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.testButton} onPress={testOnboarding}>
              <Ionicons name="refresh-outline" size={20} color={iconColor} style={styles.buttonIcon} />
              <ThemedText style={styles.buttonText}>Test Assessment</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.signOutButton} 
              onPress={handleSignOut}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons name="log-out-outline" size={20} color="#FFFFFF" style={styles.buttonIcon} />
                  <ThemedText style={styles.signOutText}>Sign Out</ThemedText>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  profileImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    marginBottom: 20,
    backgroundColor: '#444444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImagePlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  username: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    marginBottom: 12,
    color: '#AAAAAA',
  },
  description: {
    textAlign: 'center',
    fontSize: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    marginBottom: 40,
    paddingHorizontal: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 16,
    color: '#AAAAAA',
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#444444',
    backgroundColor: 'transparent',
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FF8C42',
    backgroundColor: 'rgba(255, 140, 66, 0.1)',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#FF375F',
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
}); 