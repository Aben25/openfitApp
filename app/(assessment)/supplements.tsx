import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { useAssessment } from '@/context/AssessmentContext';

export default function SupplementsScreen() {
  const { data, updateField, nextStep, prevStep } = useAssessment();
  const [takingSupplements, setTakingSupplements] = useState<boolean | null>(
    data.taking_supplements !== undefined ? data.taking_supplements : null
  );

  const handleOptionSelect = (value: boolean) => {
    setTakingSupplements(value);
  };

  useEffect(() => {
    if (takingSupplements !== null) {
      // Auto-advance to next screen after selection with slight delay
      const timer = setTimeout(() => {
        updateField('taking_supplements', takingSupplements);
        nextStep();
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [takingSupplements]);

  const handleBack = () => {
    prevStep();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleBack} activeOpacity={0.7}>
        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      <View style={styles.progressIndicator}>
        <ThemedText style={styles.progressText}>4 of 17</ThemedText>
      </View>
      
      <View style={styles.contentContainer}>
        <Image 
          source={require('@/assets/images/supplements.png')} 
          style={styles.supplementsImage}
          resizeMode="contain"
        />
        
        <ThemedText style={styles.screenTitle}>
          Are you currently taking any supplements?
        </ThemedText>
        
        <View style={styles.optionsContainer}>
          <TouchableOpacity 
            style={[
              styles.optionButton,
              takingSupplements === true && styles.selectedOption
            ]}
            onPress={() => handleOptionSelect(true)}
            activeOpacity={0.8}
          >
            <ThemedText style={styles.optionText}>Yes</ThemedText>
            {takingSupplements === true && (
              <View style={styles.checkmark}>
                <Ionicons name="checkmark" size={20} color="#FFFFFF" />
              </View>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.optionButton,
              takingSupplements === false && styles.selectedOption
            ]}
            onPress={() => handleOptionSelect(false)}
            activeOpacity={0.8}
          >
            <ThemedText style={styles.optionText}>No</ThemedText>
            {takingSupplements === false && (
              <View style={styles.checkmark}>
                <Ionicons name="checkmark" size={20} color="#FFFFFF" />
              </View>
            )}
          </TouchableOpacity>
        </View>
        
        <ThemedText style={styles.helperText}>
          This helps us tailor your nutrition recommendations.
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
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
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  supplementsImage: {
    width: 160,
    height: 160,
    marginBottom: 24,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 40,
    textAlign: 'center',
  },
  optionsContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  optionButton: {
    width: '48%',
    paddingVertical: 18,
    borderRadius: 12,
    backgroundColor: '#1C1C1E',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1C1C1E',
    flexDirection: 'row',
  },
  selectedOption: {
    borderColor: '#FF8C42',
    backgroundColor: 'rgba(255, 140, 66, 0.1)',
  },
  optionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  checkmark: {
    marginLeft: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF8C42',
    justifyContent: 'center',
    alignItems: 'center',
  },
  helperText: {
    fontSize: 14,
    color: '#BBBBBB',
    textAlign: 'center',
    maxWidth: '80%',
  },
}); 