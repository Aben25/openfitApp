import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import { AssessmentButton } from '@/components/assessment/AssessmentButton';
import { assessmentColors, spacing } from '@/components/ui/AssessmentStyles';
import { useAssessment } from '@/context/AssessmentContext';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';

export default function AssessmentCompleteScreen() {
  const router = useRouter();
  const { saveAssessmentData, isLoading, error } = useAssessment();
  const [animationComplete, setAnimationComplete] = useState(false);
  
  const handleFinish = async () => {
    await saveAssessmentData();
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.animationContainer}>
          {/* You can replace this with an actual Lottie animation */}
          <View style={styles.successIcon}>
            <Ionicons name="checkmark-circle" size={100} color={assessmentColors.primary} />
          </View>
        </View>
        
        <ThemedText style={styles.title}>
          Assessment Complete!
        </ThemedText>
        
        <ThemedText style={styles.description}>
          Thank you for completing your fitness assessment. We've gathered all the information needed to create your personalized fitness plan.
        </ThemedText>
        
        <View style={styles.bulletPoints}>
          <View style={styles.bulletPoint}>
            <Ionicons name="checkmark-circle" size={24} color={assessmentColors.primary} />
            <ThemedText style={styles.bulletText}>Personalized workout plan created</ThemedText>
          </View>
          
          <View style={styles.bulletPoint}>
            <Ionicons name="checkmark-circle" size={24} color={assessmentColors.primary} />
            <ThemedText style={styles.bulletText}>Tailored to your fitness level</ThemedText>
          </View>
          
          <View style={styles.bulletPoint}>
            <Ionicons name="checkmark-circle" size={24} color={assessmentColors.primary} />
            <ThemedText style={styles.bulletText}>Optimized for your schedule</ThemedText>
          </View>
        </View>
        
        {error && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={24} color={assessmentColors.error} />
            <ThemedText style={styles.errorText}>{error}</ThemedText>
          </View>
        )}
      </View>
      
      <View style={styles.buttonContainer}>
        <AssessmentButton
          title={isLoading ? "Saving..." : "Finish & View Dashboard"}
          onPress={handleFinish}
          isLoading={isLoading}
          icon={isLoading ? undefined : "arrow-forward"}
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
  animationContainer: {
    height: 200,
    width: 200,
    marginBottom: spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successIcon: {
    justifyContent: 'center',
    alignItems: 'center',
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
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 55, 95, 0.1)',
    borderRadius: 8,
    padding: spacing.md,
    marginTop: spacing.lg,
  },
  errorText: {
    fontSize: 14,
    color: assessmentColors.error,
    marginLeft: spacing.sm,
  },
  buttonContainer: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
});
