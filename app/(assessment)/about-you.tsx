import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { AssessmentTemplate } from '@/components/assessment/AssessmentTemplate';
import { ThemedText } from '@/components/ThemedText';
import { assessmentColors, spacing } from '@/components/ui/AssessmentStyles';
import { useAssessment } from '@/context/AssessmentContext';
import { Ionicons } from '@expo/vector-icons';

export default function AboutYouScreen() {
  const router = useRouter();
  const { data, updateField } = useAssessment();
  
  const [name, setName] = useState(data.display_name || '');
  const [age, setAge] = useState(data.age ? data.age.toString() : '');
  const [gender, setGender] = useState(data.gender || '');
  const [height, setHeight] = useState(data.height ? data.height.toString() : '');
  const [weight, setWeight] = useState(data.weight ? data.weight.toString() : '');
  
  const genderOptions = [
    { id: 'male', label: 'Male' },
    { id: 'female', label: 'Female' },
    { id: 'other', label: 'Other' }
  ];
  
  const handleContinue = () => {
    // Update assessment data
    updateField('display_name', name);
    updateField('age', age ? parseInt(age) : null);
    updateField('gender', gender as any);
    updateField('height', height ? parseFloat(height) : null);
    updateField('weight', weight ? parseFloat(weight) : null);
    
    // Navigate to next screen
    router.push('/(assessment)/fitness-goals');
  };
  
  return (
    <AssessmentTemplate
      title="About You"
      subtitle="Let's get to know you better!"
      onContinue={handleContinue}
      continueButtonDisabled={!name || !age || !gender || !height || !weight}
      titleStyle={{
        fontSize: 24,
        fontWeight: 'bold',
        color: assessmentColors.text,
        marginBottom: spacing.sm,
      }}
    >
      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Name</ThemedText>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Your name"
            placeholderTextColor={assessmentColors.textSecondary}
            autoCapitalize="words"
          />
        </View>
        
        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Age</ThemedText>
          <TextInput
            style={styles.input}
            value={age}
            onChangeText={setAge}
            placeholder="Your age"
            placeholderTextColor={assessmentColors.textSecondary}
            keyboardType="number-pad"
          />
        </View>
        
        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Gender</ThemedText>
          <View style={styles.optionsContainer}>
            {genderOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.optionButton,
                  gender === option.id && styles.selectedOption
                ]}
                onPress={() => setGender(option.id)}
              >
                <ThemedText style={[
                  styles.optionText,
                  gender === option.id && styles.selectedOptionText
                ]}>
                  {option.label}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Height (cm)</ThemedText>
          <TextInput
            style={styles.input}
            value={height}
            onChangeText={setHeight}
            placeholder="Your height in cm"
            placeholderTextColor={assessmentColors.textSecondary}
            keyboardType="decimal-pad"
          />
        </View>
        
        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Weight (kg)</ThemedText>
          <TextInput
            style={styles.input}
            value={weight}
            onChangeText={setWeight}
            placeholder="Your weight in kg"
            placeholderTextColor={assessmentColors.textSecondary}
            keyboardType="decimal-pad"
          />
        </View>
      </View>
    </AssessmentTemplate>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    marginTop: spacing.lg,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: assessmentColors.text,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: assessmentColors.cardBackground,
    borderRadius: 8,
    padding: spacing.md,
    color: assessmentColors.text,
    fontSize: 16,
    borderWidth: 1,
    borderColor: assessmentColors.border,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  optionButton: {
    flex: 1,
    backgroundColor: assessmentColors.cardBackground,
    borderRadius: 8,
    padding: spacing.md,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: assessmentColors.border,
  },
  selectedOption: {
    borderColor: assessmentColors.primary,
    backgroundColor: assessmentColors.selectedItemBackground,
  },
  optionText: {
    color: assessmentColors.text,
    fontSize: 16,
  },
  selectedOptionText: {
    color: assessmentColors.primary,
    fontWeight: '600',
  },
});
