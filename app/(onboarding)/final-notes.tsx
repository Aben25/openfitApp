import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import { useOnboarding } from '@/context/OnboardingContext';
import { OnboardingHeader } from '@/components/onboarding/OnboardingHeader';
import { OnboardingButton } from '@/components/onboarding/OnboardingButton';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { ErrorType, createError, logError, showError } from '@/utils/errorHandler';

export default function FinalNotesScreen() {
  const { data, updateField, saveOnboardingData, isLoading, error } = useOnboarding();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleComplete = async () => {
    try {
      setIsSubmitting(true);
      // Save all onboarding data to Supabase
      await saveOnboardingData();
      // Note: navigation to tabs is handled in the saveOnboardingData function
    } catch (err) {
      const appError = createError(
        'Failed to complete onboarding',
        ErrorType.API,
        err
      );
      logError(appError);
      showError(appError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <OnboardingHeader
        title="Final Notes"
        subtitle="Almost done! Any final information you'd like to share about your fitness journey?"
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>
            Additional Information (Optional)
          </ThemedText>
          <ThemedText style={styles.sectionSubtitle}>
            Share any other details that might help us create your perfect workout plan
          </ThemedText>

          <TextInput
            style={styles.textArea}
            value={data.additionalInfo}
            onChangeText={(text) => updateField('additionalInfo', text)}
            placeholder="Tell us about diet preferences, recovery needs, previous injuries, or any other information."
            placeholderTextColor="#666666"
            multiline
            numberOfLines={6}
          />
        </View>

        <View style={styles.summaryContainer}>
          <ThemedText style={styles.summaryTitle}>Your Fitness Profile</ThemedText>
          
          <View style={styles.summaryItem}>
            <Ionicons name="person-outline" size={22} color="#FF8C42" style={styles.summaryIcon} />
            <View style={styles.summaryText}>
              <ThemedText style={styles.summaryLabel}>Basic Info</ThemedText>
              <ThemedText style={styles.summaryValue}>
                {data.name}, {data.gender || 'Not specified'}, {data.age || '–'} years
              </ThemedText>
            </View>
          </View>
          
          <View style={styles.summaryItem}>
            <Ionicons name="body-outline" size={22} color="#FF8C42" style={styles.summaryIcon} />
            <View style={styles.summaryText}>
              <ThemedText style={styles.summaryLabel}>Body Stats</ThemedText>
              <ThemedText style={styles.summaryValue}>
                {data.height ? `${data.height} ${data.heightUnit}` : '–'}, 
                {data.weight ? ` ${data.weight} ${data.weightUnit}` : ' –'}
              </ThemedText>
            </View>
          </View>
          
          <View style={styles.summaryItem}>
            <Ionicons name="trophy-outline" size={22} color="#FF8C42" style={styles.summaryIcon} />
            <View style={styles.summaryText}>
              <ThemedText style={styles.summaryLabel}>Fitness Goals</ThemedText>
              <ThemedText style={styles.summaryValue}>
                {data.fitnessGoals.filter(g => g.selected).length > 0 
                  ? data.fitnessGoals.filter(g => g.selected).map(g => g.title).join(', ') 
                  : 'No goals selected'}
              </ThemedText>
            </View>
          </View>
          
          <View style={styles.summaryItem}>
            <Ionicons name="calendar-outline" size={22} color="#FF8C42" style={styles.summaryIcon} />
            <View style={styles.summaryText}>
              <ThemedText style={styles.summaryLabel}>Workout Schedule</ThemedText>
              <ThemedText style={styles.summaryValue}>
                {data.workoutsPerWeek ? `${data.workoutsPerWeek} days/week` : '–'}, 
                {data.workoutDuration ? ` ${data.workoutDuration} mins` : ' –'}
              </ThemedText>
            </View>
          </View>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoBox}>
            <Ionicons name="information-circle-outline" size={24} color="#FF8C42" style={styles.infoIcon} />
            <ThemedText style={styles.infoText}>
              You'll be able to edit your profile and preferences anytime from your account settings.
            </ThemedText>
          </View>
        </View>

        {error && (
          <ThemedText style={styles.errorText}>{error}</ThemedText>
        )}

        <View style={styles.buttonContainer}>
          <OnboardingButton
            title="Complete Setup"
            onPress={handleComplete}
            isLoading={isLoading || isSubmitting}
            icon="checkmark-circle-outline"
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
    marginBottom: 16,
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
    minHeight: 150,
  },
  summaryContainer: {
    padding: 24,
    backgroundColor: '#111111',
    marginHorizontal: 24,
    borderRadius: 16,
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryIcon: {
    marginRight: 12,
  },
  summaryText: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#AAAAAA',
    marginBottom: 2,
  },
  summaryValue: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  infoContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
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
  },
  errorText: {
    color: '#FF375F',
    fontSize: 14,
    marginTop: 8,
    marginBottom: 16,
    marginHorizontal: 24,
  },
}); 