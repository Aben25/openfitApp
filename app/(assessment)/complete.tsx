import React, { useEffect } from 'react';
import { StyleSheet, View, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { AssessmentButton } from '@/components/assessment/AssessmentButton';
import { useAssessment } from '@/context/AssessmentContext';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CompleteScreen() {
  const { saveAssessmentData, isLoading, error } = useAssessment();
  const router = useRouter();

  const handleFinish = async () => {
    await saveAssessmentData();
    // Navigation is handled in the saveAssessmentData method
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=600' }}
          style={styles.image}
          resizeMode="cover"
        />
        
        <ThemedText style={styles.title}>Assessment Complete!</ThemedText>
        
        <ThemedText style={styles.description}>
          Based on your answers, we'll create a personalized workout plan
          tailored to your goals, preferences, and fitness level.
        </ThemedText>
        
        {error && (
          <ThemedText style={styles.errorText}>{error}</ThemedText>
        )}
        
        <View style={styles.buttonContainer}>
          <AssessmentButton
            title="Let's Get Started"
            onPress={handleFinish}
            isLoading={isLoading}
            icon="fitness-outline"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#AAAAAA',
    marginBottom: 40,
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonContainer: {
    width: '100%',
  },
  errorText: {
    color: '#FF375F',
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
  },
}); 