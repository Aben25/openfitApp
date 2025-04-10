import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useOnboarding } from '@/context/OnboardingContext';
import { OnboardingHeader } from '@/components/onboarding/OnboardingHeader';
import { OnboardingButton } from '@/components/onboarding/OnboardingButton';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';

// Define workout environment options
const workoutEnvironments = [
  {
    id: 'home',
    title: 'Home',
    icon: 'home-outline',
    description: 'I have some equipment at home',
  },
  {
    id: 'gym',
    title: 'Gym',
    icon: 'barbell-outline',
    description: 'I have access to a fully equipped gym',
  },
  {
    id: 'outdoors',
    title: 'Outdoors',
    icon: 'sunny-outline',
    description: 'I prefer working out outside',
  },
  {
    id: 'hotel',
    title: 'Hotel/Travel',
    icon: 'airplane-outline',
    description: 'I need workouts for when I travel',
  },
  {
    id: 'office',
    title: 'Office',
    icon: 'briefcase-outline',
    description: 'I want to stay active at work',
  },
  {
    id: 'minimal',
    title: 'Minimal Equipment',
    icon: 'body-outline',
    description: 'I prefer bodyweight exercises',
  },
];

export default function WorkoutEnvironmentScreen() {
  const { data, updateField, nextStep } = useOnboarding();
  const [validationError, setValidationError] = useState<string | null>(null);

  // Toggle environment selection
  const toggleEnvironment = (id: string) => {
    let updatedEnvironments;
    
    if (data.workoutEnvironments.includes(id)) {
      // Remove if already selected
      updatedEnvironments = data.workoutEnvironments.filter(env => env !== id);
    } else {
      // Add if not selected
      updatedEnvironments = [...data.workoutEnvironments, id];
    }
    
    updateField('workoutEnvironments', updatedEnvironments);
  };

  const handleContinue = () => {
    // Validate at least one environment is selected
    if (data.workoutEnvironments.length === 0) {
      setValidationError('Please select at least one workout environment');
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
        title="Workout Environment"
        subtitle="Where do you typically work out? This helps us recommend appropriate exercises."
      />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.environmentsContainer}>
          <ThemedText style={styles.sectionTitle}>
            Select all that apply
          </ThemedText>
          
          <View style={styles.optionsGrid}>
            {workoutEnvironments.map(environment => (
              <TouchableOpacity
                key={environment.id}
                style={[
                  styles.environmentOption,
                  data.workoutEnvironments.includes(environment.id) && styles.selectedOption
                ]}
                onPress={() => toggleEnvironment(environment.id)}
                activeOpacity={0.8}
              >
                <View style={styles.iconContainer}>
                  <Ionicons
                    name={environment.icon as any}
                    size={28}
                    color={data.workoutEnvironments.includes(environment.id) ? '#FF8C42' : '#AAAAAA'}
                  />
                </View>
                
                <ThemedText style={styles.optionTitle}>{environment.title}</ThemedText>
                <ThemedText style={styles.optionDescription}>{environment.description}</ThemedText>
                
                {data.workoutEnvironments.includes(environment.id) && (
                  <View style={styles.checkmarkContainer}>
                    <Ionicons name="checkmark-circle" size={24} color="#FF8C42" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
          
          {validationError && (
            <ThemedText style={styles.errorText}>{validationError}</ThemedText>
          )}
        </View>
        
        <View style={styles.infoContainer}>
          <View style={styles.infoBox}>
            <Ionicons name="information-circle-outline" size={24} color="#FF8C42" style={styles.infoIcon} />
            <ThemedText style={styles.infoText}>
              You'll be able to filter workouts by environment later. For best results, select all places where you might work out.
            </ThemedText>
          </View>
        </View>
        
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
  environmentsContainer: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 24,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  environmentOption: {
    width: '48%',
    backgroundColor: '#111111',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333333',
    position: 'relative',
    minHeight: 140,
  },
  selectedOption: {
    borderColor: '#FF8C42',
    backgroundColor: 'rgba(255, 140, 66, 0.1)',
  },
  iconContainer: {
    marginBottom: 12,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 13,
    color: '#AAAAAA',
    lineHeight: 18,
  },
  checkmarkContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  infoContainer: {
    paddingHorizontal: 24,
    marginTop: 8,
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
  },
}); 