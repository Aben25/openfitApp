import { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { AuthInput } from '@/components/ui/AuthInput';
import { AuthButton } from '@/components/ui/AuthButton';
import { AuthHeader } from '@/components/ui/AuthHeader';
import { useAuth } from '@/context/AuthContext';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function SignInScreen() {
  const [email, setEmail] = useState('anuro@artba.org');
  const [password, setPassword] = useState('anuro@artba.org');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const colorScheme = useColorScheme();
  const router = useRouter();
  const { signIn } = useAuth();

  const handleSignIn = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        setError(error.message);
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
              title="Sign In To Sandow" 
              subtitle="Let's personalize your fitness with AI"
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

              {error && <ThemedText style={styles.error}>{error}</ThemedText>}

              <TouchableOpacity onPress={() => router.push('/reset-password')}>
                <ThemedText type="link" style={styles.forgotPassword}>
                  Forgot Password
                </ThemedText>
              </TouchableOpacity>

              <View style={styles.buttonWrapper}>
                <AuthButton
                  title="Sign In"
                  onPress={handleSignIn}
                  loading={loading}
                  style={styles.button}
                  icon="log-in-outline"
                />
              </View>

              <View style={styles.socialSection}>
                <View style={styles.socialDivider}>
                  <View style={styles.dividerLine} />
                  <ThemedText style={styles.dividerText}>or connect with</ThemedText>
                  <View style={styles.dividerLine} />
                </View>

                <View style={styles.socialButtons}>
                  <AuthButton
                    title="Instagram"
                    onPress={() => {}}
                    variant="outline"
                    icon="logo-instagram"
                    style={styles.socialButton}
                  />
                  <AuthButton
                    title="Facebook"
                    onPress={() => {}}
                    variant="outline"
                    icon="logo-facebook"
                    style={styles.socialButton}
                  />
                  <AuthButton
                    title="LinkedIn"
                    onPress={() => {}}
                    variant="outline"
                    icon="logo-linkedin"
                    style={styles.socialButton}
                  />
                </View>
              </View>

              <View style={styles.footer}>
                <ThemedText>Don't have an account? </ThemedText>
                <Link href="/sign-up" asChild>
                  <TouchableOpacity>
                    <ThemedText type="link">Sign Up</ThemedText>
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  buttonWrapper: {
    alignItems: 'center',
    marginBottom: 24,
  },
  button: {
    width: '100%',
  },
  socialSection: {
    marginTop: 16,
  },
  socialDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(170, 170, 170, 0.3)',
  },
  dividerText: {
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#AAAAAA',
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  socialButton: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
}); 