import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { AssessmentTemplate } from '@/components/assessment/AssessmentTemplate';
import { ThemedText } from '@/components/ThemedText';
import { assessmentColors, spacing } from '@/components/ui/AssessmentStyles';
import { useAssessment } from '@/context/AssessmentContext';
import { Ionicons } from '@expo/vector-icons';

export default function CardioLevelScreen() {
  const router = useRouter();
  const { data, updateField } = useAssessment();

  const [cardioLevel, setCardioLevel] = useState<number>(data.cardio_fitness_level || 0);

  const cardioLevels = [
    {
      id: 1,
      title: 'Beginner',
      description: 'I cannot walk more than half a mile and need frequent breaks → I regularly run long distance (5miles/10km or more)',
      icon: 'walk-outline'
    },
    {
      id: 2,
      title: 'Novice',
      description: 'I can walk 1-2 miles without stopping, but get winded easily with more intense activity',
      icon: 'walk-outline'
    },
    {
      id: 3,
      title: 'Intermediate',
      description: 'I can jog 1-3 miles or cycle for 30+ minutes without significant fatigue',
      icon: 'bicycle-outline'
    },
    {
      id: 4,
      title: 'Advanced',
      description: 'I can run 3-5 miles or complete 45+ minutes of moderate-intensity cardio',
      icon: 'fitness-outline'
    },
    {
      id: 5,
      title: 'Elite',
      description: 'I can run 5+ miles or complete 60+ minutes of high-intensity cardio with ease',
      icon: 'trophy-outline'
    }
  ];

  const handleContinue = () => {
    // Update assessment data
    updateField('cardio_fitness_level', cardioLevel);
    updateField('cardiolevel', cardioLevels.find(level => level.id === cardioLevel)?.title.toLowerCase() || null);

    // Navigate to next screen
    router.push('/(assessment)/strength-level');
  };

  return (
    <AssessmentTemplate
      title="What is your Cardio/Endurance level?"
      subtitle="This helps us tailor your cardio workouts appropriately"
      onContinue={handleContinue}
      continueButtonDisabled={cardioLevel === 0}
    >
      <View style={styles.levelsContainer}>
        {cardioLevels.map((level) => (
          <TouchableOpacity
            key={level.id}
            style={[
              styles.levelCard,
              cardioLevel === level.id && styles.selectedLevelCard
            ]}
            onPress={() => setCardioLevel(level.id)}
          >
            <View style={styles.levelHeader}>
              <View style={[
                styles.levelIconContainer,
                cardioLevel === level.id && styles.selectedLevelIconContainer
              ]}>
                <Ionicons
                  name={level.icon as any}
                  size={24}
                  color={cardioLevel === level.id ? assessmentColors.text : assessmentColors.textSecondary}
                />
              </View>

              <View style={styles.radioContainer}>
                {cardioLevel === level.id ? (
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
              cardioLevel === level.id && styles.selectedLevelText
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
          <ThemedText style={styles.levelLabel}>Cardio</ThemedText>
          <View style={styles.levelBarContainer}>
            <View style={[styles.levelBar, { width: `${(cardioLevel / 5) * 100}%` }]} />
          </View>
          <ThemedText style={styles.levelValue}>{cardioLevel}/5</ThemedText>
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
