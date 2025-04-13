import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '../ThemedText';
import { useAssessment } from '@/context/AssessmentContext';
import { assessmentStyles, assessmentColors } from './AssessmentStyles';
import { usePathname } from 'expo-router';

interface AssessmentProgressProps {
  showBackButton?: boolean;
  onBack?: () => void;
  customBackAction?: boolean;
}

export function AssessmentProgress({
  showBackButton = true,
  onBack,
  customBackAction = false
}: AssessmentProgressProps) {
  const { totalSteps, prevStep } = useAssessment();
  const pathname = usePathname();

  // Determine current step based on pathname
  const getCurrentStepFromPath = () => {
    const routeOrder = [
      'index',              // Welcome screen
      'about-you',          // Basic info
      'fitness-goals',      // Fitness goals
      'cardio-level',       // Cardio level
      'strength-level',     // Strength level
      'workout-environment', // Workout environment
      'workout-schedule',   // Workout schedule
      'excluded-exercises', // Excluded exercises
      'complete',           // Assessment complete
    ];

    const currentPath = pathname?.split('/').pop() || 'index';
    const stepIndex = routeOrder.findIndex(route => route === currentPath);
    return stepIndex !== -1 ? stepIndex + 1 : 1;
  };

  const [displayStep, setDisplayStep] = useState(1);

  // Update step when pathname changes
  useEffect(() => {
    if (pathname) {
      setDisplayStep(getCurrentStepFromPath());
    }
  }, [pathname]);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (prevStep && !customBackAction) {
      prevStep();
    }
  };

  // Ensure displayStep and totalSteps are strings to avoid "Objects are not valid as a React child" error
  const currentStepText = String(displayStep);
  const totalStepsText = typeof totalSteps === 'number' ? String(totalSteps) : '9';

  return (
    <View style={assessmentStyles.progressContainer}>
      {showBackButton && (
        <TouchableOpacity
          onPress={handleBack}
          style={assessmentStyles.backButton}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="chevron-back" size={24} color={assessmentColors.text} />
        </TouchableOpacity>
      )}

      <View style={assessmentStyles.progressIndicator}>
        <ThemedText style={assessmentStyles.progressText}>
          {currentStepText} of {totalStepsText}
        </ThemedText>
      </View>
    </View>
  );
}