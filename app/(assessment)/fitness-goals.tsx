import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { AssessmentTemplate } from '@/components/assessment/AssessmentTemplate';
import { ThemedText } from '@/components/ThemedText';
import { assessmentColors, spacing } from '@/components/ui/AssessmentStyles';
import { useAssessment } from '@/context/AssessmentContext';
import { Ionicons } from '@expo/vector-icons';

export default function FitnessGoalsScreen() {
  const router = useRouter();
  const { data, updateField } = useAssessment();
  
  const [selectedGoals, setSelectedGoals] = useState<string[]>(data.fitness_goals_array || []);
  const [primaryGoal, setPrimaryGoal] = useState<string | null>(data.fitness_goal_primary || null);
  
  const fitnessGoals = [
    {
      id: 'optimize_health',
      title: 'Optimize my health and fitness',
      description: 'Improve overall health, energy levels, and longevity',
      icon: 'heart-outline'
    },
    {
      id: 'build_muscle',
      title: 'Build muscle mass and size',
      description: 'Increase strength and muscle definition',
      icon: 'barbell-outline'
    },
    {
      id: 'weight_loss',
      title: 'Weight loss and management',
      description: 'Reduce body fat and maintain healthy weight',
      icon: 'trending-down-outline'
    },
    {
      id: 'increase_strength',
      title: 'Increase strength',
      description: 'Focus on maximum strength and power',
      icon: 'flash-outline'
    },
    {
      id: 'improve_cardio',
      title: 'Improve cardio/endurance',
      description: 'Enhance cardiovascular fitness and stamina',
      icon: 'pulse-outline'
    },
    {
      id: 'sport_training',
      title: 'Training for a specific sport or activity',
      description: 'Enhance performance in your chosen sport',
      icon: 'football-outline'
    }
  ];
  
  const toggleGoal = (goalId: string) => {
    setSelectedGoals(prev => {
      if (prev.includes(goalId)) {
        // If removing the primary goal, reset primary goal
        if (primaryGoal === goalId) {
          setPrimaryGoal(null);
        }
        return prev.filter(id => id !== goalId);
      } else {
        // If this is the first goal selected, make it primary
        if (prev.length === 0) {
          setPrimaryGoal(goalId);
        }
        return [...prev, goalId];
      }
    });
  };
  
  const setPrimary = (goalId: string) => {
    setPrimaryGoal(goalId);
  };
  
  const handleContinue = () => {
    // Update assessment data
    updateField('fitness_goals_array', selectedGoals);
    updateField('fitness_goal_primary', primaryGoal);
    
    // Navigate to next screen
    router.push('/(assessment)/cardio-level');
  };
  
  return (
    <AssessmentTemplate
      title="Fitness Goals"
      subtitle="Select all that apply and arrange them in your preferred order"
      onContinue={handleContinue}
      continueButtonDisabled={selectedGoals.length === 0 || !primaryGoal}
    >
      <View style={styles.goalsContainer}>
        {fitnessGoals.map((goal) => (
          <TouchableOpacity
            key={goal.id}
            style={[
              styles.goalCard,
              selectedGoals.includes(goal.id) && styles.selectedGoalCard
            ]}
            onPress={() => toggleGoal(goal.id)}
          >
            <View style={styles.goalHeader}>
              <View style={styles.goalIconContainer}>
                <Ionicons 
                  name={goal.icon as any} 
                  size={24} 
                  color={selectedGoals.includes(goal.id) ? assessmentColors.primary : assessmentColors.text} 
                />
              </View>
              
              <View style={styles.checkboxContainer}>
                {selectedGoals.includes(goal.id) ? (
                  <Ionicons name="checkmark-circle" size={24} color={assessmentColors.primary} />
                ) : (
                  <View style={styles.emptyCheckbox} />
                )}
              </View>
            </View>
            
            <ThemedText style={[
              styles.goalTitle,
              selectedGoals.includes(goal.id) && styles.selectedGoalText
            ]}>
              {goal.title}
            </ThemedText>
            
            <ThemedText style={styles.goalDescription}>
              {goal.description}
            </ThemedText>
            
            {selectedGoals.includes(goal.id) && (
              <TouchableOpacity
                style={[
                  styles.primaryButton,
                  primaryGoal === goal.id && styles.primaryButtonSelected
                ]}
                onPress={() => setPrimary(goal.id)}
              >
                <ThemedText style={[
                  styles.primaryButtonText,
                  primaryGoal === goal.id && styles.primaryButtonTextSelected
                ]}>
                  {primaryGoal === goal.id ? 'Primary Goal' : 'Make Primary'}
                </ThemedText>
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </AssessmentTemplate>
  );
}

const styles = StyleSheet.create({
  goalsContainer: {
    marginTop: spacing.md,
  },
  goalCard: {
    backgroundColor: assessmentColors.cardBackground,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: assessmentColors.border,
  },
  selectedGoalCard: {
    borderColor: assessmentColors.primary,
    backgroundColor: assessmentColors.selectedItemBackground,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  goalIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
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
  goalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: assessmentColors.text,
    marginBottom: spacing.sm,
  },
  selectedGoalText: {
    color: assessmentColors.primary,
  },
  goalDescription: {
    fontSize: 14,
    color: assessmentColors.textSecondary,
    marginBottom: spacing.md,
  },
  primaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: assessmentColors.primary,
    borderRadius: 8,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  primaryButtonSelected: {
    backgroundColor: assessmentColors.primary,
  },
  primaryButtonText: {
    color: assessmentColors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  primaryButtonTextSelected: {
    color: assessmentColors.text,
  },
});
