import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import { useRouter } from 'expo-router';
import { AssessmentTemplate } from '@/components/assessment/AssessmentTemplate';
import { ThemedText } from '@/components/ThemedText';
import { assessmentColors, spacing } from '@/components/ui/AssessmentStyles';
import { useAssessment } from '@/context/AssessmentContext';
import { Ionicons } from '@expo/vector-icons';

export default function WorkoutScheduleScreen() {
  const router = useRouter();
  const { data, updateField } = useAssessment();

  const [workoutDays, setWorkoutDays] = useState<number>(data.preferred_workout_days_count || 3);
  const [workoutDuration, setWorkoutDuration] = useState<string>(data.preferred_workout_duration || '30-45');

  const durationOptions = [
    { id: '15-30', label: '15-30 min' },
    { id: '30-45', label: '30-45 min' },
    { id: '45-60', label: '45-60 min' },
    { id: '60+', label: '60+ min' }
  ];

  const handleContinue = () => {
    // Update assessment data
    updateField('preferred_workout_days_count', workoutDays);
    updateField('workout_frequency_days', workoutDays);
    updateField('preferred_workout_duration', workoutDuration);
    updateField('workout_duration_preference', workoutDuration);

    // Navigate to next screen
    router.push('/(assessment)/excluded-exercises');
  };

  return (
    <AssessmentTemplate
      title="Workout Schedule"
      subtitle="What's your ideal workout routine?"
      onContinue={handleContinue}
      continueButtonDisabled={!workoutDuration}
    >
      <View style={styles.scheduleContainer}>
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>
            How many days would you like your number of workouts per week to be?
          </ThemedText>
          <ThemedText style={styles.sectionSubtitle}>
            (Science says between at least 2 and optimally 4 days a week)
          </ThemedText>

          <View style={styles.sliderContainer}>
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={7}
              step={1}
              value={workoutDays}
              onValueChange={setWorkoutDays}
              minimumTrackTintColor={assessmentColors.primary}
              maximumTrackTintColor={assessmentColors.border}
              thumbTintColor={assessmentColors.primary}
            />

            <View style={styles.sliderLabels}>
              <ThemedText style={styles.sliderLabel}>1</ThemedText>
              <ThemedText style={styles.sliderLabel}>2</ThemedText>
              <ThemedText style={styles.sliderLabel}>3</ThemedText>
              <ThemedText style={styles.sliderLabel}>4</ThemedText>
              <ThemedText style={styles.sliderLabel}>5</ThemedText>
              <ThemedText style={styles.sliderLabel}>6</ThemedText>
              <ThemedText style={styles.sliderLabel}>7</ThemedText>
            </View>
          </View>

          <View style={styles.selectedValueContainer}>
            <ThemedText style={styles.selectedValue}>
              {workoutDays} {workoutDays === 1 ? 'day' : 'days'} per week
            </ThemedText>
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>
            How long do you like your workout to be?
          </ThemedText>
          <ThemedText style={styles.sectionSubtitle}>
            (Select a duration that says no preference, optimize the time for me)
          </ThemedText>

          <View style={styles.durationOptions}>
            {durationOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.durationOption,
                  workoutDuration === option.id && styles.selectedDurationOption
                ]}
                onPress={() => setWorkoutDuration(option.id)}
              >
                <ThemedText style={[
                  styles.durationOptionText,
                  workoutDuration === option.id && styles.selectedDurationOptionText
                ]}>
                  {option.label}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </AssessmentTemplate>
  );
}

const styles = StyleSheet.create({
  scheduleContainer: {
    marginTop: spacing.md,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: assessmentColors.text,
    marginBottom: spacing.sm,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: assessmentColors.textSecondary,
    marginBottom: spacing.lg,
    fontStyle: 'italic',
  },
  sliderContainer: {
    marginVertical: spacing.md,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  sliderLabel: {
    fontSize: 12,
    color: assessmentColors.textSecondary,
  },
  selectedValueContainer: {
    alignItems: 'center',
    marginTop: spacing.md,
  },
  selectedValue: {
    fontSize: 18,
    fontWeight: '600',
    color: assessmentColors.primary,
  },
  durationOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  durationOption: {
    width: '48%',
    backgroundColor: assessmentColors.cardBackground,
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: assessmentColors.border,
  },
  selectedDurationOption: {
    borderColor: assessmentColors.primary,
    backgroundColor: assessmentColors.selectedItemBackground,
  },
  durationOptionText: {
    fontSize: 16,
    color: assessmentColors.text,
  },
  selectedDurationOptionText: {
    color: assessmentColors.primary,
    fontWeight: '600',
  },
});
