import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useOnboarding } from '@/context/OnboardingContext';
import { OnboardingHeader } from '@/components/onboarding/OnboardingHeader';
import { OnboardingButton } from '@/components/onboarding/OnboardingButton';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';

// Define workout frequency options
const frequencyOptions = [
  { value: 1, label: '1 day per week' },
  { value: 2, label: '2 days per week' },
  { value: 3, label: '3 days per week' },
  { value: 4, label: '4 days per week' },
  { value: 5, label: '5 days per week' },
  { value: 6, label: '6 days per week' },
  { value: 7, label: '7 days per week' },
];

// Define workout duration options
const durationOptions = [
  { value: 15, label: '15 minutes' },
  { value: 30, label: '30 minutes' },
  { value: 45, label: '45 minutes' },
  { value: 60, label: '60 minutes' },
  { value: 90, label: '90 minutes' },
  { value: 120, label: '2 hours or more' },
];

export default function WorkoutScheduleScreen() {
  const { data, updateField, nextStep } = useOnboarding();
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleContinue = () => {
    // Validate inputs
    if (data.workoutsPerWeek === null) {
      setValidationError('Please select how many days per week you want to work out');
      return;
    }

    if (data.workoutDuration === null) {
      setValidationError('Please select how long you want your workouts to be');
      return;
    }

    // Clear any validation errors
    setValidationError(null);

    // Move to next step
    nextStep();
  };

  return (
    <View style={styles.container}>
      <OnboardingHeader
        title="Workout Schedule"
        subtitle="Tell us about your ideal workout schedule so we can create a plan that fits your lifestyle."
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>
            How many days per week do you want to work out?
          </ThemedText>

          <View style={styles.optionsContainer}>
            {frequencyOptions.map(option => (
              <TouchableOpacity
                key={`frequency-${option.value}`}
                style={[
                  styles.option,
                  data.workoutsPerWeek === option.value && styles.selectedOption
                ]}
                onPress={() => updateField('workoutsPerWeek', option.value)}
                activeOpacity={0.8}
              >
                <ThemedText 
                  style={[
                    styles.optionText,
                    data.workoutsPerWeek === option.value && styles.selectedOptionText
                  ]}
                >
                  {option.label}
                </ThemedText>

                {data.workoutsPerWeek === option.value && (
                  <Ionicons name="checkmark-circle" size={20} color="#FF8C42" style={styles.checkmark} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>
            How long do you want your workouts to be?
          </ThemedText>

          <View style={styles.optionsContainer}>
            {durationOptions.map(option => (
              <TouchableOpacity
                key={`duration-${option.value}`}
                style={[
                  styles.option,
                  data.workoutDuration === option.value && styles.selectedOption
                ]}
                onPress={() => updateField('workoutDuration', option.value)}
                activeOpacity={0.8}
              >
                <ThemedText 
                  style={[
                    styles.optionText,
                    data.workoutDuration === option.value && styles.selectedOptionText
                  ]}
                >
                  {option.label}
                </ThemedText>

                {data.workoutDuration === option.value && (
                  <Ionicons name="checkmark-circle" size={20} color="#FF8C42" style={styles.checkmark} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoBox}>
            <Ionicons name="information-circle-outline" size={24} color="#FF8C42" style={styles.infoIcon} />
            <ThemedText style={styles.infoText}>
              For best results, choose a schedule you can realistically maintain. Consistency is more important than intensity.
            </ThemedText>
          </View>
        </View>

        {validationError && (
          <ThemedText style={styles.errorText}>{validationError}</ThemedText>
        )}

        <View style={styles.buttonContainer}>
          <OnboardingButton
            title="Continue"
            onPress={handleContinue}
            icon="arrow-forward"
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 40,
  },
  section: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 24,
  },
  optionsContainer: {
    marginBottom: 8,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#111111',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333333',
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  selectedOption: {
    borderColor: '#FF8C42',
    backgroundColor: 'rgba(255, 140, 66, 0.1)',
  },
  optionText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  selectedOptionText: {
    fontWeight: '600',
    color: '#FF8C42',
  },
  checkmark: {
    marginLeft: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#333333',
    marginVertical: 8,
    marginHorizontal: 24,
  },
  infoContainer: {
    paddingHorizontal: 24,
    marginTop: 16,
  },
  infoBox: {
    backgroundColor: 'rgba(255, 140, 66, 0.1)',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  infoText: {
    fontSize: 14,
    color: '#DDDDDD',
    flex: 1,
    lineHeight: 20,
  },
  buttonContainer: {
    padding: 24,
    marginTop: 32,
  },
  errorText: {
    color: '#FF375F',
    fontSize: 14,
    marginTop: 8,
    marginHorizontal: 24,
  },
}); 