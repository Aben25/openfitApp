import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '../ThemedText';
import { useAssessment } from '@/context/AssessmentContext';

interface AssessmentHeaderProps {
  title: string;
  showBackButton?: boolean;
  showProgressIndicator?: boolean;
}

export function AssessmentHeader({
  title,
  showBackButton = true,
  showProgressIndicator = true
}: AssessmentHeaderProps) {
  const router = useRouter();
  const { currentStep, totalSteps, prevStep } = useAssessment();

  const handleBack = () => {
    prevStep();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {showBackButton && (
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        )}
        
        {showProgressIndicator && (
          <View style={styles.progressIndicator}>
            <ThemedText style={styles.progressText}>
              {currentStep} of {totalSteps}
            </ThemedText>
          </View>
        )}
      </View>
      
      <ThemedText style={styles.title}>{title}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#222',
  },
  progressIndicator: {
    backgroundColor: '#1C1C1E',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
}); 