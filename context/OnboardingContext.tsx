import { createContext, useState, useContext, ReactNode } from 'react';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';
import { Database } from '@/types/database.types';

// Define the types for our fitness goals
export type FitnessGoal = {
  id: string;
  title: string;
  description: string;
  selected: boolean;
  order: number;
};

// Define the type for our onboarding data
export type OnboardingData = {
  // About You screen
  name: string;
  gender: 'male' | 'female' | 'other' | null;
  age: number | null;
  height: number | null;
  heightUnit: 'cm' | 'ft' | null;
  weight: number | null;
  weightUnit: 'kg' | 'lbs' | null;
  
  // Fitness Goals screen
  fitnessGoals: FitnessGoal[];
  sportActivity: string;
  coachNotes: string;
  
  // Fitness Levels screen
  cardioLevel: number | null;
  weightliftingLevel: number | null;
  fitnessNotes: string;
  avoidedExercises: string;
  
  // Workout Environment screen
  workoutEnvironments: string[];
  
  // Workout Schedule screen
  workoutsPerWeek: number | null;
  workoutDuration: number | null;
  
  // Final Notes screen
  additionalInfo: string;
};

// Define the context type
type OnboardingContextType = {
  data: OnboardingData;
  currentStep: number;
  totalSteps: number;
  updateField: <K extends keyof OnboardingData>(field: K, value: OnboardingData[K]) => void;
  nextStep: () => void;
  prevStep: () => void;
  saveOnboardingData: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
};

// Create the default values for our onboarding data
const defaultOnboardingData: OnboardingData = {
  name: '',
  gender: null,
  age: null,
  height: null,
  heightUnit: 'cm',
  weight: null,
  weightUnit: 'kg',
  fitnessGoals: [
    {
      id: 'health',
      title: 'Optimize my health and fitness',
      description: 'Focus on overall health improvement with balanced training',
      selected: false,
      order: 0
    },
    {
      id: 'sport',
      title: 'Training for a specific sport or activity',
      description: 'Specialized training for performance in your sport',
      selected: false,
      order: 1
    },
    {
      id: 'muscle',
      title: 'Build muscle mass and size',
      description: 'Focus on hypertrophy training and muscle growth',
      selected: false,
      order: 2
    },
    {
      id: 'weight',
      title: 'Weight loss and management',
      description: 'Programs designed for fat loss and body composition',
      selected: false,
      order: 3
    },
    {
      id: 'stamina',
      title: 'Increase stamina',
      description: 'Improve endurance and cardiovascular capacity',
      selected: false,
      order: 4
    },
    {
      id: 'strength',
      title: 'Increase strength',
      description: 'Focus on maximizing strength gains and power',
      selected: false,
      order: 5
    }
  ],
  sportActivity: '',
  coachNotes: '',
  cardioLevel: null,
  weightliftingLevel: null,
  fitnessNotes: '',
  avoidedExercises: '',
  workoutEnvironments: [],
  workoutsPerWeek: null,
  workoutDuration: null,
  additionalInfo: ''
};

// Create the context
const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

// Create the provider component
export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<OnboardingData>(defaultOnboardingData);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useAuth();
  
  const totalSteps = 6; // Total number of onboarding screens
  
  // Update a field in our onboarding data
  const updateField = <K extends keyof OnboardingData>(field: K, value: OnboardingData[K]) => {
    setData(prev => ({ ...prev, [field]: value }));
  };
  
  // Move to the next step
  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
      
      // Navigate to the next screen based on the current step
      switch (currentStep) {
        case 1:
          router.push('/fitness-goals');
          break;
        case 2:
          router.push('/fitness-levels');
          break;
        case 3:
          router.push('/workout-environment');
          break;
        case 4:
          router.push('/workout-schedule');
          break;
        case 5:
          router.push('/final-notes');
          break;
      }
    }
  };
  
  // Move to the previous step
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      
      // Navigate to the previous screen based on the current step
      switch (currentStep) {
        case 2:
          router.push('/about-you');
          break;
        case 3:
          router.push('/fitness-goals');
          break;
        case 4:
          router.push('/fitness-levels');
          break;
        case 5:
          router.push('/workout-environment');
          break;
        case 6:
          router.push('/workout-schedule');
          break;
      }
    }
  };
  
  // Save the onboarding data to Supabase
  const saveOnboardingData = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Format the data for Supabase
      const selectedGoals = data.fitnessGoals
        .filter(goal => goal.selected)
        .sort((a, b) => a.order - b.order)
        .map(goal => ({ id: goal.id, title: goal.title }));
      
      const profileData: Database['public']['Tables']['profiles']['Update'] = {
        name: data.name || undefined,
        gender: data.gender || undefined,
        age: data.age || undefined,
        height: data.height || undefined,
        height_unit: data.heightUnit || undefined,
        weight: data.weight || undefined,
        weight_unit: data.weightUnit || undefined,
        fitness_goals: selectedGoals.length > 0 ? selectedGoals : undefined,
        sport_activity: data.sportActivity || undefined,
        coach_notes: data.coachNotes || undefined,
        cardio_level: data.cardioLevel || undefined,
        weightlifting_level: data.weightliftingLevel || undefined,
        fitness_notes: data.fitnessNotes || undefined,
        avoided_exercises: data.avoidedExercises ? data.avoidedExercises.split(',').map(ex => ex.trim()) : undefined,
        workout_environments: data.workoutEnvironments.length > 0 ? data.workoutEnvironments : undefined,
        workouts_per_week: data.workoutsPerWeek || undefined,
        workout_duration: data.workoutDuration || undefined,
        additional_info: data.additionalInfo || undefined,
        onboarding_completed: true
      };
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', user.id);
      
      if (updateError) {
        throw updateError;
      }
      
      // Navigate to the tabs after successful onboarding
      router.replace('/(tabs)');
      
    } catch (err: any) {
      setError(err.message || 'An error occurred saving your profile data');
      console.error('Error saving onboarding data:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <OnboardingContext.Provider
      value={{
        data,
        currentStep,
        totalSteps,
        updateField,
        nextStep,
        prevStep,
        saveOnboardingData,
        isLoading,
        error
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

// Custom hook to use the onboarding context
export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
} 