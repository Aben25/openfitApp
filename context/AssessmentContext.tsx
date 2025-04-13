import { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';
import { Database } from '@/types/database.types';
import { Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  withTiming,
  Easing,
  runOnJS
} from 'react-native-reanimated';

// Window dimensions for animations
const { width } = Dimensions.get('window');

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
  fitness_goal_primary: string | null;

  // Basic info
  display_name: string | null;
  gender: 'male' | 'female' | 'other' | null;
  weight: number | null;
  weightUnit: 'kg' | 'lbs';
  height: number | null;
  heightUnit: 'cm' | 'ft';
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
  cardiolevel: string | null;
  cardio_fitness_level: number | null;
  training_experience_level: string | null;
  weightlifting_fitness_level: number | null;

  // Health
  health_conditions: string[];

  // Excluded exercises
  excluded_exercises: string[];

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
  translateX: Animated.SharedValue<number>;
  opacity: Animated.SharedValue<number>;
  updateCurrentStep: () => void;
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
  fitness_goal_primary: null,
  display_name: null,
  gender: null,
  weight: null,
  weightUnit: 'kg',
  height: null,
  heightUnit: 'cm',
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
  cardiolevel: null,
  cardio_fitness_level: null,
  training_experience_level: null,
  weightlifting_fitness_level: null,
  health_conditions: [],
  excluded_exercises: [],
  additionalNotes: '',
  fitness_assessment_completed: false
};

// Define the route order for navigation
const routeOrder = [
  'index',              // Welcome screen
  'about-you',          // Basic info
  'fitness-goals',      // Fitness goals
  'cardio-level',       // Cardio level
  'strength-level',     // Strength level
  'workout-environment', // Workout environment
  'workout-schedule',   // Workout schedule
  'excluded-exercises', // Excluded exercises
  'complete',           // Assessment complete
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

  // Shared values for smooth transitions
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);

  const totalSteps = routeOrder.length;

  // Update current step whenever the route changes
  useEffect(() => {
    if (router.pathname) {
      // Immediate update when the route changes
      updateCurrentStep();

      // Add a slight delay to ensure navigation has completed
      const timeoutId = setTimeout(() => {
        updateCurrentStep();
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [router.pathname, updateCurrentStep]);

  // Get the current route based on step number
  const getCurrentRoute = (): string => {
    return routeOrder[currentStep - 1] || 'index';
  };

  // Update current step based on the current route
  const updateCurrentStep = useCallback(() => {
    if (!router.pathname) return;

    const currentPath = router.pathname.split('/').pop() || 'index';
    const stepIndex = routeOrder.findIndex(route => route === currentPath);

    if (stepIndex !== -1) {
      // Only update if the step has actually changed to avoid unnecessary rerenders
      if (stepIndex + 1 !== currentStep) {
        setCurrentStep(stepIndex + 1);
      }
    } else {
      // If we can't find the route, default to first step
      console.warn(`Route ${currentPath} not found in routeOrder`);
      setCurrentStep(1);
    }
  }, [router.pathname, currentStep]);

  // Update a field in our assessment data
  const updateField = <K extends keyof AssessmentData>(field: K, value: AssessmentData[K]) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  // Go to a specific step - simplified without complex animations
  const goToStep = (stepNumber: number) => {
    if (stepNumber >= 1 && stepNumber <= totalSteps) {
      const route = routeOrder[stepNumber - 1];
      router.push(`/(assessment)/${route}`);
      setCurrentStep(stepNumber);
    }
  };

  // Move to the previous step - simplified without complex animations
  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      // Update step before navigation
      const newStep = currentStep - 1;
      setCurrentStep(newStep);

      // Then navigate
      router.back();
    }
  }, [currentStep, router]);

  // Move to the next step - simplified without complex animations
  const nextStep = useCallback(() => {
    if (currentStep < totalSteps) {
      // Update step before navigation
      const newStep = currentStep + 1;
      setCurrentStep(newStep);

      const nextRoute = routeOrder[currentStep];
      // Then navigate
      router.push(`/(assessment)/${nextRoute}`);
    }
  }, [currentStep, router, totalSteps, routeOrder]);

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
        display_name: data.display_name || undefined,
        gender: data.gender || undefined,
        weight: data.weight || undefined,
        weight_unit: data.weightUnit || undefined,
        height: data.height || undefined,
        height_unit: data.heightUnit || undefined,
        age: data.age || undefined,
        fitness_goal: data.fitnessGoal || undefined,
        fitness_goal_primary: data.fitness_goal_primary || undefined,
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
        cardiolevel: data.cardiolevel || undefined,
        cardio_fitness_level: data.cardio_fitness_level || undefined,
        training_experience_level: data.training_experience_level || undefined,
        weightlifting_fitness_level: data.weightlifting_fitness_level || undefined,
        health_conditions: data.health_conditions.length > 0 ? data.health_conditions : undefined,
        excluded_exercises: data.excluded_exercises.length > 0 ? data.excluded_exercises : undefined,
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

      // Send data to webhook
      try {
        const webhookUrl = 'https://sciwell.app.n8n.cloud/webhook-test/d1c91348-9bee-425b-8730-fea668a03c28';

        // Prepare data for webhook
        const webhookData = {
          userId: user.id,
          email: user.email,
          assessmentData: {
            personalInfo: {
              displayName: data.display_name,
              gender: data.gender,
              weight: data.weight,
              weightUnit: data.weightUnit,
              height: data.height,
              heightUnit: data.heightUnit,
              age: data.age
            },
            fitnessProfile: {
              fitnessGoal: data.fitnessGoal,
              primaryGoal: data.fitness_goal_primary,
              allGoals: data.fitness_goals_array,
              fitnessExperience: data.fitnessExperience,
              fitnessLevel: data.fitnessLevel,
              cardioLevel: data.cardiolevel,
              cardioFitnessLevel: data.cardio_fitness_level,
              strengthLevel: data.weightliftinglevel,
              strengthFitnessLevel: data.weightlifting_fitness_level
            },
            workoutPreferences: {
              daysPerWeek: data.workoutDaysPerWeek,
              preferredDuration: data.preferred_workout_duration,
              environment: data.workout_environment,
              exercisePreferences: selectedExercises,
              excludedExercises: data.excluded_exercises,
              sportOfChoice: data.sport_of_choice
            },
            healthInfo: {
              dietPreferences: selectedDiet,
              dietaryRestrictions: data.dietary_restrictions,
              mealsPerDay: data.mealsPerDay,
              takingSupplements: data.takingSupplements,
              supplements: selectedSupplements,
              healthConditions: data.health_conditions,
              physicalLimitations: data.physicalLimitations,
              sleepQuality: data.sleepQuality,
              caloricGoal: data.caloricGoal
            },
            additionalInfo: {
              notes: data.additionalNotes
            }
          },
          timestamp: new Date().toISOString()
        };

        // Send data to webhook
        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(webhookData),
        });

        if (!response.ok) {
          console.warn('Webhook response not OK:', await response.text());
        } else {
          console.log('Assessment data sent to webhook successfully');
        }
      } catch (webhookError) {
        // Just log webhook errors, don't prevent navigation
        console.error('Error sending data to webhook:', webhookError);
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
    translateX,
    opacity,
    updateCurrentStep,
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