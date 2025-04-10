import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { useAssessment } from '@/context/AssessmentContext';
import Colors from '@/constants/Colors';

interface FitnessGoal {
  id: string;
  title: string;
  image: string;
}

const fitnessGoals: FitnessGoal[] = [
  {
    id: 'lose_weight',
    title: 'Lose Weight',
    image: 'https://images.unsplash.com/photo-1487956382158-bb926046304a?q=80&w=500'
  },
  {
    id: 'build_muscle',
    title: 'Build Muscle',
    image: 'https://images.unsplash.com/photo-1534367990512-edbdca781b00?q=80&w=500'
  },
  {
    id: 'increase_strength',
    title: 'Increase Strength',
    image: 'https://images.unsplash.com/photo-1585152968992-d2b9444408cc?q=80&w=500'
  },
  {
    id: 'improve_fitness',
    title: 'Improve Fitness',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=500'
  },
  {
    id: 'improve_health',
    title: 'Improve Health',
    image: 'https://images.unsplash.com/photo-1505944357431-27579db47ad1?q=80&w=500'
  }
];

export default function FitnessGoalScreen() {
  const { data, updateField, nextStep } = useAssessment();
  const [selectedGoal, setSelectedGoal] = useState<string | null>(data.fitness_goal || null);

  const handleSelectGoal = (goalId: string) => {
    setSelectedGoal(goalId);
    updateField('fitness_goal', goalId);
  };

  const handleContinue = () => {
    if (selectedGoal) {
      nextStep();
    }
  };

  const handleSkip = () => {
    updateField('fitness_goal', null);
    nextStep();
  };

  return (
    <View style={styles.container}>
      <View style={styles.progressIndicator}>
        <ThemedText style={styles.progressText}>1 of 17</ThemedText>
      </View>
      
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText style={styles.screenTitle}>
          What is your primary fitness goal?
        </ThemedText>
        
        <View style={styles.goalsContainer}>
          {fitnessGoals.map((goal) => (
            <TouchableOpacity
              key={goal.id}
              style={[
                styles.goalOption,
                selectedGoal === goal.id && styles.selectedOption
              ]}
              onPress={() => handleSelectGoal(goal.id)}
              activeOpacity={0.8}
            >
              <View style={styles.goalInfo}>
                <ThemedText style={styles.goalText}>{goal.title}</ThemedText>
              </View>
              
              <Image
                source={{ uri: goal.image }}
                style={styles.goalImage}
                resizeMode="cover"
              />
              
              <View style={styles.radioContainer}>
                <View style={[
                  styles.radioOuter,
                  selectedGoal === goal.id && styles.radioOuterSelected
                ]}>
                  {selectedGoal === goal.id && (
                    <View style={styles.radioInner} />
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <ThemedText style={styles.skipText}>Prefer to skip, thanks!</ThemedText>
          <Ionicons name="close" size={18} color="#FFFFFF" style={styles.skipIcon} />
        </TouchableOpacity>
      </ScrollView>
      
      <View style={styles.buttonContainer}>
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
  scrollContainer: {
    flex: 1,
    paddingTop: 60,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  screenTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 40,
    textAlign: 'center',
  },
  goalsContainer: {
    marginBottom: 24,
  },
  goalOption: {
    position: 'relative',
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1C1C1E',
    overflow: 'hidden',
  },
  selectedOption: {
    borderColor: '#FF8C42',
    backgroundColor: 'rgba(255, 140, 66, 0.1)',
  },
  goalInfo: {
    padding: 16,
    zIndex: 2,
  },
  goalText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  goalImage: {
    width: '100%',
    height: 160,
    zIndex: 1,
    opacity: 0.8,
  },
  radioContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 3,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4A4A4A',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  radioOuterSelected: {
    borderColor: '#FF8C42',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF8C42',
  },
  skipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 59, 48, 0.2)',
  },
  skipText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    marginRight: 8,
  },
  skipIcon: {
    opacity: 0.8,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  continueButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF6B35',
    paddingVertical: 16,
    borderRadius: 10,
  },
  continueButtonDisabled: {
    opacity: 0.5,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
}); 