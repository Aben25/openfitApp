import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';
import { useOnboarding } from '@/context/OnboardingContext';

interface OnboardingHeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
}

export function OnboardingHeader({ 
  title, 
  subtitle,
  showBackButton = true
}: OnboardingHeaderProps) {
  const router = useRouter();
  const { currentStep, totalSteps, prevStep } = useOnboarding();

  const handleBack = () => {
    prevStep();
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        {showBackButton && currentStep > 1 && (
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        )}
        <View style={styles.stepIndicator}>
          <ThemedText style={styles.stepText}>
            {currentStep}/{totalSteps}
          </ThemedText>
        </View>
      </View>
      
      <View style={styles.contentContainer}>
        <ThemedText style={styles.title}>{title}</ThemedText>
        {subtitle && <ThemedText style={styles.subtitle}>{subtitle}</ThemedText>}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  stepIndicator: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  stepText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  contentContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: '#AAAAAA',
    maxWidth: '90%',
  },
}); 