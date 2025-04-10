import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { useAssessment } from '@/context/AssessmentContext';

interface FrequencyOption {
  id: number;
  title: string;
  subtitle: string;
}

export default function WorkoutFrequencyScreen() {
  const { data, updateField, nextStep, prevStep } = useAssessment();
  const [selectedFrequency, setSelectedFrequency] = useState<number>(
    data.preferred_workout_days_count || 0
  );

  const frequencyOptions: FrequencyOption[] = [
    {
      id: 1,
      title: '1 day / week',
      subtitle: 'Minimal commitment for beginners',
    },
    {
      id: 2,
      title: '2 days / week',
      subtitle: 'Light schedule for busy people',
    },
    {
      id: 3,
      title: '3 days / week',
      subtitle: 'Balanced frequency with rest days',
    },
    {
      id: 4,
      title: '4 days / week',
      subtitle: 'Moderate intensity with recovery',
    },
    {
      id: 5,
      title: '5 days / week',
      subtitle: 'Higher frequency for faster results',
    },
    {
      id: 6,
      title: '6+ days / week',
      subtitle: 'Advanced schedule for dedicated trainees',
    }
  ];

  const handleFrequencySelect = (frequencyId: number) => {
    setSelectedFrequency(frequencyId);
  };

  const handleContinue = () => {
    if (selectedFrequency > 0) {
      updateField('preferred_workout_days_count', selectedFrequency);
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
        <ThemedText style={styles.progressText}>14 of 17</ThemedText>
      </View>
      
      <View style={styles.headerContainer}>
        <ThemedText style={styles.screenTitle}>
          How many days per week do you prefer to work out?
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Select the option that best fits your schedule
        </ThemedText>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.optionsContainer}>
          {frequencyOptions.map((option) => (
            <TouchableOpacity 
              key={option.id}
              style={[
                styles.frequencyOption,
                selectedFrequency === option.id && styles.selectedOption
              ]}
              onPress={() => handleFrequencySelect(option.id)}
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
                styles.radioButton,
                selectedFrequency === option.id && styles.selectedRadioButton
              ]}>
                {selectedFrequency === option.id && (
                  <View style={styles.radioButtonInner} />
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
            selectedFrequency === 0 && styles.continueButtonDisabled
          ]}
          onPress={handleContinue}
          disabled={selectedFrequency === 0}
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
  frequencyOption: {
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
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#BBBBBB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedRadioButton: {
    borderColor: '#FF8C42',
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
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