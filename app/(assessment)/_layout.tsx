import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { useAuth } from '@/context/AuthContext';
import { AssessmentProvider } from '@/context/AssessmentContext';

export default function AssessmentLayout() {
  const { session, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !session) {
      // If not authenticated, redirect to sign in
      router.replace('/(auth)/sign-in');
    }
  }, [session, loading, router]);

  if (loading || !session) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <AssessmentProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
            contentStyle: { backgroundColor: '#000' }
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="gender" />
          <Stack.Screen name="weight" />
          <Stack.Screen name="age" />
          <Stack.Screen name="complete" />
          {/* Add more screens as you create them */}
        </Stack>
      </AssessmentProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
}); 