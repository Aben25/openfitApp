import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { AssessmentTemplate } from '@/components/assessment/AssessmentTemplate';
import { ThemedText } from '@/components/ThemedText';
import { assessmentColors, spacing } from '@/components/ui/AssessmentStyles';
import { useAssessment } from '@/context/AssessmentContext';
import { Ionicons } from '@expo/vector-icons';

export default function StrengthLevelScreen() {
  const router = useRouter();
  const { data, updateField } = useAssessment();

  const [strengthLevel, setStrengthLevel] = useState<number>(data.weightlifting_fitness_level || 0);

  const strengthLevels = [
    {
      id: 1,
      title: 'Beginner',
      description: 'I am a beginner and have not regularly been to the gym',
      icon: 'barbell-outline'
    },
    {
      id: 2,
      title: 'Novice',
      description: 'I\'ve done some strength training but am not consistent with form or technique',
      icon: 'barbell-outline'
    },
    {
      id: 3,
      title: 'Intermediate',
      description: 'I train regularly with proper form and understand basic lifting principles',
      icon: 'barbell-outline'
    },
    {
      id: 4,
      title: 'Advanced',
      description: 'I have several years of consistent training and understand programming principles',
      icon: 'barbell-outline'
    },
    {
      id: 5,
      title: 'Elite',
      description: 'I have extensive training experience and can perform complex lifts with excellent form',
      icon: 'trophy-outline'
    }
  ];

  const handleContinue = () => {
    // Update assessment data
    updateField('weightlifting_fitness_level', strengthLevel);
    updateField('weightliftinglevel', strengthLevels.find(level => level.id === strengthLevel)?.title.toLowerCase() || null);

    // Navigate to next screen
    router.push('/(assessment)/workout-environment');
  };

  return (
    <AssessmentTemplate
      title="Weightlifting Experience"
      subtitle="This helps us design appropriate strength training for you"
      onContinue={handleContinue}
      continueButtonDisabled={strengthLevel === 0}
    >
      <View style={styles.levelsContainer}>
        {strengthLevels.map((level) => (
          <TouchableOpacity
            key={level.id}
            style={[
              styles.levelCard,
              strengthLevel === level.id && styles.selectedLevelCard
            ]}
            onPress={() => setStrengthLevel(level.id)}
          >
            <View style={styles.levelHeader}>
              <View style={[
                styles.levelIconContainer,
                strengthLevel === level.id && styles.selectedLevelIconContainer
              ]}>
                <Ionicons
                  name={level.icon as any}
                  size={24}
                  color={strengthLevel === level.id ? assessmentColors.text : assessmentColors.textSecondary}
                />
              </View>

              <View style={styles.radioContainer}>
                {strengthLevel === level.id ? (
                  <View style={styles.radioSelected}>
                    <View style={styles.radioInner} />
                  </View>
                ) : (
                  <View style={styles.radioUnselected} />
                )}
              </View>
            </View>

            <ThemedText style={[
              styles.levelTitle,
              strengthLevel === level.id && styles.selectedLevelText
            ]}>
              {level.title}
            </ThemedText>

            <ThemedText style={styles.levelDescription}>
              {level.description}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.currentLevelContainer}>
        <ThemedText style={styles.currentLevelLabel}>
          Current Fitness Levels
        </ThemedText>

        <View style={styles.levelIndicator}>
          <ThemedText style={styles.levelLabel}>Strength</ThemedText>
          <View style={styles.levelBarContainer}>
            <View style={[styles.levelBar, { width: `${(strengthLevel / 5) * 100}%` }]} />
          </View>
          <ThemedText style={styles.levelValue}>{strengthLevel}/5</ThemedText>
        </View>
      </View>
    </AssessmentTemplate>
  );
}

const styles = StyleSheet.create({
  levelsContainer: {
    marginTop: spacing.md,
  },
  levelCard: {
    backgroundColor: assessmentColors.cardBackground,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: assessmentColors.border,
  },
  selectedLevelCard: {
    borderColor: assessmentColors.primary,
    backgroundColor: assessmentColors.selectedItemBackground,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  levelIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedLevelIconContainer: {
    backgroundColor: assessmentColors.primary,
  },
  radioContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioUnselected: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: assessmentColors.border,
  },
  radioSelected: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: assessmentColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: assessmentColors.primary,
  },
  levelTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: assessmentColors.text,
    marginBottom: spacing.sm,
  },
  selectedLevelText: {
    color: assessmentColors.primary,
  },
  levelDescription: {
    fontSize: 14,
    color: assessmentColors.textSecondary,
    marginBottom: spacing.sm,
    lineHeight: 20,
  },
  currentLevelContainer: {
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
  },
  currentLevelLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: assessmentColors.text,
    marginBottom: spacing.md,
  },
  levelIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  levelLabel: {
    width: 60,
    fontSize: 14,
    color: assessmentColors.text,
  },
  levelBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: assessmentColors.cardBackground,
    borderRadius: 4,
    marginHorizontal: spacing.md,
    overflow: 'hidden',
  },
  levelBar: {
    height: '100%',
    backgroundColor: assessmentColors.primary,
    borderRadius: 4,
  },
  levelValue: {
    width: 40,
    fontSize: 14,
    color: assessmentColors.text,
    textAlign: 'right',
  },
});
