import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useOnboarding } from '@/context/OnboardingContext';
import { OnboardingHeader } from '@/components/onboarding/OnboardingHeader';
import { OnboardingButton } from '@/components/onboarding/OnboardingButton';
import { ThemedText } from '@/components/ThemedText';
import { TextInput } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import DraggableFlatList, { 
  RenderItemParams, 
  ScaleDecorator 
} from 'react-native-draggable-flatlist';

export default function FitnessGoalsScreen() {
  const { data, updateField, nextStep } = useOnboarding();
  const [validationError, setValidationError] = useState<string | null>(null);
  
  // Handle goal selection
  const toggleGoalSelection = (goalId: string) => {
    const updatedGoals = data.fitnessGoals.map(goal => {
      if (goal.id === goalId) {
        return {
          ...goal,
          selected: !goal.selected
        };
      }
      return goal;
    });
    
    updateField('fitnessGoals', updatedGoals);
  };
  
  // Handle goals reordering
  const handleReorder = (newGoals: any[]) => {
    // Update the order property based on new positions
    const updatedGoals = newGoals.map((goal, index) => ({
      ...goal,
      order: index
    }));
    
    updateField('fitnessGoals', updatedGoals);
  };
  
  // Render each goal item
  const renderGoalItem = ({ item, drag, isActive }: RenderItemParams<any>) => {
    return (
      <ScaleDecorator>
        <TouchableOpacity
          activeOpacity={1}
          onLongPress={item.selected ? drag : undefined}
          disabled={isActive || !item.selected}
          style={[
            styles.goalItem,
            item.selected && styles.selectedGoalItem,
            isActive && styles.activeGoalItem
          ]}
          onPress={() => toggleGoalSelection(item.id)}
        >
          <View style={styles.goalItemContent}>
            <View style={styles.goalSelectArea}>
              <View style={[
                styles.checkbox,
                item.selected && styles.checkboxSelected
              ]}>
                {item.selected && (
                  <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                )}
              </View>
              
              <View style={styles.goalText}>
                <ThemedText style={styles.goalTitle}>{item.title}</ThemedText>
                <ThemedText style={styles.goalDescription}>
                  {item.description}
                </ThemedText>
              </View>
            </View>
            
            {item.selected && (
              <View style={styles.dragHandle}>
                <Ionicons name="menu" size={22} color="#666666" />
              </View>
            )}
          </View>
        </TouchableOpacity>
      </ScaleDecorator>
    );
  };
  
  // Get only selected goals for filtering input visibility
  const selectedGoals = data.fitnessGoals.filter(goal => goal.selected);
  const showSportInput = selectedGoals.some(goal => goal.id === 'sport');
  
  const handleContinue = () => {
    // Validate that at least one goal is selected
    if (selectedGoals.length === 0) {
      setValidationError('Please select at least one fitness goal');
      return;
    }
    
    // Validate sport input if sport goal is selected
    if (showSportInput && !data.sportActivity.trim()) {
      setValidationError('Please specify your sport or activity');
      return;
    }
    
    // Clear any validation errors
    setValidationError(null);
    
    // Move to next step
    nextStep();
  };
  
  return (
    <View style={styles.container}>
      <OnboardingHeader
        title="Fitness Goals"
        subtitle="Select and prioritize your fitness goals. You can reorder them by importance."
      />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.goalsContainer}>
          <ThemedText style={styles.sectionTitle}>
            What are your fitness goals?
          </ThemedText>
          <ThemedText style={styles.sectionSubtitle}>
            Select all that apply. Drag to reorder selected goals by priority.
          </ThemedText>
          
          <DraggableFlatList
            data={data.fitnessGoals}
            onDragEnd={({ data }) => handleReorder(data)}
            keyExtractor={(item) => item.id}
            renderItem={renderGoalItem}
            containerStyle={styles.goalsList}
            scrollEnabled={false}
          />
          
          {validationError && (
            <ThemedText style={styles.errorText}>{validationError}</ThemedText>
          )}
        </View>
        
        {showSportInput && (
          <View style={styles.additionalInfoContainer}>
            <ThemedText style={styles.sectionTitle}>
              Tell us about your sport or activity
            </ThemedText>
            <TextInput
              style={styles.textArea}
              value={data.sportActivity}
              onChangeText={(text) => updateField('sportActivity', text)}
              placeholder="What sport or activity are you training for?"
              placeholderTextColor="#666666"
              multiline
              numberOfLines={3}
            />
          </View>
        )}
        
        <View style={styles.additionalInfoContainer}>
          <ThemedText style={styles.sectionTitle}>
            Additional Notes for Your Coach (Optional)
          </ThemedText>
          <TextInput
            style={styles.textArea}
            value={data.coachNotes}
            onChangeText={(text) => updateField('coachNotes', text)}
            placeholder="Share any specific goals or details about your fitness journey"
            placeholderTextColor="#666666"
            multiline
            numberOfLines={4}
          />
        </View>
        
        <View style={styles.buttonContainer}>
          <OnboardingButton
            title="Continue"
            onPress={handleContinue}
            icon="arrow-forward"
          />
        </View>
      </ScrollView>
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
  },
  scrollViewContent: {
    paddingBottom: 40,
  },
  goalsContainer: {
    padding: 24,
  },
  additionalInfoContainer: {
    padding: 24,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#AAAAAA',
    marginBottom: 24,
  },
  goalsList: {
    marginBottom: 16,
  },
  goalItem: {
    backgroundColor: '#111111',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333333',
    overflow: 'hidden',
  },
  selectedGoalItem: {
    borderColor: '#FF8C42',
    backgroundColor: 'rgba(255, 140, 66, 0.1)',
  },
  activeGoalItem: {
    opacity: 0.8,
    shadowColor: '#FF8C42',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  goalItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  goalSelectArea: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#666666',
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#FF8C42',
    borderColor: '#FF8C42',
  },
  goalText: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  goalDescription: {
    fontSize: 14,
    color: '#AAAAAA',
  },
  dragHandle: {
    padding: 8,
  },
  textArea: {
    backgroundColor: '#111111',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333333',
    padding: 16,
    fontSize: 16,
    color: '#FFFFFF',
    textAlignVertical: 'top',
    minHeight: 100,
  },
  buttonContainer: {
    padding: 24,
    paddingTop: 32,
  },
  errorText: {
    color: '#FF375F',
    fontSize: 14,
    marginTop: 8,
  },
}); 