import { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { AuthInput } from '@/components/ui/AuthInput';
import { AuthButton } from '@/components/ui/AuthButton';
import { AuthHeader } from '@/components/ui/AuthHeader';
import { useAuth } from '@/context/AuthContext';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordMatchError, setPasswordMatchError] = useState<string | null>(null);
  const colorScheme = useColorScheme();
  const router = useRouter();
  const { signUp } = useAuth();

  const validateForm = () => {
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return false;
    }

    if (password !== confirmPassword) {
      setPasswordMatchError("Passwords don't match");
      return false;
    }

    setPasswordMatchError(null);
    return true;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      const { error, success } = await signUp(email, password);
      
      if (error) {
        setError(error.message);
      } else if (success) {
        // Navigate to confirmation screen or show success message
        router.push('/(tabs)');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <ThemedView style={styles.container}>
            <AuthHeader 
              title="Sign Up For Free" 
              subtitle="Quickly make your account in 1 minute"
            />

            <View style={styles.form}>
              <AuthInput
                label="Email Address"
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoComplete="email"
                error={error && !email ? 'Email is required' : null}
              />

              <AuthInput
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                isPassword={true}
                error={error && !password ? 'Password is required' : null}
              />

              <AuthInput
                label="Confirm Password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                isPassword={true}
                error={passwordMatchError || (error && !confirmPassword ? 'Please confirm your password' : null)}
              />

              {error && <ThemedText style={styles.error}>{error}</ThemedText>}

              <View style={styles.buttonWrapper}>
                <AuthButton
                  title="Sign Up"
                  onPress={handleSignUp}
                  loading={loading}
                  style={styles.button}
                  icon="person-add-outline"
                />
              </View>

              <View style={styles.footer}>
                <ThemedText>Already have an account? </ThemedText>
                <Link href="/sign-in" asChild>
                  <TouchableOpacity>
                    <ThemedText type="link">Sign In</ThemedText>
                  </TouchableOpacity>
                </Link>
              </View>
            </View>
          </ThemedView>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 24,
  },
  form: {
    width: '100%',
  },
  error: {
    color: '#FF375F',
    marginBottom: 16,
  },
  buttonWrapper: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  button: {
    width: '100%',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
}); 