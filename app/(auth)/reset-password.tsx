import { useState } from 'react';
import { StyleSheet, View, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { AuthInput } from '@/components/ui/AuthInput';
import { AuthButton } from '@/components/ui/AuthButton';
import { AuthHeader } from '@/components/ui/AuthHeader';
import { useAuth } from '@/context/AuthContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function ResetPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string>('email');
  const colorScheme = useColorScheme();
  const iconColor = useThemeColor({}, 'text');
  const router = useRouter();
  const { resetPassword } = useAuth();

  const handleResetPassword = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error, success } = await resetPassword(email);
      
      if (error) {
        setError(error.message);
      } else if (success) {
        router.push('/password-sent');
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
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => router.back()}
            >
              <Ionicons name="chevron-back" size={28} color={iconColor} />
            </TouchableOpacity>

            <AuthHeader
              title="Reset Password"
              subtitle="Select what method you'd like to reset."
            />

            <View style={styles.content}>
              <TouchableOpacity 
                style={[
                  styles.methodOption, 
                  selectedMethod === 'email' && styles.selectedMethod
                ]} 
                onPress={() => setSelectedMethod('email')}
              >
                <View style={styles.methodIconContainer}>
                  <Ionicons name="mail-outline" size={24} color={iconColor} />
                </View>
                <View style={styles.methodTextContainer}>
                  <ThemedText style={styles.methodTitle}>Send via Email</ThemedText>
                  <ThemedText style={styles.methodDescription}>
                    Seamlessly reset your password via email address.
                  </ThemedText>
                </View>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[
                  styles.methodOption, 
                  selectedMethod === '2fa' && styles.selectedMethod
                ]} 
                onPress={() => setSelectedMethod('2fa')}
              >
                <View style={styles.methodIconContainer}>
                  <Ionicons name="shield-checkmark-outline" size={24} color={iconColor} />
                </View>
                <View style={styles.methodTextContainer}>
                  <ThemedText style={styles.methodTitle}>Send via 2FA</ThemedText>
                  <ThemedText style={styles.methodDescription}>
                    Seamlessly reset your password via 2 Factors.
                  </ThemedText>
                </View>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[
                  styles.methodOption, 
                  selectedMethod === 'google' && styles.selectedMethod
                ]} 
                onPress={() => setSelectedMethod('google')}
              >
                <View style={styles.methodIconContainer}>
                  <Ionicons name="logo-google" size={24} color={iconColor} />
                </View>
                <View style={styles.methodTextContainer}>
                  <ThemedText style={styles.methodTitle}>Send via Google Auth</ThemedText>
                  <ThemedText style={styles.methodDescription}>
                    Seamlessly reset your password via gAuth.
                  </ThemedText>
                </View>
              </TouchableOpacity>

              <View style={styles.form}>
                <AuthInput
                  label="Email Address"
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoComplete="email"
                  error={error}
                />

                {error && <ThemedText style={styles.error}>{error}</ThemedText>}

                <View style={styles.buttonWrapper}>
                  <AuthButton
                    title="Reset Password"
                    onPress={handleResetPassword}
                    loading={loading}
                    style={styles.button}
                    icon="refresh-outline"
                  />
                </View>
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
  backButton: {
    position: 'absolute',
    top: 12,
    left: 12,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '100%',
  },
  methodOption: {
    flexDirection: 'row',
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(100, 100, 100, 0.1)',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedMethod: {
    borderColor: '#009FE3',
  },
  methodIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(150, 150, 150, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  methodTextContainer: {
    flex: 1,
  },
  methodTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  methodDescription: {
    fontSize: 14,
    color: '#AAAAAA',
  },
  form: {
    width: '100%',
    marginTop: 28,
  },
  error: {
    color: '#FF375F',
    marginBottom: 16,
  },
  buttonWrapper: {
    alignItems: 'center',
    marginTop: 8,
  },
  button: {
    width: '100%',
  },
}); 