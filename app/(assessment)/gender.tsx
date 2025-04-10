import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { useAssessment } from '@/context/AssessmentContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AssessmentHeader } from '@/components/assessment/AssessmentHeader';

export default function GenderScreen() {
  const { data, updateField, nextStep, prevStep } = useAssessment();
  const [selectedGender, setSelectedGender] = useState<'male' | 'female' | 'other' | null>(data.gender);

  const handleSelectGender = (gender: 'male' | 'female' | 'other') => {
    setSelectedGender(gender);
    updateField('gender', gender);
  };

  const handleContinue = () => {
    if (selectedGender) {
      nextStep();
    }
  };

  const handleSkip = () => {
    updateField('gender', null);
    nextStep();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <AssessmentHeader title="What is your gender?" />
        
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={[
                styles.genderOption,
                selectedGender === 'male' && styles.selectedOption
              ]}
              onPress={() => handleSelectGender('male')}
              activeOpacity={0.8}
            >
              <View style={styles.genderInfo}>
                <Ionicons name="male" size={24} color="#FFFFFF" style={styles.genderIcon} />
                <ThemedText style={styles.genderText}>Male</ThemedText>
              </View>
              
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=500' }}
                style={styles.genderImage}
                resizeMode="cover"
              />
              
              <View style={styles.radioContainer}>
                <View style={[
                  styles.radioOuter,
                  selectedGender === 'male' && styles.radioOuterSelected
                ]}>
                  {selectedGender === 'male' && (
                    <View style={styles.radioInner} />
                  )}
                </View>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.genderOption,
                selectedGender === 'female' && styles.selectedOption
              ]}
              onPress={() => handleSelectGender('female')}
              activeOpacity={0.8}
            >
              <View style={styles.genderInfo}>
                <Ionicons name="female" size={24} color="#FFFFFF" style={styles.genderIcon} />
                <ThemedText style={styles.genderText}>Female</ThemedText>
              </View>
              
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1550345332-09e3ac987658?q=80&w=500' }}
                style={styles.genderImage}
                resizeMode="cover"
              />
              
              <View style={styles.radioContainer}>
                <View style={[
                  styles.radioOuter,
                  selectedGender === 'female' && styles.radioOuterSelected
                ]}>
                  {selectedGender === 'female' && (
                    <View style={styles.radioInner} />
                  )}
                </View>
              </View>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <ThemedText style={styles.skipText}>Prefer to skip, thanks!</ThemedText>
            <Ionicons name="close" size={18} color="#FFFFFF" style={styles.skipIcon} />
          </TouchableOpacity>
        </ScrollView>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.continueButton,
              !selectedGender && styles.continueButtonDisabled
            ]}
            onPress={handleContinue}
            disabled={!selectedGender}
            activeOpacity={0.8}
          >
            <ThemedText style={styles.continueButtonText}>Continue</ThemedText>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000000',
  },
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  optionsContainer: {
    marginBottom: 24,
  },
  genderOption: {
    position: 'relative',
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1C1C1E',
    overflow: 'hidden',
  },
  selectedOption: {
    borderColor: '#FF8C42',
    backgroundColor: 'rgba(255, 140, 66, 0.1)',
  },
  genderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    zIndex: 2,
  },
  genderIcon: {
    marginRight: 8,
  },
  genderText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  genderImage: {
    width: '100%',
    height: 180,
    zIndex: 1,
    opacity: 0.8,
  },
  radioContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 3,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4A4A4A',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  radioOuterSelected: {
    borderColor: '#FF8C42',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF8C42',
  },
  skipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 59, 48, 0.2)',
  },
  skipText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    marginRight: 8,
  },
  skipIcon: {
    opacity: 0.8,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  continueButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF6B35',
    paddingVertical: 16,
    borderRadius: 10,
  },
  continueButtonDisabled: {
    opacity: 0.5,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
}); 