import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { useAssessment } from '@/context/AssessmentContext';

interface DurationOption {
  id: string;
  title: string;
  subtitle: string;
}

export default function WorkoutDurationScreen() {
  const { data, updateField, nextStep, prevStep } = useAssessment();
  const [selectedDuration, setSelectedDuration] = useState<string>(
    data.preferred_workout_duration || ''
  );
  
  const durationOptions: DurationOption[] = [
    {
      id: 'less_than_30_min',
      title: 'Less than 30 minutes',
      subtitle: 'Quick sessions for busy schedules',
    },
    {
      id: '30_to_45_min',
      title: '30-45 minutes',
      subtitle: 'Efficient workouts with good results',
    },
    {
      id: '45_to_60_min',
      title: '45-60 minutes',
      subtitle: 'Standard duration for most programs',
    },
    {
      id: '60_to_90_min',
      title: '60-90 minutes',
      subtitle: 'Comprehensive sessions for better results',
    },
    {
      id: 'more_than_90_min',
      title: 'More than 90 minutes',
      subtitle: 'Extended training for serious athletes',
    }
  ];

  const handleDurationSelect = (durationId: string) => {
    setSelectedDuration(durationId);
  };

  const handleContinue = () => {
    if (selectedDuration) {
      updateField('preferred_workout_duration', selectedDuration);
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
        <ThemedText style={styles.progressText}>15 of 17</ThemedText>
      </View>
      
      <View style={styles.headerContainer}>
        <ThemedText style={styles.screenTitle}>
          How long do you prefer your workout sessions?
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Select your ideal workout duration
        </ThemedText>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.optionsContainer}>
          {durationOptions.map((option) => (
            <TouchableOpacity 
              key={option.id}
              style={[
                styles.durationOption,
                selectedDuration === option.id && styles.selectedOption
              ]}
              onPress={() => handleDurationSelect(option.id)}
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
                selectedDuration === option.id && styles.selectedRadioButton
              ]}>
                {selectedDuration === option.id && (
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
            !selectedDuration && styles.continueButtonDisabled
          ]}
          onPress={handleContinue}
          disabled={!selectedDuration}
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
  durationOption: {
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