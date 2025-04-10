import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { useAssessment } from '@/context/AssessmentContext';
import { router } from 'expo-router';

interface HealthCondition {
  id: string;
  title: string;
  description?: string;
}

export default function HealthConditionsScreen() {
  const { data, updateField, prevStep, completeAssessment } = useAssessment();
  const [selectedConditions, setSelectedConditions] = useState<string[]>(
    data.health_conditions || []
  );

  const healthConditions: HealthCondition[] = [
    {
      id: 'none',
      title: 'None',
      description: 'I don\'t have any health conditions that affect my workout',
    },
    {
      id: 'back_pain',
      title: 'Back Pain',
    },
    {
      id: 'joint_pain',
      title: 'Joint Pain',
    },
    {
      id: 'heart_condition',
      title: 'Heart Condition',
    },
    {
      id: 'high_blood_pressure',
      title: 'High Blood Pressure',
    },
    {
      id: 'diabetes',
      title: 'Diabetes',
    },
    {
      id: 'asthma',
      title: 'Asthma',
    },
    {
      id: 'pregnancy',
      title: 'Pregnancy',
    },
    {
      id: 'injury',
      title: 'Recent Injury',
    },
    {
      id: 'arthritis',
      title: 'Arthritis',
    },
    {
      id: 'other',
      title: 'Other',
    },
  ];

  const toggleCondition = (conditionId: string) => {
    setSelectedConditions((prev) => {
      // If selecting "None", clear all other selections
      if (conditionId === 'none') {
        return prev.includes('none') ? [] : ['none'];
      }
      
      // If selecting any other option while "None" is selected, remove "None"
      let newSelection = [...prev];
      
      if (prev.includes('none')) {
        newSelection = newSelection.filter(id => id !== 'none');
      }
      
      // Toggle the selected condition
      if (newSelection.includes(conditionId)) {
        return newSelection.filter(id => id !== conditionId);
      } else {
        return [...newSelection, conditionId];
      }
    });
  };

  const handleContinue = async () => {
    if (selectedConditions.length > 0) {
      updateField('health_conditions', selectedConditions);
      updateField('fitness_assessment_completed', true);
      await completeAssessment();
      router.push('/tabs');
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
        <ThemedText style={styles.progressText}>17 of 17</ThemedText>
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.headerContainer}>
          <ThemedText style={styles.screenTitle}>
            Do you have any health conditions?
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Select any conditions that may affect your workout routine
          </ThemedText>
        </View>
        
        <View style={styles.optionsContainer}>
          {healthConditions.map((condition) => (
            <TouchableOpacity 
              key={condition.id}
              style={[
                styles.option,
                selectedConditions.includes(condition.id) && styles.selectedOption
              ]}
              onPress={() => toggleCondition(condition.id)}
              activeOpacity={0.8}
            >
              <View style={styles.optionContent}>
                <ThemedText style={styles.optionTitle}>
                  {condition.title}
                </ThemedText>
                {condition.description && (
                  <ThemedText style={styles.optionDescription}>
                    {condition.description}
                  </ThemedText>
                )}
              </View>
              
              <View style={[
                styles.checkbox,
                selectedConditions.includes(condition.id) && styles.selectedCheckbox
              ]}>
                {selectedConditions.includes(condition.id) && (
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
            selectedConditions.length === 0 && styles.buttonDisabled
          ]}
          onPress={handleContinue}
          disabled={selectedConditions.length === 0}
          activeOpacity={0.8}
        >
          <ThemedText style={styles.continueButtonText}>Complete</ThemedText>
          <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
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