import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { FitnessIcon } from '@/assets/images/fitness-icon';

type AuthHeaderProps = {
  title: string;
  subtitle?: string;
};

export function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  const iconColor = useThemeColor({}, 'primaryColor');

  return (
    <ThemedView style={styles.container}>
      <View style={styles.logoContainer}>
        <View style={[styles.logoCircle, { backgroundColor: iconColor }]}>
          <FitnessIcon width={30} height={30} fill="#FFFFFF" />
        </View>
      </View>
      <ThemedText type="title" style={styles.title}>
        {title}
      </ThemedText>
      {subtitle && <ThemedText style={styles.subtitle}>{subtitle}</ThemedText>}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingBottom: 40,
    paddingTop: 20,
  },
  logoContainer: {
    marginBottom: 24,
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginBottom: 12,
    textAlign: 'center',
    fontSize: 32,
    fontWeight: 'bold',
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 24,
    paddingHorizontal: 20,
    color: '#AAAAAA',
  },
}); 