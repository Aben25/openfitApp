import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '../ThemedText';
import { useAssessment } from '@/context/AssessmentContext';
import { assessmentStyles, assessmentColors, spacing, typography } from '../ui/AssessmentStyles';

interface AssessmentHeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  showProgressIndicator?: boolean;
  onBackPress?: () => void;
}

export function AssessmentHeader({
  title,
  subtitle,
  showBackButton = true,
  showProgressIndicator = true,
  onBackPress
}: AssessmentHeaderProps) {
  const { currentStep, totalSteps, prevStep } = useAssessment();

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      prevStep();
    }
  };

  // Ensure currentStep and totalSteps are strings to avoid "Objects are not valid as a React child" error
  const currentStepText = typeof currentStep === 'number' ? String(currentStep) : '1';
  const totalStepsText = typeof totalSteps === 'number' ? String(totalSteps) : '17';

  return (
    <View style={{
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.md,
      paddingBottom: spacing.lg,
    }}>
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.lg,
      }}>
        {showBackButton && (
          <TouchableOpacity
            onPress={handleBack}
            style={assessmentStyles.backButton}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={24} color={assessmentColors.text} />
          </TouchableOpacity>
        )}

        {showProgressIndicator && (
          <View style={assessmentStyles.progressIndicator}>
            <ThemedText style={assessmentStyles.progressText}>
              {currentStepText} of {totalStepsText}
            </ThemedText>
          </View>
        )}
      </View>

      <ThemedText style={assessmentStyles.screenTitle}>{title}</ThemedText>

      {subtitle && (
        <ThemedText style={assessmentStyles.subtitle}>{subtitle}</ThemedText>
      )}
    </View>
  );
}