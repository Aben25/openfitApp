import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import { AssessmentButton } from '@/components/assessment/AssessmentButton';
import { assessmentColors, spacing } from '@/components/ui/AssessmentStyles';
import { useAssessment } from '@/context/AssessmentContext';
import { Ionicons } from '@expo/vector-icons';

export default function AssessmentWelcome() {
  const router = useRouter();
  const { nextStep } = useAssessment();

  const handleStart = () => {
    router.push('/(assessment)/about-you');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="fitness-outline" size={80} color={assessmentColors.primary} />
        </View>
        
        <ThemedText style={styles.title}>
          Welcome to Your Fitness Assessment
        </ThemedText>
        
        <ThemedText style={styles.description}>
          Let's create a personalized fitness plan just for you. We'll ask a few questions to understand your goals and preferences.
        </ThemedText>
        
        <View style={styles.bulletPoints}>
          <View style={styles.bulletPoint}>
            <Ionicons name="checkmark-circle" size={24} color={assessmentColors.primary} />
            <ThemedText style={styles.bulletText}>Personalized workout plans</ThemedText>
          </View>
          
          <View style={styles.bulletPoint}>
            <Ionicons name="checkmark-circle" size={24} color={assessmentColors.primary} />
            <ThemedText style={styles.bulletText}>Tailored to your fitness level</ThemedText>
          </View>
          
          <View style={styles.bulletPoint}>
            <Ionicons name="checkmark-circle" size={24} color={assessmentColors.primary} />
            <ThemedText style={styles.bulletText}>Track your progress over time</ThemedText>
          </View>
        </View>
      </View>
      
      <View style={styles.buttonContainer}>
        <AssessmentButton
          title="Start Assessment"
          onPress={handleStart}
          icon="arrow-forward"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: assessmentColors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: assessmentColors.text,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  description: {
    fontSize: 16,
    color: assessmentColors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 24,
  },
  bulletPoints: {
    alignSelf: 'stretch',
    marginTop: spacing.lg,
  },
  bulletPoint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  bulletText: {
    fontSize: 16,
    color: assessmentColors.text,
    marginLeft: spacing.md,
  },
  buttonContainer: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
});
