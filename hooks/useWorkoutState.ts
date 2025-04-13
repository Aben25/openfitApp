import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { supabase } from '@/lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import * as Haptics from 'expo-haptics';

interface WorkoutState {
  workout: any;
  exercises: any[];
  currentExerciseIndex: number;
  completedSets: Record<string, boolean[]>;
  setInputValues: Record<string, Array<{ weight: string; reps: string }>>;
  workoutLogId: string | null;
  workoutStartTime: number | null;
  workoutElapsedTime: number;
  isResting: boolean;
  restTimer: number;
  offlineQueue: any[];
}

export function useWorkoutState(workoutId: string) {
  const [state, setState] = useState<WorkoutState>({
    workout: null,
    exercises: [],
    currentExerciseIndex: 0,
    completedSets: {},
    setInputValues: {},
    workoutLogId: null,
    workoutStartTime: null,
    workoutElapsedTime: 0,
    isResting: false,
    restTimer: 0,
    offlineQueue: []
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch workout details with retry logic
  const fetchWorkoutDetails = useCallback(async () => {
    const MAX_RETRIES = 3;
    let retries = 0;

    while (retries < MAX_RETRIES) {
      try {
        setLoading(true);

        // Try to recover saved state first
        const savedState = await AsyncStorage.getItem(`workout_state_${workoutId}`);
        if (savedState) {
          const parsed = JSON.parse(savedState);
          setState(prev => ({ ...prev, ...parsed }));
          return;
        }

        // Fetch workout details
        const { data: workoutData, error: workoutError } = await supabase
          .from('workouts')
          .select('*')
          .eq('id', workoutId)
          .single();

        if (workoutError) throw workoutError;

        // Fetch exercises
        const { data: exercisesData, error: exercisesError } = await supabase
          .from('workout_exercises')
          .select(`
            *,
            exercise:exercise_id (*)
          `)
          .eq('workout_id', workoutId)
          .order('order_index', { ascending: true });

        if (exercisesError) throw exercisesError;

        // Initialize state
        const startTime = Date.now();
        const initialCompletedSets: Record<string, boolean[]> = {};
        const initialSetInputs: Record<string, Array<{ weight: string; reps: string }>> = {};

        exercisesData.forEach(exercise => {
          initialCompletedSets[exercise.id] = Array(exercise.sets || 3).fill(false);
          initialSetInputs[exercise.id] = Array(exercise.sets || 3).fill().map(() => ({
            weight: exercise.weight_old ? exercise.weight_old.toString() : '0',
            reps: exercise.reps_old ? exercise.reps_old.toString() : '10'
          }));
        });

        // Create workout log
        const { data: session } = await supabase.auth.getSession();
        if (!session?.session?.user) {
          throw new Error('You must be logged in to record a workout');
        }

        const { data: logData, error: logError } = await supabase
          .from('workout_logs')
          .insert({
            user_id: session.session.user.id,
            workout_id: workoutId,
            created_at: new Date(startTime).toISOString(),
          })
          .select()
          .single();

        if (logError) throw logError;

        setState(prev => ({
          ...prev,
          workout: workoutData,
          exercises: exercisesData,
          completedSets: initialCompletedSets,
          setInputValues: initialSetInputs,
          workoutLogId: logData.id,
          workoutStartTime: startTime
        }));

        break;
      } catch (err) {
        retries++;
        if (retries === MAX_RETRIES) {
          setError(err instanceof Error ? err.message : 'An unknown error occurred');
          throw err;
        }
        await new Promise(resolve => setTimeout(resolve, 1000 * retries));
      } finally {
        setLoading(false);
      }
    }
  }, [workoutId]);

  // Auto-save state
  useEffect(() => {
    const autoSaveInterval = setInterval(async () => {
      if (state.workoutLogId) {
        await AsyncStorage.setItem(
          `workout_state_${workoutId}`,
          JSON.stringify(state)
        );

        await supabase
          .from('workout_logs')
          .update({
            duration: state.workoutElapsedTime,
            last_saved: new Date().toISOString()
          })
          .eq('id', state.workoutLogId);
      }
    }, 30000);

    return () => clearInterval(autoSaveInterval);
  }, [state, workoutId]);

  // Sync offline data
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(async state => {
      if (state.isConnected && state.offlineQueue.length > 0) {
        await Promise.all(
          state.offlineQueue.map(set =>
            supabase.from('completed_sets').insert(set)
          )
        );
        setState(prev => ({ ...prev, offlineQueue: [] }));
      }
    });

    return () => unsubscribe();
  }, []);

  // Complete set handler
  const completeSet = useCallback(async () => {
    try {
      if (!state.workoutLogId) {
        Alert.alert('Error', 'Workout session not initialized');
        return;
      }

      const currentExercise = state.exercises[state.currentExerciseIndex];
      const currentSets = state.completedSets[currentExercise.id];
      const nextSetIndex = currentSets.findIndex(completed => !completed);

      if (nextSetIndex === -1) {
        Alert.alert('All sets completed', 'Moving to next exercise');
        setState(prev => ({
          ...prev,
          currentExerciseIndex: Math.min(prev.currentExerciseIndex + 1, prev.exercises.length - 1)
        }));
        return;
      }

      const setInputs = state.setInputValues[currentExercise.id]?.[nextSetIndex];
      const setData = {
        workout_id: workoutId,
        workout_exercise_id: currentExercise.id,
        performed_set_order: nextSetIndex + 1,
        performed_reps: parseInt(setInputs.reps) || 10,
        performed_weight: parseInt(setInputs.weight) || 0,
        set_feedback_difficulty: 'normal',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Try to save online, fallback to offline queue
      try {
        const { error: insertError } = await supabase
          .from('completed_sets')
          .insert(setData);

        if (insertError) throw insertError;
      } catch (err) {
        setState(prev => ({
          ...prev,
          offlineQueue: [...prev.offlineQueue, setData]
        }));
      }

      // Update local state
      setState(prev => ({
        ...prev,
        completedSets: {
          ...prev.completedSets,
          [currentExercise.id]: prev.completedSets[currentExercise.id].map(
            (completed, i) => i === nextSetIndex ? true : completed
          )
        },
        restTimer: currentExercise.rest_interval || 45,
        isResting: true
      }));

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (err) {
      console.error('Error completing set:', err);
      Alert.alert('Error', err instanceof Error ? err.message : 'Failed to complete set');
    }
  }, [state, workoutId]);

  return {
    ...state,
    loading,
    error,
    completeSet,
    setState,
    fetchWorkoutDetails
  };
} 