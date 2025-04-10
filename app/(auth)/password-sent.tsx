import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { AuthButton } from '@/components/ui/AuthButton';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function PasswordSentScreen() {
  const colorScheme = useColorScheme();
  const checkmarkColor = useThemeColor({}, 'primaryColor');
  const textColor = useThemeColor({}, 'text');
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar style="light" />
      <ThemedView style={styles.container}>
        <TouchableOpacity 
          style={styles.closeButton} 
          onPress={() => router.push('/sign-in')}
        >
          <Ionicons name="close-outline" size={28} color={textColor} />
        </TouchableOpacity>

        <View style={styles.content}>
          <View style={[styles.checkmarkContainer, { backgroundColor: checkmarkColor }]}>
            <Ionicons name="checkmark" size={60} color="#FFFFFF" />
          </View>

          <ThemedText type="title" style={styles.title}>
            Password Sent!
          </ThemedText>

          <ThemedText style={styles.message}>
            We've sent the password to **221b@gmail.com. Resend if the password is not received! 🔥
          </ThemedText>

          <View style={styles.buttonWrapper}>
            <AuthButton
              title="Re-Send Password"
              onPress={() => router.push('/reset-password')}
              style={styles.button}
              icon="mail-outline"
            />
          </View>
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  checkmarkContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
    fontSize: 32,
    fontWeight: 'bold',
  },
  message: {
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 40,
    color: '#AAAAAA',
  },
  buttonWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    width: '100%',
  },
}); 