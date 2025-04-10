import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView, View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { useAuth } from '@/context/AuthContext';
import { OnboardingProvider } from '@/context/OnboardingContext';

export default function OnboardingLayout() {
  const { session, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !session) {
      // If not authenticated, redirect to sign in
      router.replace('/(auth)/sign-in');
    } else if (session) {
      // Redirect to the assessment flow instead
      router.replace('/(assessment)');
    }
  }, [session, loading, router]);

  if (loading || !session) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <OnboardingProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="about-you" />
          <Stack.Screen name="fitness-goals" />
          <Stack.Screen name="fitness-levels" />
          <Stack.Screen name="workout-environment" />
          <Stack.Screen name="workout-schedule" />
          <Stack.Screen name="final-notes" />
        </Stack>
      </OnboardingProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
}); 