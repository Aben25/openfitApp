import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator,
  ScrollView 
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import DraggableFlatList, { 
  RenderItemParams, 
  ScaleDecorator 
} from 'react-native-draggable-flatlist';
import Header from '../components/Header';
import { supabase } from '../lib/supabase';

type Exercise = {
  id: string;
  exercise_id: string;
  workout_id: string;
  name: string;
  order_index: number;
  sets: number;
  reps: number[];
  weight: number[];
  rest_interval: number;
};

export default function WorkoutPrepareScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams();
  const workoutId = params.workoutId as string;
  
  const [workout, setWorkout] = useState<{ id: string; name: string } | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    fetchWorkoutData();
  }, [workoutId]);
  
  async function fetchWorkoutData() {
    try {
      setLoading(true);
      
      // Fetch workout details
      const { data: workoutData, error: workoutError } = await supabase
        .from('workouts')
        .select('id, name')
        .eq('id', workoutId)
        .single();
        
      if (workoutError) throw workoutError;
      
      // Fetch workout exercises
      const { data: exercisesData, error: exercisesError } = await supabase
        .from('workout_exercises')
        .select('*')
        .eq('workout_id', workoutId)
        .order('order_index');
        
      if (exercisesError) throw exercisesError;
      
      setWorkout(workoutData);
      setExercises(exercisesData);
    } catch (err: any) {
      console.error('Error fetching workout data:', err.message);
      setError('Failed to load workout data');
    } finally {
      setLoading(false);
    }
  }
  
  const handleReorderExercises = async (newExercises: Exercise[]) => {
    setExercises(newExercises);
  };
  
  const handleDeleteExercise = (exercise: Exercise) => {
    Alert.alert(
      'Delete Exercise',
      `Are you sure you want to remove ${exercise.name} from this workout?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              // Delete from the database
              const { error } = await supabase
                .from('workout_exercises')
                .delete()
                .eq('id', exercise.id);
                
              if (error) throw error;
              
              // Update local state
              setExercises(prevExercises => 
                prevExercises.filter(e => e.id !== exercise.id)
              );
            } catch (err: any) {
              console.error('Error deleting exercise:', err.message);
              Alert.alert('Error', 'Failed to delete exercise');
            }
          }
        }
      ]
    );
  };
  
  const handleReplaceExercise = (exercise: Exercise) => {
    router.push({
      pathname: '/exercise-selection',
      params: { 
        workoutId,
        replaceExerciseId: exercise.id
      }
    });
  };
  
  const handleAddExercise = () => {
    router.push({
      pathname: '/exercise-selection',
      params: { workoutId }
    });
  };
  
  const handleSaveAndStart = async () => {
    try {
      setSaving(true);
      
      // Update exercise order indices in the database
      const updates = exercises.map((exercise, index) => ({
        id: exercise.id,
        order_index: index
      }));
      
      // Use Promise.all to perform all updates concurrently
      await Promise.all(
        updates.map(update => 
          supabase
            .from('workout_exercises')
            .update({ order_index: update.order_index })
            .eq('id', update.id)
        )
      );
      
      // Navigate to the active workout screen
      router.push({
        pathname: '/workout-active',
        params: { workoutId }
      });
    } catch (err: any) {
      console.error('Error saving workout:', err.message);
      setError('Failed to save changes');
      setSaving(false);
    }
  };
  
  const renderExerciseItem = ({ item, drag, isActive }: RenderItemParams<Exercise>) => (
    <ScaleDecorator>
      <TouchableOpacity
        activeOpacity={1}
        style={[
          styles.exerciseItem,
          isActive && styles.exerciseItemActive
        ]}
      >
        <TouchableOpacity 
          onPressIn={drag}
          style={styles.dragHandle}
        >
          <Ionicons name="reorder-three" size={24} color="#6366f1" />
        </TouchableOpacity>
        
        <View style={styles.exerciseContent}>
          <Text style={styles.exerciseName}>{item.name}</Text>
          <Text style={styles.exerciseDetails}>
            {item.sets} sets • {item.reps[0]} reps • {item.rest_interval}s rest
          </Text>
        </View>
        
        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleReplaceExercise(item)}
            disabled={saving}
          >
            <Ionicons name="repeat" size={22} color="#6366f1" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDeleteExercise(item)}
            disabled={saving}
          >
            <Ionicons name="trash-outline" size={22} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </ScaleDecorator>
  );
  
  if (loading) {
    return (
      <View style={[styles.container, styles.loading]}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.loadingText}>Loading workout...</Text>
      </View>
    );
  }
  
  if (error) {
    return (
      <View style={[styles.container, styles.error]}>
        <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.errorButton}>
          <Text style={styles.errorButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="light" />
      
      <Header
        title="Prepare Workout"
        showBackButton
      />
      
      <View style={styles.content}>
        <View style={styles.workoutHeader}>
          <Text style={styles.workoutName}>{workout?.name}</Text>
          <Text style={styles.workoutInstructions}>
            Drag to reorder exercises, tap replace or delete to modify your workout
          </Text>
        </View>
        
        {exercises.length > 0 ? (
          <DraggableFlatList
            data={exercises}
            keyExtractor={(item) => item.id}
            renderItem={renderExerciseItem}
            onDragEnd={({ data }) => handleReorderExercises(data)}
            contentContainerStyle={styles.exerciseList}
          />
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="barbell-outline" size={48} color="#a1a1aa" />
            <Text style={styles.emptyStateText}>
              No exercises in this workout yet
            </Text>
          </View>
        )}
        
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddExercise}
          disabled={saving}
        >
          <Ionicons name="add-circle-outline" size={24} color="#fff" />
          <Text style={styles.addButtonText}>Add Exercise</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.startButton,
            exercises.length === 0 && styles.startButtonDisabled
          ]}
          onPress={handleSaveAndStart}
          disabled={exercises.length === 0 || saving}
        >
          <Text style={styles.startButtonText}>Save & Start Workout</Text>
          <Ionicons name="arrow-forward" size={22} color="#fff" />
        </TouchableOpacity>
      </View>
      
      {saving && (
        <View style={styles.savingOverlay}>
          <ActivityIndicator size="large" color="#6366f1" />
          <Text style={styles.savingText}>Saving changes...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  loading: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#fff',
  },
  error: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  errorButton: {
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#6366f1',
    borderRadius: 8,
  },
  errorButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  workoutHeader: {
    marginBottom: 24,
  },
  workoutName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  workoutInstructions: {
    fontSize: 16,
    color: '#a1a1aa',
  },
  exerciseList: {
    paddingBottom: 20,
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  exerciseItemActive: {
    backgroundColor: '#2d2d2d',
    transform: [{ scale: 1.02 }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 5,
  },
  exerciseContent: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  exerciseDetails: {
    fontSize: 14,
    color: '#a1a1aa',
  },
  dragHandle: {
    paddingRight: 12,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  deleteButton: {
    marginLeft: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#a1a1aa',
    textAlign: 'center',
    marginTop: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1e1e1e',
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6366f1',
    padding: 16,
    borderRadius: 12,
  },
  startButtonDisabled: {
    backgroundColor: '#3f3f46',
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginRight: 8,
  },
  savingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  savingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#fff',
  },
}); 