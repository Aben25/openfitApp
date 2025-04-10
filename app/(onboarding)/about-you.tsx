import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { useOnboarding } from '@/context/OnboardingContext';
import { OnboardingHeader } from '@/components/onboarding/OnboardingHeader';
import { OnboardingButton } from '@/components/onboarding/OnboardingButton';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';

export default function AboutYouScreen() {
  const { user } = useAuth();
  const { data, updateField, nextStep } = useOnboarding();
  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    age?: string;
    height?: string;
    weight?: string;
  }>({});

  // Gender options
  const genderOptions = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' },
  ];

  // Units toggle options
  const heightUnits = [
    { label: 'cm', value: 'cm' },
    { label: 'ft', value: 'ft' },
  ];

  const weightUnits = [
    { label: 'kg', value: 'kg' },
    { label: 'lbs', value: 'lbs' },
  ];

  // Format potential email as name
  const getNameFromEmail = () => {
    if (data.name) return data.name;
    if (user?.email) {
      const emailName = user.email.split('@')[0];
      // Convert snake_case or dots to spaces and capitalize
      return emailName
        .replace(/[_\.]/g, ' ')
        .replace(/\w\S*/g, (w) => w.replace(/^\w/, (c) => c.toUpperCase()));
    }
    return '';
  };

  const handleContinue = () => {
    // Validate inputs
    const errors: { [key: string]: string } = {};

    if (!data.name.trim()) {
      errors.name = 'Name is required';
    }

    if (data.age !== null) {
      if (data.age < 13 || data.age > 100) {
        errors.age = 'Age must be between 13 and 100';
      }
    } else {
      errors.age = 'Age is required';
    }

    if (data.height !== null) {
      if (data.heightUnit === 'cm' && (data.height < 100 || data.height > 250)) {
        errors.height = 'Height must be between 100 and 250 cm';
      } else if (data.heightUnit === 'ft' && (data.height < 3 || data.height > 8)) {
        errors.height = 'Height must be between 3 and 8 feet';
      }
    } else {
      errors.height = 'Height is required';
    }

    if (data.weight !== null) {
      if (data.weightUnit === 'kg' && (data.weight < 30 || data.weight > 300)) {
        errors.weight = 'Weight must be between 30 and 300 kg';
      } else if (data.weightUnit === 'lbs' && (data.weight < 65 || data.weight > 660)) {
        errors.weight = 'Weight must be between 65 and 660 lbs';
      }
    } else {
      errors.weight = 'Weight is required';
    }

    setValidationErrors(errors);

    if (Object.keys(errors).length === 0) {
      nextStep();
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <OnboardingHeader
        title="About You"
        subtitle="Let's get to know you better to create your personalized plan."
        showBackButton={false}
      />

      <View style={styles.form}>
        {/* Name input */}
        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Your Name</ThemedText>
          <TextInput
            style={[styles.input, validationErrors.name && styles.inputError]}
            value={data.name || getNameFromEmail()}
            onChangeText={(text) => updateField('name', text)}
            placeholder="Enter your name"
            placeholderTextColor="#666666"
            autoCapitalize="words"
          />
          {validationErrors.name && (
            <ThemedText style={styles.errorText}>{validationErrors.name}</ThemedText>
          )}
        </View>

        {/* Gender selection */}
        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Gender</ThemedText>
          <View style={styles.optionsContainer}>
            {genderOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.optionButton,
                  data.gender === option.value && styles.selectedOption,
                ]}
                onPress={() => updateField('gender', option.value as any)}
              >
                <ThemedText
                  style={[
                    styles.optionText,
                    data.gender === option.value && styles.selectedOptionText,
                  ]}
                >
                  {option.label}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Age input */}
        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Age</ThemedText>
          <TextInput
            style={[styles.input, validationErrors.age && styles.inputError]}
            value={data.age !== null ? data.age.toString() : ''}
            onChangeText={(text) => {
              const age = text === '' ? null : parseInt(text, 10);
              if (text === '' || !isNaN(age)) {
                updateField('age', age);
              }
            }}
            placeholder="Enter your age"
            placeholderTextColor="#666666"
            keyboardType="number-pad"
            maxLength={3}
          />
          {validationErrors.age && (
            <ThemedText style={styles.errorText}>{validationErrors.age}</ThemedText>
          )}
        </View>

        {/* Height input with units toggle */}
        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Height</ThemedText>
          <View style={styles.inputWithToggle}>
            <TextInput
              style={[
                styles.input, 
                styles.toggledInput, 
                validationErrors.height && styles.inputError
              ]}
              value={data.height !== null ? data.height.toString() : ''}
              onChangeText={(text) => {
                const height = text === '' ? null : parseFloat(text);
                if (text === '' || !isNaN(height)) {
                  updateField('height', height);
                }
              }}
              placeholder={`Height in ${data.heightUnit}`}
              placeholderTextColor="#666666"
              keyboardType="decimal-pad"
            />
            <View style={styles.unitsToggle}>
              {heightUnits.map((unit) => (
                <TouchableOpacity
                  key={unit.value}
                  style={[
                    styles.unitButton,
                    data.heightUnit === unit.value && styles.selectedUnit,
                  ]}
                  onPress={() => updateField('heightUnit', unit.value as any)}
                >
                  <ThemedText
                    style={[
                      styles.unitText,
                      data.heightUnit === unit.value && styles.selectedUnitText,
                    ]}
                  >
                    {unit.label}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          {validationErrors.height && (
            <ThemedText style={styles.errorText}>{validationErrors.height}</ThemedText>
          )}
        </View>

        {/* Weight input with units toggle */}
        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Weight</ThemedText>
          <View style={styles.inputWithToggle}>
            <TextInput
              style={[
                styles.input, 
                styles.toggledInput, 
                validationErrors.weight && styles.inputError
              ]}
              value={data.weight !== null ? data.weight.toString() : ''}
              onChangeText={(text) => {
                const weight = text === '' ? null : parseFloat(text);
                if (text === '' || !isNaN(weight)) {
                  updateField('weight', weight);
                }
              }}
              placeholder={`Weight in ${data.weightUnit}`}
              placeholderTextColor="#666666"
              keyboardType="decimal-pad"
            />
            <View style={styles.unitsToggle}>
              {weightUnits.map((unit) => (
                <TouchableOpacity
                  key={unit.value}
                  style={[
                    styles.unitButton,
                    data.weightUnit === unit.value && styles.selectedUnit,
                  ]}
                  onPress={() => updateField('weightUnit', unit.value as any)}
                >
                  <ThemedText
                    style={[
                      styles.unitText,
                      data.weightUnit === unit.value && styles.selectedUnitText,
                    ]}
                  >
                    {unit.label}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          {validationErrors.weight && (
            <ThemedText style={styles.errorText}>{validationErrors.weight}</ThemedText>
          )}
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  contentContainer: {
    paddingBottom: 40,
  },
  form: {
    paddingHorizontal: 24,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#FFFFFF',
  },
  input: {
    height: 56,
    backgroundColor: '#111111',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#333333',
  },
  inputError: {
    borderColor: '#FF375F',
  },
  errorText: {
    color: '#FF375F',
    fontSize: 14,
    marginTop: 4,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  optionButton: {
    flex: 1,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111111',
    borderRadius: 12,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#333333',
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
    color: '#FF8C42',
    fontWeight: '600',
  },
  inputWithToggle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggledInput: {
    flex: 1,
    marginRight: 12,
  },
  unitsToggle: {
    flexDirection: 'row',
    height: 56,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#333333',
  },
  unitButton: {
    width: 60,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111111',
  },
  selectedUnit: {
    backgroundColor: '#FF8C42',
  },
  unitText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  selectedUnitText: {
    fontWeight: '600',
    color: '#FFFFFF',
  },
  buttonContainer: {
    paddingHorizontal: 24,
    marginTop: 32,
  },
}); 