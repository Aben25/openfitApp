import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { AssessmentTemplate } from '@/components/assessment/AssessmentTemplate';
import { ThemedText } from '@/components/ThemedText';
import { assessmentColors, spacing } from '@/components/ui/AssessmentStyles';
import { useAssessment } from '@/context/AssessmentContext';
import { Ionicons } from '@expo/vector-icons';

export default function WorkoutEnvironmentScreen() {
  const router = useRouter();
  const { data, updateField } = useAssessment();
  
  const [selectedEnvironments, setSelectedEnvironments] = useState<string[]>(
    data.workout_environment || []
  );
  
  const environments = [
    {
      id: 'large_gym',
      title: 'Large gym',
      description: 'Commercial gym with full equipment',
      icon: 'fitness-outline'
    },
    {
      id: 'small_gym',
      title: 'Small gym',
      description: 'Limited equipment but has essentials',
      icon: 'barbell-outline'
    },
    {
      id: 'home_with_equipment',
      title: 'Home (basic equipment)',
      description: 'Some weights, resistance bands, etc.',
      icon: 'home-outline'
    },
    {
      id: 'home_no_equipment',
      title: 'Home (no equipment)',
      description: 'Bodyweight exercises only',
      icon: 'body-outline'
    }
  ];
  
  const toggleEnvironment = (envId: string) => {
    setSelectedEnvironments(prev => {
      if (prev.includes(envId)) {
        return prev.filter(id => id !== envId);
      } else {
        return [...prev, envId];
      }
    });
  };
  
  const handleContinue = () => {
    // Update assessment data
    updateField('workout_environment', selectedEnvironments);
    updateField('equipment', selectedEnvironments);
    
    // Navigate to next screen
    router.push('/(assessment)/workout-schedule');
  };
  
  return (
    <AssessmentTemplate
      title="Workout Environment"
      subtitle="Select all that apply"
      onContinue={handleContinue}
      continueButtonDisabled={selectedEnvironments.length === 0}
    >
      <View style={styles.environmentsContainer}>
        {environments.map((env) => (
          <TouchableOpacity
            key={env.id}
            style={[
              styles.environmentCard,
              selectedEnvironments.includes(env.id) && styles.selectedEnvironmentCard
            ]}
            onPress={() => toggleEnvironment(env.id)}
          >
            <View style={styles.environmentHeader}>
              <View style={[
                styles.environmentIconContainer,
                selectedEnvironments.includes(env.id) && styles.selectedEnvironmentIconContainer
              ]}>
                <Ionicons 
                  name={env.icon as any} 
                  size={24} 
                  color={selectedEnvironments.includes(env.id) ? assessmentColors.text : assessmentColors.textSecondary} 
                />
              </View>
              
              <View style={styles.checkboxContainer}>
                {selectedEnvironments.includes(env.id) ? (
                  <Ionicons name="checkmark-circle" size={24} color={assessmentColors.primary} />
                ) : (
                  <View style={styles.emptyCheckbox} />
                )}
              </View>
            </View>
            
            <ThemedText style={[
              styles.environmentTitle,
              selectedEnvironments.includes(env.id) && styles.selectedEnvironmentText
            ]}>
              {env.title}
            </ThemedText>
            
            <ThemedText style={styles.environmentDescription}>
              {env.description}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>
    </AssessmentTemplate>
  );
}

const styles = StyleSheet.create({
  environmentsContainer: {
    marginTop: spacing.md,
  },
  environmentCard: {
    backgroundColor: assessmentColors.cardBackground,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: assessmentColors.border,
  },
  selectedEnvironmentCard: {
    borderColor: assessmentColors.primary,
    backgroundColor: assessmentColors.selectedItemBackground,
  },
  environmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  environmentIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedEnvironmentIconContainer: {
    backgroundColor: assessmentColors.primary,
  },
  checkboxContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCheckbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: assessmentColors.border,
  },
  environmentTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: assessmentColors.text,
    marginBottom: spacing.sm,
  },
  selectedEnvironmentText: {
    color: assessmentColors.primary,
  },
  environmentDescription: {
    fontSize: 14,
    color: assessmentColors.textSecondary,
    marginBottom: spacing.sm,
  },
});
