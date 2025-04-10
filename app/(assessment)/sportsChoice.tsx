import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { useAssessment } from '@/context/AssessmentContext';

interface SportOption {
  id: string;
  title: string;
  icon: string;
}

export default function SportsChoiceScreen() {
  const { data, updateField, nextStep, prevStep } = useAssessment();
  const [selectedSport, setSelectedSport] = useState<string | null>(
    data.sport_of_choice || null
  );
  
  const sportOptions: SportOption[] = [
    {
      id: 'running',
      title: 'Running',
      icon: 'walk-outline',
    },
    {
      id: 'weightlifting',
      title: 'Weightlifting',
      icon: 'barbell-outline',
    },
    {
      id: 'swimming',
      title: 'Swimming',
      icon: 'water-outline',
    },
    {
      id: 'cycling',
      title: 'Cycling',
      icon: 'bicycle-outline',
    },
    {
      id: 'basketball',
      title: 'Basketball',
      icon: 'basketball-outline',
    },
    {
      id: 'soccer',
      title: 'Soccer',
      icon: 'football-outline',
    },
    {
      id: 'tennis',
      title: 'Tennis',
      icon: 'tennisball-outline',
    },
    {
      id: 'yoga',
      title: 'Yoga',
      icon: 'body-outline',
    },
    {
      id: 'crossfit',
      title: 'CrossFit',
      icon: 'stopwatch-outline',
    },
    {
      id: 'other',
      title: 'Other',
      icon: 'ellipsis-horizontal-outline',
    },
  ];

  const handleSportSelect = (sportId: string) => {
    setSelectedSport(sportId);
  };

  const handleContinue = () => {
    if (selectedSport) {
      updateField('sport_of_choice', selectedSport);
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
        <ThemedText style={styles.progressText}>6 of 17</ThemedText>
      </View>
      
      <View style={styles.headerContainer}>
        <ThemedText style={styles.screenTitle}>
          What's your sport or activity?
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Select the activity you enjoy doing the most
        </ThemedText>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sportGrid}>
          {sportOptions.map((sport) => (
            <TouchableOpacity 
              key={sport.id}
              style={[
                styles.sportOption,
                selectedSport === sport.id && styles.selectedSport
              ]}
              onPress={() => handleSportSelect(sport.id)}
              activeOpacity={0.8}
            >
              <View style={styles.sportIconContainer}>
                <Ionicons 
                  name={sport.icon as any} 
                  size={32} 
                  color={selectedSport === sport.id ? "#FF8C42" : "#FFFFFF"} 
                />
              </View>
              <ThemedText style={[
                styles.sportTitle,
                selectedSport === sport.id && styles.selectedSportTitle
              ]}>
                {sport.title}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      
      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={[
            styles.continueButton, 
            !selectedSport && styles.continueButtonDisabled
          ]}
          onPress={handleContinue}
          disabled={!selectedSport}
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
    marginBottom: 20,
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
    marginBottom: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sportGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  sportOption: {
    width: '30%',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1C1C1E',
  },
  selectedSport: {
    borderColor: '#FF8C42',
    backgroundColor: 'rgba(255, 140, 66, 0.1)',
  },
  sportIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  sportTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  selectedSportTitle: {
    color: '#FF8C42',
    fontWeight: '600',
  },
  bottomContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  continueButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF8C42',
    paddingVertical: 16,
    borderRadius: 12,
  },
  continueButtonDisabled: {
    backgroundColor: 'rgba(255, 140, 66, 0.5)',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
}); 