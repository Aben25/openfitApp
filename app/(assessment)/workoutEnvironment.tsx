import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { useAssessment } from '@/context/AssessmentContext';

interface EnvironmentOption {
  id: string;
  title: string;
  subtitle: string;
}

export default function WorkoutEnvironmentScreen() {
  const { data, updateField, nextStep, prevStep } = useAssessment();
  const [selectedEnvironments, setSelectedEnvironments] = useState<string[]>(
    data.workout_environment || []
  );

  const environmentOptions: EnvironmentOption[] = [
    {
      id: 'home',
      title: 'At Home',
      subtitle: 'Workouts in the comfort of your home',
    },
    {
      id: 'gym',
      title: 'At the Gym',
      subtitle: 'Access to full equipment and facilities',
    },
    {
      id: 'outdoors',
      title: 'Outdoors',
      subtitle: 'Parks, trails, and outdoor spaces',
    },
    {
      id: 'work',
      title: 'At Work',
      subtitle: 'Office or workplace environment',
    },
    {
      id: 'traveling',
      title: 'While Traveling',
      subtitle: 'Hotels, airports, and on-the-go',
    }
  ];

  const handleEnvironmentToggle = (environmentId: string) => {
    setSelectedEnvironments(prev => {
      if (prev.includes(environmentId)) {
        return prev.filter(id => id !== environmentId);
      } else {
        return [...prev, environmentId];
      }
    });
  };

  const handleContinue = () => {
    if (selectedEnvironments.length > 0) {
      updateField('workout_environment', selectedEnvironments);
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
        <ThemedText style={styles.progressText}>13 of 17</ThemedText>
      </View>
      
      <View style={styles.headerContainer}>
        <ThemedText style={styles.screenTitle}>
          Where do you prefer to work out?
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Select all that apply to you
        </ThemedText>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.optionsContainer}>
          {environmentOptions.map((option) => (
            <TouchableOpacity 
              key={option.id}
              style={[
                styles.environmentOption,
                selectedEnvironments.includes(option.id) && styles.selectedOption
              ]}
              onPress={() => handleEnvironmentToggle(option.id)}
              activeOpacity={0.8}
            >
              <View style={styles.optionContent}>
                <ThemedText style={styles.optionTitle}>
                  {option.title}
                </ThemedText>
                <ThemedText style={styles.optionSubtitle}>
                  {option.subtitle}
                </ThemedText>
              </View>
              
              <View style={[
                styles.checkbox,
                selectedEnvironments.includes(option.id) && styles.selectedCheckbox
              ]}>
                {selectedEnvironments.includes(option.id) && (
                  <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      
      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={[
            styles.continueButton, 
            selectedEnvironments.length === 0 && styles.continueButtonDisabled
          ]}
          onPress={handleContinue}
          disabled={selectedEnvironments.length === 0}
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
  optionsContainer: {
    width: '100%',
  },
  environmentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1C1C1E',
  },
  selectedOption: {
    borderColor: '#FF8C42',
    backgroundColor: 'rgba(255, 140, 66, 0.1)',
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  optionSubtitle: {
    fontSize: 14,
    color: '#BBBBBB',
    marginTop: 4,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#BBBBBB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCheckbox: {
    borderColor: '#FF8C42',
    backgroundColor: '#FF8C42',
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