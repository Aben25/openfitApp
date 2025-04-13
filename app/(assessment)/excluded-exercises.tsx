import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { AssessmentTemplate } from '@/components/assessment/AssessmentTemplate';
import { ThemedText } from '@/components/ThemedText';
import { assessmentColors, spacing } from '@/components/ui/AssessmentStyles';
import { useAssessment } from '@/context/AssessmentContext';
import { Ionicons } from '@expo/vector-icons';

export default function ExcludedExercisesScreen() {
  const router = useRouter();
  const { data, updateField } = useAssessment();
  
  const [excludedExercises, setExcludedExercises] = useState<string[]>(
    data.excluded_exercises || []
  );
  const [currentExercise, setCurrentExercise] = useState('');
  
  const commonExercises = [
    'Burpees',
    'Pull-ups',
    'Push-ups',
    'Squats',
    'Deadlifts',
    'Lunges',
    'Planks',
    'Running',
    'Jumping Jacks',
    'Mountain Climbers'
  ];
  
  const addExercise = () => {
    if (currentExercise.trim() && !excludedExercises.includes(currentExercise.trim())) {
      setExcludedExercises([...excludedExercises, currentExercise.trim()]);
      setCurrentExercise('');
    }
  };
  
  const removeExercise = (exercise: string) => {
    setExcludedExercises(excludedExercises.filter(ex => ex !== exercise));
  };
  
  const addCommonExercise = (exercise: string) => {
    if (!excludedExercises.includes(exercise)) {
      setExcludedExercises([...excludedExercises, exercise]);
    }
  };
  
  const handleContinue = () => {
    // Update assessment data
    updateField('excluded_exercises', excludedExercises);
    
    // Navigate to next screen
    router.push('/(assessment)/complete');
  };
  
  return (
    <AssessmentTemplate
      title="Is there any particular exercises you would like to avoid?"
      subtitle="Let us know if there are specific exercises you can't or don't want to do"
      onContinue={handleContinue}
      showSkipButton={true}
      onSkip={() => router.push('/(assessment)/complete')}
    >
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={currentExercise}
            onChangeText={setCurrentExercise}
            placeholder="Enter exercise name"
            placeholderTextColor={assessmentColors.textSecondary}
            returnKeyType="done"
            onSubmitEditing={addExercise}
          />
          <TouchableOpacity 
            style={styles.addButton}
            onPress={addExercise}
            disabled={!currentExercise.trim()}
          >
            <Ionicons 
              name="add" 
              size={24} 
              color={currentExercise.trim() ? assessmentColors.text : assessmentColors.textSecondary} 
            />
          </TouchableOpacity>
        </View>
        
        <ThemedText style={styles.sectionTitle}>Common exercises people avoid:</ThemedText>
        
        <View style={styles.commonExercisesContainer}>
          {commonExercises.map((exercise) => (
            <TouchableOpacity
              key={exercise}
              style={[
                styles.exerciseTag,
                excludedExercises.includes(exercise) && styles.selectedExerciseTag
              ]}
              onPress={() => 
                excludedExercises.includes(exercise) 
                  ? removeExercise(exercise) 
                  : addCommonExercise(exercise)
              }
            >
              <ThemedText style={[
                styles.exerciseTagText,
                excludedExercises.includes(exercise) && styles.selectedExerciseTagText
              ]}>
                {exercise}
              </ThemedText>
              {excludedExercises.includes(exercise) && (
                <Ionicons name="checkmark" size={16} color={assessmentColors.primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>
        
        {excludedExercises.length > 0 && (
          <View style={styles.selectedExercisesContainer}>
            <ThemedText style={styles.sectionTitle}>Your excluded exercises:</ThemedText>
            
            <View style={styles.selectedExercisesList}>
              {excludedExercises.map((exercise) => (
                <View key={exercise} style={styles.selectedExerciseItem}>
                  <ThemedText style={styles.selectedExerciseText}>
                    {exercise}
                  </ThemedText>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeExercise(exercise)}
                  >
                    <Ionicons name="close-circle" size={20} color={assessmentColors.error} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    </AssessmentTemplate>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.md,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },
  input: {
    flex: 1,
    backgroundColor: assessmentColors.cardBackground,
    borderRadius: 8,
    padding: spacing.md,
    color: assessmentColors.text,
    fontSize: 16,
    borderWidth: 1,
    borderColor: assessmentColors.border,
  },
  addButton: {
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: assessmentColors.cardBackground,
    borderRadius: 8,
    marginLeft: spacing.sm,
    borderWidth: 1,
    borderColor: assessmentColors.border,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: assessmentColors.text,
    marginBottom: spacing.md,
  },
  commonExercisesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.xl,
  },
  exerciseTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: assessmentColors.cardBackground,
    borderRadius: 16,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    margin: spacing.xs,
    borderWidth: 1,
    borderColor: assessmentColors.border,
  },
  selectedExerciseTag: {
    borderColor: assessmentColors.primary,
    backgroundColor: assessmentColors.selectedItemBackground,
  },
  exerciseTagText: {
    fontSize: 14,
    color: assessmentColors.text,
    marginRight: spacing.xs,
  },
  selectedExerciseTagText: {
    color: assessmentColors.primary,
  },
  selectedExercisesContainer: {
    marginTop: spacing.lg,
  },
  selectedExercisesList: {
    marginTop: spacing.sm,
  },
  selectedExerciseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: assessmentColors.cardBackground,
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: assessmentColors.border,
  },
  selectedExerciseText: {
    fontSize: 16,
    color: assessmentColors.text,
  },
  removeButton: {
    padding: spacing.xs,
  },
});
