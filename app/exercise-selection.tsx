import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, ActivityIndicator, TextInput, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '../lib/supabase';
import Header from '../components/Header';

type Exercise = {
  id: string;
  name: string;
  muscle_group: string;
  equipment: string;
  description?: string;
};

export default function ExerciseSelectionScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams();
  const workoutId = params.workoutId as string;
  const replaceExerciseId = params.replaceExerciseId as string | undefined;
  
  const [searchQuery, setSearchQuery] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  
  // Fetch exercises from the database
  useEffect(() => {
    async function fetchExercises() {
      try {
        setLoading(true);
        
        // Get existing exercises in the workout if we're not replacing
        let existingExerciseIds: string[] = [];
        
        if (!replaceExerciseId) {
          const { data: workoutExercises, error: workoutExercisesError } = await supabase
            .from('workout_exercises')
            .select('exercise_id')
            .eq('workout_id', workoutId);
            
          if (workoutExercisesError) throw workoutExercisesError;
          
          existingExerciseIds = workoutExercises.map(item => item.exercise_id);
        }
        
        // Fetch all exercises
        const { data: exercisesData, error: exercisesError } = await supabase
          .from('exercises')
          .select('id, name, muscle_group, equipment, description')
          .order('name');
          
        if (exercisesError) throw exercisesError;
        
        // Filter out exercises that are already in the workout if not replacing
        let availableExercises = exercisesData;
        if (!replaceExerciseId && existingExerciseIds.length > 0) {
          availableExercises = exercisesData.filter(
            exercise => !existingExerciseIds.includes(exercise.id)
          );
        }
        
        setExercises(availableExercises);
        setFilteredExercises(availableExercises);
      } catch (err: any) {
        console.error('Error fetching exercises:', err.message);
        setError('Failed to load exercises');
      } finally {
        setLoading(false);
      }
    }
    
    fetchExercises();
  }, [workoutId, replaceExerciseId]);
  
  // Filter exercises based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredExercises(exercises);
      return;
    }
    
    const query = searchQuery.toLowerCase().trim();
    const filtered = exercises.filter(exercise => 
      exercise.name.toLowerCase().includes(query) || 
      exercise.muscle_group.toLowerCase().includes(query) ||
      exercise.equipment.toLowerCase().includes(query)
    );
    
    setFilteredExercises(filtered);
  }, [searchQuery, exercises]);
  
  const handleSelectExercise = async (exercise: Exercise) => {
    try {
      setSaving(true);
      
      const user = await supabase.auth.getUser();
      if (!user.data.user) {
        Alert.alert('Error', 'You must be logged in to add exercises');
        return;
      }
      
      if (replaceExerciseId) {
        // Replace existing exercise
        const { error: replaceError } = await supabase
          .from('workout_exercises')
          .update({
            exercise_id: exercise.id,
            name: exercise.name
          })
          .eq('id', replaceExerciseId);
          
        if (replaceError) throw replaceError;
      } else {
        // Add new exercise to workout
        
        // Get the highest order index
        const { data: maxOrderData, error: maxOrderError } = await supabase
          .from('workout_exercises')
          .select('order_index')
          .eq('workout_id', workoutId)
          .order('order_index', { ascending: false })
          .limit(1);
          
        if (maxOrderError) throw maxOrderError;
        
        const nextOrderIndex = maxOrderData.length > 0 
          ? (maxOrderData[0].order_index + 1) 
          : 0;
        
        // Add exercise to workout
        const { error: addError } = await supabase
          .from('workout_exercises')
          .insert({
            workout_id: workoutId,
            exercise_id: exercise.id,
            name: exercise.name,
            order_index: nextOrderIndex,
            sets: 3,
            reps: [10],
            weight: [0],
            rest_interval: 60
          });
          
        if (addError) throw addError;
      }
      
      // Navigate back to workout preparation screen
      router.push({
        pathname: '/workout-prepare',
        params: { workoutId }
      });
      
    } catch (err: any) {
      console.error('Error selecting exercise:', err.message);
      Alert.alert('Error', 'Failed to add exercise to workout');
      setSaving(false);
    }
  };
  
  const renderExerciseItem = ({ item }: { item: Exercise }) => (
    <TouchableOpacity 
      style={styles.exerciseItem}
      onPress={() => handleSelectExercise(item)}
      disabled={saving}
    >
      <View style={styles.exerciseDetails}>
        <Text style={styles.exerciseName}>{item.name}</Text>
        <Text style={styles.exerciseInfo}>
          {item.muscle_group} • {item.equipment}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#6366f1" />
    </TouchableOpacity>
  );
  
  if (loading) {
    return (
      <View style={[styles.container, styles.centeredContent]}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.loadingText}>Loading exercises...</Text>
      </View>
    );
  }
  
  if (error) {
    return (
      <View style={[styles.container, styles.centeredContent]}>
        <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => router.back()}
        >
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="light" />
      
      <Header
        title={replaceExerciseId ? "Replace Exercise" : "Add Exercise"}
        showBackButton
      />
      
      <View style={styles.content}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#a1a1aa" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search exercises..."
            placeholderTextColor="#a1a1aa"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              style={styles.clearButton}
            >
              <Ionicons name="close-circle" size={20} color="#a1a1aa" />
            </TouchableOpacity>
          )}
        </View>
        
        {filteredExercises.length > 0 ? (
          <FlatList
            data={filteredExercises}
            renderItem={renderExerciseItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            initialNumToRender={15}
          />
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="fitness-outline" size={48} color="#a1a1aa" />
            <Text style={styles.emptyStateText}>
              {searchQuery.length > 0
                ? `No exercises found for "${searchQuery}"`
                : "No exercises available"
              }
            </Text>
          </View>
        )}
      </View>
      
      {saving && (
        <View style={styles.savingOverlay}>
          <ActivityIndicator size="large" color="#6366f1" />
          <Text style={styles.savingText}>Adding exercise...</Text>
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
  centeredContent: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 50,
    color: '#fff',
    fontSize: 16,
  },
  clearButton: {
    padding: 8,
  },
  list: {
    paddingBottom: 16,
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  exerciseDetails: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  exerciseInfo: {
    fontSize: 14,
    color: '#a1a1aa',
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
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#fff',
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#6366f1',
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
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