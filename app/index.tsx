import { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

export default function Index() {
  const { session, loading: authLoading } = useAuth();
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkOnboardingStatus() {
      if (!session?.user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('onboarding_completed')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Error checking onboarding status:', error);
          setOnboardingCompleted(false);
        } else {
          setOnboardingCompleted(data?.onboarding_completed || false);
        }
      } catch (err) {
        console.error('Failed to check onboarding status:', err);
        setOnboardingCompleted(false);
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading) {
      checkOnboardingStatus();
    }
  }, [session, authLoading]);

  // Show loading indicator while checking status
  if (authLoading || loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FF8C42" />
      </View>
    );
  }

  // Not authenticated - redirect to sign in
  if (!session) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  // Authenticated but needs to complete onboarding
  if (!onboardingCompleted) {
    return <Redirect href="/(onboarding)/about-you" />;
  }

  // Fully authenticated and onboarded - go to main app
  return <Redirect href="/(tabs)" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 