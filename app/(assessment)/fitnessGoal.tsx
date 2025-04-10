import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { useAssessment } from '@/context/AssessmentContext';

interface GoalOption {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export default function FitnessGoalScreen() {
  const { data, updateField, nextStep, prevStep } = useAssessment();
  const [selectedGoal, setSelectedGoal] = useState<string | null>(
    data.fitness_goal || null
  );
  
  const goalOptions: GoalOption[] = [
    {
      id: 'lose_weight',
      title: 'Lose Weight',
      description: 'Burn fat and improve body composition',
      icon: 'flame-outline',
    },
    {
      id: 'build_muscle',
      title: 'Build Muscle',
      description: 'Increase muscle mass and strength',
      icon: 'barbell-outline',
    },
    {
      id: 'improve_fitness',
      title: 'Improve Fitness',
      description: 'Enhance overall endurance and performance',
      icon: 'pulse-outline',
    },
    {
      id: 'maintain_health',
      title: 'Maintain Health',
      description: 'Stay active and support general wellbeing',
      icon: 'heart-outline',
    },
    {
      id: 'athletic_performance',
      title: 'Athletic Performance',
      description: 'Train for specific sports or competitions',
      icon: 'trophy-outline',
    },
  ];

  const handleGoalSelect = (goalId: string) => {
    setSelectedGoal(goalId);
  };

  const handleContinue = () => {
    if (selectedGoal) {
      updateField('fitness_goal', selectedGoal);
      nextStep();
    }
  };

  const handleBack = () => {
    prevStep();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleBack} activeOpacity={0.7}>
        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      <View style={styles.progressIndicator}>
        <ThemedText style={styles.progressText}>5 of 17</ThemedText>
      </View>
      
      <View style={styles.headerContainer}>
        <ThemedText style={styles.screenTitle}>
          What's your primary fitness goal?
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Select the goal that best describes what you want to achieve
        </ThemedText>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {goalOptions.map((goal) => (
          <TouchableOpacity 
            key={goal.id}
            style={[
              styles.goalOption,
              selectedGoal === goal.id && styles.selectedGoal
            ]}
            onPress={() => handleGoalSelect(goal.id)}
            activeOpacity={0.8}
          >
            <View style={styles.goalIconContainer}>
              <Ionicons 
                name={goal.icon as any} 
                size={28} 
                color={selectedGoal === goal.id ? "#FF8C42" : "#FFFFFF"} 
              />
            </View>
            <View style={styles.goalTextContainer}>
              <ThemedText style={styles.goalTitle}>{goal.title}</ThemedText>
              <ThemedText style={styles.goalDescription}>{goal.description}</ThemedText>
            </View>
            {selectedGoal === goal.id && (
              <View style={styles.checkmark}>
                <Ionicons name="checkmark" size={20} color="#FFFFFF" />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={[
            styles.continueButton, 
            !selectedGoal && styles.continueButtonDisabled
          ]}
          onPress={handleContinue}
          disabled={!selectedGoal}
          activeOpacity={0.8}
        >
          <ThemedText style={styles.continueButtonText}>Continue</ThemedText>
          <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(28, 28, 30, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressIndicator: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(59, 89, 152, 0.7)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    zIndex: 10,
  },
  progressText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  headerContainer: {
    paddingTop: 80,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#BBBBBB',
    textAlign: 'center',
    marginBottom: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  goalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1C1C1E',
  },
  selectedGoal: {
    borderColor: '#FF8C42',
    backgroundColor: 'rgba(255, 140, 66, 0.1)',
  },
  goalIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  goalTextContainer: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  goalDescription: {
    fontSize: 14,
    color: '#BBBBBB',
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF8C42',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  bottomContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  continueButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF8C42',
    paddingVertical: 16,
    borderRadius: 12,
  },
  continueButtonDisabled: {
    backgroundColor: 'rgba(255, 140, 66, 0.5)',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
}); 