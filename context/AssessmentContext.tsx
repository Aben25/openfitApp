import { createContext, useState, useContext, ReactNode } from 'react';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';
import { Database } from '@/types/database.types';

// Define types for diet preferences
export type DietPreference = {
  id: string;
  name: string;
  selected: boolean;
};

// Define types for exercise preferences
export type ExercisePreference = {
  id: string;
  name: string;
  icon: string;
  selected: boolean;
};

// Define types for supplements
export type Supplement = {
  id: string;
  name: string;
  selected: boolean;
};

// Define the type for our assessment data
export type AssessmentData = {
  // Goal
  fitnessGoal: string | null;
  fitness_goals_array: string[];
  
  // Basic info
  gender: 'male' | 'female' | 'other' | null;
  weight: number | null;
  weightUnit: 'kg' | 'lbs';
  age: number | null;
  
  // Fitness background
  fitnessExperience: 'none' | 'beginner' | 'intermediate' | 'advanced' | null;
  fitnessLevel: number | null;
  physicalLimitations: string[];
  
  // Diet and nutrition
  dietPreferences: DietPreference[];
  mealsPerDay: number | null;
  dietary_restrictions: string[];
  
  // Workout preferences
  workoutDaysPerWeek: number | null;
  preferred_workout_days_count: number | null;
  preferred_workout_duration: string | null;
  workout_environment: string[];
  exercisePreferences: ExercisePreference[];
  
  // Sport specific
  sport_of_choice: string | null;
  
  // Supplements
  takingSupplements: boolean;
  supplements: Supplement[];
  
  // Goals and targets
  caloricGoal: number | null;
  sleepQuality: 'poor' | 'fair' | 'good' | 'excellent' | null;
  
  // Experience levels
  cardio_level: string | null;
  training_experience_level: string | null;
  
  // Health
  health_conditions: string[];
  
  // Additional notes
  additionalNotes: string;
  
  // Progress tracking
  fitness_assessment_completed: boolean;
};

// Define the context type
type AssessmentContextType = {
  data: AssessmentData;
  currentStep: number;
  totalSteps: number;
  updateField: <K extends keyof AssessmentData>(field: K, value: AssessmentData[K]) => void;
  nextStep: () => void;
  prevStep: () => void;
  saveAssessmentData: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  goToStep: (stepNumber: number) => void;
  getCurrentRoute: () => string;
};

// Default diet preferences
const defaultDietPreferences: DietPreference[] = [
  { id: 'standard', name: 'Standard', selected: true },
  { id: 'vegetarian', name: 'Vegetarian', selected: false },
  { id: 'vegan', name: 'Vegan', selected: false },
  { id: 'keto', name: 'Keto', selected: false },
  { id: 'paleo', name: 'Paleo', selected: false },
  { id: 'mediterranean', name: 'Mediterranean', selected: false },
];

// Default exercise preferences
const defaultExercisePreferences: ExercisePreference[] = [
  { id: 'strength', name: 'Strength', icon: 'barbell-outline', selected: false },
  { id: 'cardio', name: 'Cardio', icon: 'heart-outline', selected: false },
  { id: 'yoga', name: 'Yoga', icon: 'body-outline', selected: false },
  { id: 'hiit', name: 'HIIT', icon: 'stopwatch-outline', selected: false },
  { id: 'pilates', name: 'Pilates', icon: 'fitness-outline', selected: false },
  { id: 'calisthenics', name: 'Calisthenics', icon: 'body-outline', selected: false },
];

// Default supplements
const defaultSupplements: Supplement[] = [
  { id: 'protein', name: 'Protein', selected: false },
  { id: 'creatine', name: 'Creatine', selected: false },
  { id: 'preworkout', name: 'Pre-workout', selected: false },
  { id: 'vitamins', name: 'Vitamins', selected: false },
  { id: 'bcaa', name: 'BCAAs', selected: false },
  { id: 'omega3', name: 'Omega-3', selected: false },
];

// Create the default values for our assessment data
const defaultAssessmentData: AssessmentData = {
  fitnessGoal: null,
  fitness_goals_array: [],
  gender: null,
  weight: null,
  weightUnit: 'kg',
  age: null,
  fitnessExperience: null,
  fitnessLevel: null,
  physicalLimitations: [],
  dietPreferences: defaultDietPreferences,
  mealsPerDay: null,
  dietary_restrictions: [],
  workoutDaysPerWeek: null,
  preferred_workout_days_count: null,
  preferred_workout_duration: null,
  workout_environment: [],
  exercisePreferences: defaultExercisePreferences,
  sport_of_choice: null,
  takingSupplements: false,
  supplements: defaultSupplements,
  caloricGoal: null,
  sleepQuality: null,
  cardio_level: null,
  training_experience_level: null,
  health_conditions: [],
  additionalNotes: '',
  fitness_assessment_completed: false
};

// Define the route order for navigation
const routeOrder = [
  'index', // Fitness goal
  'gender',
  'weight',
  'age',
  'complete',
];

// Create the context
const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

// Create the provider component
export function AssessmentProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AssessmentData>(defaultAssessmentData);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useAuth();
  
  const totalSteps = routeOrder.length;
  
  // Get the current route based on step number
  const getCurrentRoute = (): string => {
    return routeOrder[currentStep - 1] || 'index';
  };
  
  // Update a field in our assessment data
  const updateField = <K extends keyof AssessmentData>(field: K, value: AssessmentData[K]) => {
    setData(prev => ({ ...prev, [field]: value }));
  };
  
  // Go to a specific step
  const goToStep = (stepNumber: number) => {
    if (stepNumber >= 1 && stepNumber <= totalSteps) {
      setCurrentStep(stepNumber);
      const route = routeOrder[stepNumber - 1];
      router.push(`/(assessment)/${route}`);
    }
  };
  
  // Move to the next step
  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
      const nextRoute = routeOrder[currentStep];
      router.push(`/(assessment)/${nextRoute}`);
    }
  };
  
  // Move to the previous step
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      const prevRoute = routeOrder[currentStep - 2];
      router.push(`/(assessment)/${prevRoute}`);
    }
  };
  
  // Save the assessment data to Supabase
  const saveAssessmentData = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Format the data for Supabase
      const selectedDiet = data.dietPreferences
        .filter(diet => diet.selected)
        .map(diet => diet.name);
      
      const selectedExercises = data.exercisePreferences
        .filter(exercise => exercise.selected)
        .map(exercise => exercise.name);
      
      const selectedSupplements = data.supplements
        .filter(supplement => supplement.selected)
        .map(supplement => supplement.name);
      
      const profileData: Database['public']['Tables']['profiles']['Update'] = {
        gender: data.gender || undefined,
        weight: data.weight || undefined,
        weight_unit: data.weightUnit || undefined,
        age: data.age || undefined,
        fitness_goal: data.fitnessGoal || undefined,
        fitness_goals_array: data.fitness_goals_array.length > 0 ? data.fitness_goals_array : undefined,
        fitness_experience: data.fitnessExperience || undefined,
        fitness_level: data.fitnessLevel || undefined,
        physical_limitations: data.physicalLimitations.length > 0 ? data.physicalLimitations : undefined,
        diet_preferences: selectedDiet.length > 0 ? selectedDiet : undefined,
        dietary_restrictions: data.dietary_restrictions.length > 0 ? data.dietary_restrictions : undefined,
        meals_per_day: data.mealsPerDay || undefined,
        workout_days_per_week: data.workoutDaysPerWeek || undefined,
        preferred_workout_days_count: data.preferred_workout_days_count || undefined,
        preferred_workout_duration: data.preferred_workout_duration || undefined,
        workout_environment: data.workout_environment.length > 0 ? data.workout_environment : undefined,
        exercise_preferences: selectedExercises.length > 0 ? selectedExercises : undefined,
        sport_of_choice: data.sport_of_choice || undefined,
        taking_supplements: data.takingSupplements,
        supplements: selectedSupplements.length > 0 ? selectedSupplements : undefined,
        caloric_goal: data.caloricGoal || undefined,
        sleep_quality: data.sleepQuality || undefined,
        cardio_level: data.cardio_level || undefined,
        training_experience_level: data.training_experience_level || undefined,
        health_conditions: data.health_conditions.length > 0 ? data.health_conditions : undefined,
        additional_notes: data.additionalNotes || undefined,
        onboarding_completed: true,
        fitness_assessment_completed: true
      };
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', user.id);
      
      if (updateError) {
        throw updateError;
      }
      
      // Navigate to the tabs after successful assessment
      router.replace('/(tabs)');
      
    } catch (err: any) {
      setError(err.message || 'An error occurred saving your assessment data');
      console.error('Error saving assessment data:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Provide the context value
  const contextValue: AssessmentContextType = {
    data,
    currentStep,
    totalSteps,
    updateField,
    nextStep,
    prevStep,
    goToStep,
    saveAssessmentData,
    isLoading,
    error,
    getCurrentRoute,
  };
  
  return (
    <AssessmentContext.Provider value={contextValue}>
      {children}
    </AssessmentContext.Provider>
  );
}

// Create a hook to use the assessment context
export function useAssessment() {
  const context = useContext(AssessmentContext);
  if (context === undefined) {
    throw new Error('useAssessment must be used within an AssessmentProvider');
  }
  return context;
} 