import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { useAssessment } from '@/context/AssessmentContext';

interface DietOption {
  id: string;
  title: string;
  description: string;
}

const dietOptions: DietOption[] = [
  {
    id: 'omnivore',
    title: 'Omnivore',
    description: 'I eat everything including meat, vegetables, and dairy'
  },
  {
    id: 'vegetarian',
    title: 'Vegetarian',
    description: 'I avoid meat but eat eggs and dairy products'
  },
  {
    id: 'vegan',
    title: 'Vegan',
    description: 'I avoid all animal products including eggs and dairy'
  },
  {
    id: 'pescatarian',
    title: 'Pescatarian',
    description: 'I eat fish but avoid other meats'
  },
  {
    id: 'keto',
    title: 'Keto',
    description: 'I follow a high-fat, low-carb diet'
  },
  {
    id: 'paleo',
    title: 'Paleo',
    description: 'I eat whole foods and avoid processed foods and grains'
  },
  {
    id: 'gluten_free',
    title: 'Gluten-Free',
    description: 'I avoid gluten-containing foods'
  },
  {
    id: 'dairy_free',
    title: 'Dairy-Free',
    description: 'I avoid dairy products'
  }
];

export default function DietScreen() {
  const { data, updateField, nextStep, prevStep } = useAssessment();
  const [selectedDiets, setSelectedDiets] = useState<string[]>(
    data.diet_preferences || []
  );

  const handleSelectDiet = (dietId: string) => {
    setSelectedDiets(prev => {
      if (prev.includes(dietId)) {
        return prev.filter(id => id !== dietId);
      } else {
        return [...prev, dietId];
      }
    });
  };

  const handleContinue = () => {
    updateField('diet_preferences', selectedDiets);
    nextStep();
  };

  const handleBack = () => {
    prevStep();
  };

  const handleSkip = () => {
    updateField('diet_preferences', []);
    nextStep();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleBack} activeOpacity={0.7}>
        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      <View style={styles.progressIndicator}>
        <ThemedText style={styles.progressText}>3 of 17</ThemedText>
      </View>
      
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText style={styles.screenTitle}>
          What are your dietary preferences?
        </ThemedText>
        <ThemedText style={styles.screenSubtitle}>
          Select all that apply
        </ThemedText>
        
        <View style={styles.dietsContainer}>
          {dietOptions.map((diet) => (
            <TouchableOpacity
              key={diet.id}
              style={[
                styles.dietOption,
                selectedDiets.includes(diet.id) && styles.selectedOption
              ]}
              onPress={() => handleSelectDiet(diet.id)}
              activeOpacity={0.8}
            >
              <View style={styles.dietInfo}>
                <ThemedText style={styles.dietTitle}>{diet.title}</ThemedText>
                <ThemedText style={styles.dietDescription}>{diet.description}</ThemedText>
              </View>
              
              <View style={styles.checkboxContainer}>
                <View style={[
                  styles.checkbox,
                  selectedDiets.includes(diet.id) && styles.checkboxSelected
                ]}>
                  {selectedDiets.includes(diet.id) && (
                    <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <ThemedText style={styles.skipText}>No specific dietary preferences</ThemedText>
          <Ionicons name="close" size={18} color="#FFFFFF" style={styles.skipIcon} />
        </TouchableOpacity>
      </ScrollView>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
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
    marginBottom: 12,
    textAlign: 'center',
  },
  screenSubtitle: {
    fontSize: 16,
    color: '#AAAAAA',
    marginBottom: 30,
    textAlign: 'center',
  },
  dietsContainer: {
    marginBottom: 24,
  },
  dietOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1C1C1E',
  },
  selectedOption: {
    borderColor: '#FF8C42',
    backgroundColor: 'rgba(255, 140, 66, 0.1)',
  },
  dietInfo: {
    flex: 1,
  },
  dietTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  dietDescription: {
    fontSize: 14,
    color: '#BBBBBB',
    lineHeight: 18,
  },
  checkboxContainer: {
    marginLeft: 16,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#4A4A4A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#FF8C42',
    borderColor: '#FF8C42',
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
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
}); 