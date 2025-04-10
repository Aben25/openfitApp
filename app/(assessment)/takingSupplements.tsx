import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { useAssessment } from '@/context/AssessmentContext';
import { router } from 'expo-router';

interface Option {
  id: string;
  title: string;
  value: boolean;
}

export default function TakingSupplementsScreen() {
  const { data, updateField, nextStep, prevStep } = useAssessment();
  const [selected, setSelected] = useState<boolean | null>(
    data.taking_supplements !== undefined ? data.taking_supplements : null
  );

  const options: Option[] = [
    {
      id: 'yes',
      title: 'Yes',
      value: true,
    },
    {
      id: 'no',
      title: 'No',
      value: false,
    },
  ];

  const handleSelect = (value: boolean) => {
    setSelected(value);
  };

  const handleContinue = () => {
    if (selected !== null) {
      updateField('taking_supplements', selected);
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
          Are you currently taking any supplements?
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Vitamins, protein powders, or other supplements
        </ThemedText>
      </View>
      
      <View style={styles.optionsContainer}>
        {options.map((option) => (
          <TouchableOpacity 
            key={option.id}
            style={[
              styles.option,
              selected === option.value && styles.selectedOption
            ]}
            onPress={() => handleSelect(option.value)}
            activeOpacity={0.8}
          >
            <View style={styles.optionContent}>
              <ThemedText style={styles.optionTitle}>
                {option.title}
              </ThemedText>
            </View>
            
            <View style={[
              styles.radioButton,
              selected === option.value && styles.selectedRadioButton
            ]}>
              {selected === option.value && (
                <View style={styles.radioButtonInner} />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>
      
      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={[
            styles.continueButton, 
            selected === null && styles.buttonDisabled
          ]}
          onPress={handleContinue}
          disabled={selected === null}
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
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
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