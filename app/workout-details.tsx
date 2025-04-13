import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';

export default function WorkoutDetailsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { workoutId } = useLocalSearchParams();
  
  // State
  const [workout, setWorkout] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    async function fetchWorkoutDetails() {
      if (!workoutId) return;
      
      try {
        setLoading(true);
        
        // Fetch workout details
        const { data: workoutData, error: workoutError } = await supabase
          .from('workouts')
          .select('*')
          .eq('id', workoutId)
          .single();
          
        if (workoutError) throw workoutError;
        setWorkout(workoutData);
        
        // Fetch exercises for this workout
        const { data: exercisesData, error: exercisesError } = await supabase
          .from('workout_exercises')
          .select(`
            *,
            exercise:exercise_id (*)
          `)
          .eq('workout_id', workoutId)
          .order('order_index', { ascending: true });
          
        if (exercisesError) throw exercisesError;
        setExercises(exercisesData);
        
      } catch (err) {
        console.error('Error fetching workout details:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    }
    
    fetchWorkoutDetails();
  }, [workoutId]);
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF8C42" />
        <Text style={styles.loadingText}>Loading workout details...</Text>
      </View>
    );
  }
  
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={48} color="#FF8C42" />
        <Text style={styles.errorText}>Error loading workout details</Text>
        <Text style={styles.errorMessage}>{error}</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <Header
        title="Workout Details"
        showBackButton={true}
        transparent={false}
        light={false}
      />
      
      {/* Workout Info */}
      <View style={styles.workoutInfoContainer}>
        <Text style={styles.workoutName}>{workout?.name || 'Workout'}</Text>
        {workout?.description && (
          <Text style={styles.workoutDescription}>{workout.description}</Text>
        )}
        
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Ionicons name="barbell-outline" size={20} color="#FF8C42" />
            <Text style={styles.statText}>{exercises.length} Exercises</Text>
          </View>
          
          <View style={styles.statItem}>
            <Ionicons name="calendar-outline" size={20} color="#FF8C42" />
            <Text style={styles.statText}>
              Created {new Date(workout?.created_at).toLocaleDateString()}
            </Text>
          </View>
        </View>
      </View>
      
      {/* Exercise List */}
      <Text style={styles.sectionTitle}>Exercises</Text>
      
      <ScrollView 
        style={styles.exerciseList}
        contentContainerStyle={styles.exerciseListContent}
        showsVerticalScrollIndicator={false}
      >
        {exercises.length > 0 ? (
          exercises.map((item, index) => (
            <View key={item.id} style={styles.exerciseItem}>
              <View style={styles.exerciseIndex}>
                <Text style={styles.exerciseIndexText}>{index + 1}</Text>
              </View>
              
              <View style={styles.exerciseInfo}>
                <Text style={styles.exerciseName}>
                  {item.exercise?.name || 'Unknown Exercise'}
                </Text>
                
                <View style={styles.exerciseDetails}>
                  <Text style={styles.exerciseDetailsText}>
                    {item.sets} sets • {item.reps || '10'} reps
                    {item.rest_interval ? ` • ${item.rest_interval}s rest` : ''}
                  </Text>
                </View>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="fitness-outline" size={48} color="#555" />
            <Text style={styles.emptyText}>No exercises in this workout</Text>
          </View>
        )}
      </ScrollView>
      
      {/* Action Button */}
      <View style={[styles.actionContainer, { paddingBottom: insets.bottom || 20 }]}>
        <TouchableOpacity 
          style={styles.startButton}
          onPress={() => router.push({
            pathname: '/workout-prepare',
            params: { workoutId }
          })}
        >
          <Ionicons name="play" size={20} color="white" />
          <Text style={styles.startButtonText}>Start Workout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  loadingText: {
    color: 'white',
    marginTop: 12,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
    padding: 20,
  },
  errorText: {
    color: 'white',
    marginTop: 12,
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorMessage: {
    color: '#AAA',
    marginTop: 8,
    fontSize: 14,
    textAlign: 'center',
  },
  workoutInfoContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  workoutName: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  workoutDescription: {
    color: '#CCC',
    fontSize: 16,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    color: '#AAA',
    fontSize: 14,
    marginLeft: 6,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginLeft: 20,
    marginBottom: 12,
  },
  exerciseList: {
    flex: 1,
  },
  exerciseListContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
  },
  exerciseIndex: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FF8C42',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  exerciseIndexText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  exerciseDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exerciseDetailsText: {
    color: '#CCC',
    fontSize: 14,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    color: '#AAA',
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
  actionContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  startButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF8C42',
    paddingVertical: 16,
    borderRadius: 10,
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
}); 