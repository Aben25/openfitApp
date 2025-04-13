import React, { ReactNode } from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AssessmentProgress } from '@/components/ui/AssessmentProgress';
import { AssessmentButton, SkipButton } from '@/components/assessment/AssessmentButton';
import { assessmentStyles } from '@/components/ui/AssessmentStyles';
import { ThemedText } from '@/components/ThemedText';
import Animated from 'react-native-reanimated';

interface AssessmentTemplateProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  showBackButton?: boolean;
  showSkipButton?: boolean;
  showContinueButton?: boolean;
  continueButtonTitle?: string;
  continueButtonIcon?: string;
  continueButtonDisabled?: boolean;
  onContinue?: () => void;
  onSkip?: () => void;
  isLoading?: boolean;
  screenStyle?: any;
  titleStyle?: any;
  contentContainerStyle?: any;
}

export function AssessmentTemplate({
  title,
  subtitle,
  children,
  showBackButton = true,
  showSkipButton = false,
  showContinueButton = true,
  continueButtonTitle = 'Continue',
  continueButtonIcon = 'arrow-forward',
  continueButtonDisabled = false,
  onContinue,
  onSkip,
  isLoading = false,
  screenStyle,
  titleStyle,
  contentContainerStyle,
}: AssessmentTemplateProps) {
  return (
    <SafeAreaView style={assessmentStyles.safeArea}>
      <Animated.View style={[assessmentStyles.container, screenStyle]}>
        <AssessmentProgress showBackButton={showBackButton} />
        
        <ScrollView
          style={assessmentStyles.scrollContainer}
          contentContainerStyle={[assessmentStyles.scrollContent, contentContainerStyle]}
          showsVerticalScrollIndicator={false}
        >
          <View>
            <ThemedText style={[assessmentStyles.screenTitle, titleStyle]}>
              {title}
            </ThemedText>
            
            {subtitle && (
              <ThemedText style={assessmentStyles.subtitle}>
                {subtitle}
              </ThemedText>
            )}
          </View>
          
          {children}
          
          {showSkipButton && onSkip && (
            <SkipButton onPress={onSkip} />
          )}
        </ScrollView>
        
        {showContinueButton && onContinue && (
          <View style={assessmentStyles.buttonContainer}>
            <AssessmentButton
              title={continueButtonTitle}
              onPress={onContinue}
              disabled={continueButtonDisabled}
              icon={continueButtonIcon}
              isLoading={isLoading}
            />
          </View>
        )}
      </Animated.View>
    </SafeAreaView>
  );
}
