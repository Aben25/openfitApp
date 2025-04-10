import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, Text } from 'react-native';
import Slider from '@react-native-community/slider';
import { ThemedText } from '@/components/ThemedText';
import { AssessmentHeader } from '@/components/assessment/AssessmentHeader';
import { AssessmentButton, SkipButton } from '@/components/assessment/AssessmentButton';
import { useAssessment } from '@/context/AssessmentContext';

export default function WeightScreen() {
  const { data, updateField, nextStep } = useAssessment();
  const [weight, setWeight] = useState<number>(data.weight || 70);
  const [unit, setUnit] = useState<'kg' | 'lbs'>(data.weightUnit || 'kg');

  // When unit changes, convert the weight
  useEffect(() => {
    if (unit === 'kg' && data.weightUnit === 'lbs' && data.weight) {
      // Convert lbs to kg
      setWeight(Math.round(data.weight * 0.453592));
    } else if (unit === 'lbs' && data.weightUnit === 'kg' && data.weight) {
      // Convert kg to lbs
      setWeight(Math.round(data.weight * 2.20462));
    }
    // Update the unit in context
    updateField('weightUnit', unit);
  }, [unit]);

  const handleSliderChange = (value: number) => {
    const roundedValue = Math.round(value);
    setWeight(roundedValue);
    updateField('weight', roundedValue);
  };

  const handleUnitToggle = (selectedUnit: 'kg' | 'lbs') => {
    setUnit(selectedUnit);
  };

  const handleContinue = () => {
    nextStep();
  };

  const handleSkip = () => {
    updateField('weight', null);
    nextStep();
  };

  // Define min and max values based on unit
  const minWeight = unit === 'kg' ? 40 : 88;
  const maxWeight = unit === 'kg' ? 180 : 396;

  return (
    <View style={styles.container}>
      <AssessmentHeader title="What is your weight?" />
      
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.unitSelector}>
          <TouchableOpacity
            style={[
              styles.unitButton,
              unit === 'kg' && styles.activeUnitButton
            ]}
            onPress={() => handleUnitToggle('kg')}
          >
            <Text style={[
              styles.unitText,
              unit === 'kg' && styles.activeUnitText
            ]}>kg</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.unitButton,
              unit === 'lbs' && styles.activeUnitButton
            ]}
            onPress={() => handleUnitToggle('lbs')}
          >
            <Text style={[
              styles.unitText,
              unit === 'lbs' && styles.activeUnitText
            ]}>lbs</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.weightValueContainer}>
          <Text style={styles.weightValue}>
            {weight}
            <Text style={styles.weightUnit}>{unit}</Text>
          </Text>
        </View>
        
        <View style={styles.sliderContainer}>
          <Slider
            style={styles.slider}
            minimumValue={minWeight}
            maximumValue={maxWeight}
            value={weight}
            onValueChange={handleSliderChange}
            minimumTrackTintColor="#3478F6"
            maximumTrackTintColor="#333333"
            thumbTintColor="#FFFFFF"
          />
          
          <View style={styles.sliderValuesContainer}>
            <View style={styles.sliderValueArea}>
              <View style={styles.sliderValueTick} />
              <Text style={styles.sliderValue}>{Math.max(weight - 1, minWeight)}</Text>
            </View>
            
            <View style={styles.sliderValueEmpty} />
            
            <View style={styles.sliderValueArea}>
              <View style={styles.sliderValueTick} />
              <Text style={styles.sliderValue}>{Math.min(weight + 1, maxWeight)}</Text>
            </View>
          </View>
        </View>
        
        <SkipButton onPress={handleSkip} />
        
        <View style={styles.buttonContainer}>
          <AssessmentButton
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
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  unitSelector: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginVertical: 20,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#1C1C1E',
    height: 48,
  },
  unitButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  activeUnitButton: {
    backgroundColor: '#3478F6',
  },
  unitText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#AAAAAA',
  },
  activeUnitText: {
    color: '#FFFFFF',
  },
  weightValueContainer: {
    alignItems: 'center',
    marginVertical: 40,
  },
  weightValue: {
    fontSize: 96,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  weightUnit: {
    fontSize: 70,
    fontWeight: 'bold',
    color: '#3478F6',
    marginLeft: 10,
  },
  sliderContainer: {
    marginHorizontal: 20,
    marginBottom: 40,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderValuesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  sliderValueArea: {
    alignItems: 'center',
    width: 50,
  },
  sliderValueTick: {
    width: 1,
    height: 15,
    backgroundColor: '#AAAAAA',
    marginBottom: 5,
  },
  sliderValue: {
    color: '#AAAAAA',
    fontSize: 14,
  },
  sliderValueEmpty: {
    flex: 1,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
}); 