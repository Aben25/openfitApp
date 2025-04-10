import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { useAssessment } from '@/context/AssessmentContext';
import { router } from 'expo-router';

interface DietaryRestriction {
  id: string;
  title: string;
  description?: string;
}

export default function DietaryRestrictionsScreen() {
  const { data, updateField, nextStep, prevStep } = useAssessment();
  const [selectedRestrictions, setSelectedRestrictions] = useState<string[]>(
    data.dietary_restrictions || []
  );

  const dietaryRestrictions: DietaryRestriction[] = [
    {
      id: 'none',
      title: 'None',
      description: 'I don\'t have any dietary restrictions',
    },
    {
      id: 'vegetarian',
      title: 'Vegetarian',
    },
    {
      id: 'vegan',
      title: 'Vegan',
    },
    {
      id: 'pescatarian',
      title: 'Pescatarian',
    },
    {
      id: 'gluten_free',
      title: 'Gluten-Free',
    },
    {
      id: 'dairy_free',
      title: 'Dairy-Free',
    },
    {
      id: 'keto',
      title: 'Keto',
    },
    {
      id: 'paleo',
      title: 'Paleo',
    },
    {
      id: 'halal',
      title: 'Halal',
    },
    {
      id: 'kosher',
      title: 'Kosher',
    },
    {
      id: 'other',
      title: 'Other',
    },
  ];

  const toggleRestriction = (restrictionId: string) => {
    setSelectedRestrictions((prev) => {
      // If selecting "None", clear all other selections
      if (restrictionId === 'none') {
        return prev.includes('none') ? [] : ['none'];
      }
      
      // If selecting any other option while "None" is selected, remove "None"
      let newSelection = [...prev];
      
      if (prev.includes('none')) {
        newSelection = newSelection.filter(id => id !== 'none');
      }
      
      // Toggle the selected restriction
      if (newSelection.includes(restrictionId)) {
        return newSelection.filter(id => id !== restrictionId);
      } else {
        return [...newSelection, restrictionId];
      }
    });
  };

  const handleContinue = () => {
    if (selectedRestrictions.length > 0) {
      updateField('dietary_restrictions', selectedRestrictions);
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
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.headerContainer}>
          <ThemedText style={styles.screenTitle}>
            Do you have any dietary restrictions?
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Select all that apply to your diet
          </ThemedText>
        </View>
        
        <View style={styles.optionsContainer}>
          {dietaryRestrictions.map((restriction) => (
            <TouchableOpacity 
              key={restriction.id}
              style={[
                styles.option,
                selectedRestrictions.includes(restriction.id) && styles.selectedOption
              ]}
              onPress={() => toggleRestriction(restriction.id)}
              activeOpacity={0.8}
            >
              <View style={styles.optionContent}>
                <ThemedText style={styles.optionTitle}>
                  {restriction.title}
                </ThemedText>
                {restriction.description && (
                  <ThemedText style={styles.optionDescription}>
                    {restriction.description}
                  </ThemedText>
                )}
              </View>
              
              <View style={[
                styles.checkbox,
                selectedRestrictions.includes(restriction.id) && styles.selectedCheckbox
              ]}>
                {selectedRestrictions.includes(restriction.id) && (
                  <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.spacer} />
      </ScrollView>
      
      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={[
            styles.continueButton, 
            selectedRestrictions.length === 0 && styles.buttonDisabled
          ]}
          onPress={handleContinue}
          disabled={selectedRestrictions.length === 0}
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
  scrollView: {
    flex: 1,
    padding: 20,
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
    marginBottom: 40,
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
  },
  optionsContainer: {
    marginTop: 20,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
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
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  optionDescription: {
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
    backgroundColor: '#FF8C42',
    borderColor: '#FF8C42',
  },
  spacer: {
    height: 100,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: 'transparent',
  },
  continueButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF8C42',
    paddingVertical: 16,
    borderRadius: 12,
  },
  buttonDisabled: {
    backgroundColor: 'rgba(255, 140, 66, 0.5)',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
}); 