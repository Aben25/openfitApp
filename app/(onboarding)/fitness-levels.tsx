import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TextInput } from 'react-native';
import { useOnboarding } from '@/context/OnboardingContext';
import { OnboardingHeader } from '@/components/onboarding/OnboardingHeader';
import { OnboardingButton } from '@/components/onboarding/OnboardingButton';
import { ThemedText } from '@/components/ThemedText';
import Slider from '@react-native-community/slider';

export default function FitnessLevelsScreen() {
  const { data, updateField, nextStep } = useOnboarding();
  const [validationError, setValidationError] = useState<string | null>(null);

  // Descriptions for each level
  const cardioLevelDescriptions = [
    "I don't do cardio at all",
    "I occasionally do light cardio",
    "I do moderate cardio 1-2 times a week",
    "I do intense cardio 2-4 times a week",
    "I'm an endurance athlete"
  ];

  const weightliftingLevelDescriptions = [
    "I've never lifted weights",
    "I'm a beginner with basic movements",
    "I have intermediate experience",
    "I'm advanced with good technique",
    "I'm at competitive/expert level"
  ];

  // Get description text based on level
  const getCardioDescription = () => {
    const level = data.cardioLevel;
    if (level === null) return cardioLevelDescriptions[0];
    return cardioLevelDescriptions[level - 1];
  };

  const getWeightliftingDescription = () => {
    const level = data.weightliftingLevel;
    if (level === null) return weightliftingLevelDescriptions[0];
    return weightliftingLevelDescriptions[level - 1];
  };

  const handleContinue = () => {
    // Validate inputs
    if (data.cardioLevel === null) {
      setValidationError('Please rate your cardio fitness level');
      return;
    }

    if (data.weightliftingLevel === null) {
      setValidationError('Please rate your weightlifting level');
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
        title="Fitness Levels"
        subtitle="Help us understand your current fitness levels to personalize your workouts."
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Cardio Fitness Level</ThemedText>
          <ThemedText style={styles.sectionSubtitle}>
            Rate your current cardiovascular fitness level from 1-5
          </ThemedText>

          <View style={styles.sliderContainer}>
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={5}
              step={1}
              value={data.cardioLevel || 1}
              onValueChange={(value) => updateField('cardioLevel', value)}
              minimumTrackTintColor="#FF8C42"
              maximumTrackTintColor="#333333"
              thumbTintColor="#FF8C42"
            />

            <View style={styles.markerContainer}>
              {[1, 2, 3, 4, 5].map((value) => (
                <View key={`cardio-${value}`} style={styles.markerItem}>
                  <View 
                    style={[
                      styles.marker,
                      (data.cardioLevel || 0) >= value && styles.activeMarker
                    ]} 
                  />
                  <ThemedText style={styles.markerText}>{value}</ThemedText>
                </View>
              ))}
            </View>

            <ThemedText style={styles.levelDescription}>
              {getCardioDescription()}
            </ThemedText>
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Weightlifting Level</ThemedText>
          <ThemedText style={styles.sectionSubtitle}>
            Rate your current weightlifting ability from 1-5
          </ThemedText>

          <View style={styles.sliderContainer}>
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={5}
              step={1}
              value={data.weightliftingLevel || 1}
              onValueChange={(value) => updateField('weightliftingLevel', value)}
              minimumTrackTintColor="#FF8C42"
              maximumTrackTintColor="#333333"
              thumbTintColor="#FF8C42"
            />

            <View style={styles.markerContainer}>
              {[1, 2, 3, 4, 5].map((value) => (
                <View key={`weight-${value}`} style={styles.markerItem}>
                  <View 
                    style={[
                      styles.marker,
                      (data.weightliftingLevel || 0) >= value && styles.activeMarker
                    ]} 
                  />
                  <ThemedText style={styles.markerText}>{value}</ThemedText>
                </View>
              ))}
            </View>

            <ThemedText style={styles.levelDescription}>
              {getWeightliftingDescription()}
            </ThemedText>
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Additional Notes</ThemedText>
          <ThemedText style={styles.sectionSubtitle}>
            Tell us more about your fitness experience and specific needs
          </ThemedText>

          <TextInput
            style={styles.textArea}
            value={data.fitnessNotes}
            onChangeText={(text) => updateField('fitnessNotes', text)}
            placeholder="Any additional details about your fitness level or experience..."
            placeholderTextColor="#666666"
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Exercises to Avoid</ThemedText>
          <ThemedText style={styles.sectionSubtitle}>
            List any exercises you need to avoid due to injuries or preferences
          </ThemedText>

          <TextInput
            style={styles.textArea}
            value={data.avoidedExercises}
            onChangeText={(text) => updateField('avoidedExercises', text)}
            placeholder="Separate exercises with commas (e.g., barbell squats, deadlifts)"
            placeholderTextColor="#666666"
            multiline
            numberOfLines={3}
          />
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
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#AAAAAA',
    marginBottom: 24,
  },
  sliderContainer: {
    marginBottom: 24,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  markerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  markerItem: {
    alignItems: 'center',
  },
  marker: {
    width: 4,
    height: 12,
    backgroundColor: '#333333',
    borderRadius: 2,
    marginBottom: 8,
  },
  activeMarker: {
    backgroundColor: '#FF8C42',
  },
  markerText: {
    fontSize: 12,
    color: '#AAAAAA',
  },
  levelDescription: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '500',
  },
  textArea: {
    backgroundColor: '#111111',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333333',
    padding: 16,
    fontSize: 16,
    color: '#FFFFFF',
    textAlignVertical: 'top',
    minHeight: 100,
  },
  buttonContainer: {
    padding: 24,
    paddingTop: 32,
  },
  errorText: {
    color: '#FF375F',
    fontSize: 14,
    marginTop: 8,
    marginHorizontal: 24,
  },
}); 