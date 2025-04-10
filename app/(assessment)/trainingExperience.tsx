import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { useAssessment } from '@/context/AssessmentContext';

interface ExperienceOption {
  id: string;
  title: string;
  subtitle: string;
}

export default function TrainingExperienceScreen() {
  const { data, updateField, nextStep, prevStep } = useAssessment();
  const [selectedExperience, setSelectedExperience] = useState<string>(
    data.training_experience_level || ''
  );

  const experienceOptions: ExperienceOption[] = [
    {
      id: 'beginner',
      title: 'Beginner',
      subtitle: 'New to fitness or returning after a long break',
    },
    {
      id: 'intermediate',
      title: 'Intermediate',
      subtitle: 'Consistent training for 6 months to 2 years',
    },
    {
      id: 'advanced',
      title: 'Advanced',
      subtitle: 'Regular training for 2+ years with good knowledge',
    },
    {
      id: 'expert',
      title: 'Expert',
      subtitle: 'Consistent training for 5+ years with deep understanding',
    },
    {
      id: 'professional',
      title: 'Professional',
      subtitle: 'Competitive athlete or fitness professional',
    }
  ];

  const handleExperienceSelect = (experienceId: string) => {
    setSelectedExperience(experienceId);
  };

  const handleContinue = () => {
    if (selectedExperience) {
      updateField('training_experience_level', selectedExperience);
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
        <ThemedText style={styles.progressText}>16 of 17</ThemedText>
      </View>
      
      <View style={styles.headerContainer}>
        <ThemedText style={styles.screenTitle}>
          What is your fitness experience level?
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Select the option that best describes your experience
        </ThemedText>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.optionsContainer}>
          {experienceOptions.map((option) => (
            <TouchableOpacity 
              key={option.id}
              style={[
                styles.experienceOption,
                selectedExperience === option.id && styles.selectedOption
              ]}
              onPress={() => handleExperienceSelect(option.id)}
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
                selectedExperience === option.id && styles.selectedRadioButton
              ]}>
                {selectedExperience === option.id && (
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
            !selectedExperience && styles.continueButtonDisabled
          ]}
          onPress={handleContinue}
          disabled={!selectedExperience}
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
  experienceOption: {
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