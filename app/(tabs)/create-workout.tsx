import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeColor } from '@/hooks/useThemeColor';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import { Database } from '@/types/database.types';

// Define types for our data
type Exercise = Database['public']['Tables']['exercises']['Row'];

export default function CreateWorkoutScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  // State for workout form
  const [workoutName, setWorkoutName] = useState('');
  const [workoutDescription, setWorkoutDescription] = useState('');
  
  // State for exercises
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<{
    exercise: Exercise,
    sets: number,
    reps: string,
    restSeconds: number,
    orderIndex: number
  }[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
  
  // UI state
  const [isExerciseModalVisible, setIsExerciseModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Filter exercises based on search query
    if (searchQuery.trim() === '') {
      setFilteredExercises(exercises);
    } else {
      const filtered = exercises.filter(exercise => 
        exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredExercises(filtered);
    }
  }, [searchQuery, exercises]);
  
  useEffect(() => {
    fetchExercises();
  }, []);
  
  const fetchExercises = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setExercises(data || []);
      setFilteredExercises(data || []);
    } catch (err) {
      console.error('Error fetching exercises:', err);
      setError(err instanceof Error ? err.message : 'Failed to load exercises');
    } finally {
      setLoading(false);
    }
  };
  
  const addExerciseToWorkout = (exercise: Exercise) => {
    setSelectedExercises(prev => [
      ...prev, 
      {
        exercise,
        sets: 3,
        reps: '10',
        restSeconds: 60,
        orderIndex: prev.length
      }
    ]);
    setIsExerciseModalVisible(false);
  };
  
  const removeExerciseFromWorkout = (index: number) => {
    setSelectedExercises(prev => prev.filter((_, i) => i !== index));
  };
  
  const updateExerciseDetails = (index: number, field: string, value: number | string) => {
    setSelectedExercises(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value
      };
      return updated;
    });
  };
  
  const handleSaveWorkout = async () => {
    if (!workoutName.trim()) {
      Alert.alert('Error', 'Please enter a workout name');
      return;
    }

    if (selectedExercises.length === 0) {
      Alert.alert('Error', 'Please add at least one exercise to your workout');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        Alert.alert('Error', 'You must be logged in to save a workout');
        setLoading(false);
        return;
      }
      
      // Insert the workout (removing description due to schema cache issue)
      const { data: workout, error: workoutError } = await supabase
        .from('workouts')
        .insert({
          user_id: user.id,
          name: workoutName
          // description field removed due to schema cache issue
        })
        .select()
        .single();

      if (workoutError) {
        console.error('Error saving workout:', workoutError);
        Alert.alert('Error', `Error saving workout: ${workoutError.message || JSON.stringify(workoutError)}`);
        setLoading(false);
        return;
      }
      
      // Insert the workout exercises
      const workoutExercisesData = selectedExercises.map((item, index) => ({
        workout_id: workout.id,
        exercise_id: item.exercise.id,
        name: item.exercise.name,
        order_index: index,
        sets: item.sets,
        reps: `{${item.reps}}`  // Format as PostgreSQL array
        // rest_seconds field removed due to schema cache issue
      }));
      
      const { error: exercisesError } = await supabase
        .from('workout_exercises')
        .insert(workoutExercisesData);
      
      if (exercisesError) {
        console.error('Error saving workout exercises:', exercisesError);
        Alert.alert('Error', `Error saving workout exercises: ${exercisesError.message || JSON.stringify(exercisesError)}`);
        setLoading(false);
        return;
      }
      
      // Success - navigate back to workouts screen
      router.push('/(tabs)');
      
      // Show success alert
      Alert.alert(
        'Workout Saved',
        'Your workout has been saved successfully'
      );
    } catch (error: any) {
      console.error('Unexpected error:', error);
      Alert.alert('Error', `An unexpected error occurred: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Render exercise selection modal
  const renderExerciseModal = () => {
    if (!isExerciseModalVisible) return null;
    
    return (
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Exercises</Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setIsExerciseModalVisible(false)}
            >
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#999" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search exercises..."
              placeholderTextColor="#777"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          
          <ScrollView style={styles.exerciseList}>
            {filteredExercises.map(exercise => (
              <TouchableOpacity
                key={exercise.id}
                style={styles.exerciseItem}
                onPress={() => addExerciseToWorkout(exercise)}
              >
                <View style={styles.exerciseIconContainer}>
                  <Ionicons 
                    name={getPrimaryMuscleIcon(exercise.primary_muscles?.[0])} 
                    size={24} 
                    color="#FF8C42" 
                  />
                </View>
                <View style={styles.exerciseDetails}>
                  <Text style={styles.exerciseName}>{exercise.name}</Text>
                  <Text style={styles.exerciseMuscles}>
                    {formatMuscleGroups(exercise.primary_muscles)}
                  </Text>
                </View>
                <Ionicons name="add-circle" size={24} color="#FF8C42" />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    );
  };
  
  // Helper function to get icon for muscle group
  const getPrimaryMuscleIcon = (muscle?: string): "body" | "barbell" | "fitness" => {
    if (!muscle) return "fitness";
    
    const muscleIcons: {[key: string]: "body" | "barbell" | "fitness"} = {
      chest: "body",
      back: "body",
      legs: "body",
      arms: "body",
      shoulders: "body",
      core: "body",
      cardio: "fitness",
      default: "barbell"
    };
    
    return muscleIcons[muscle.toLowerCase()] || muscleIcons.default;
  };
  
  // Helper function to format muscle groups
  const formatMuscleGroups = (muscles?: string[] | null): string => {
    if (!muscles || muscles.length === 0) return "General";
    return muscles.join(', ');
  };
  
  // Loading state
  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor }]}>
        <ActivityIndicator size="large" color="#FF8C42" />
        <Text style={styles.loadingText}>Loading exercises...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Workout</Text>
        <View style={styles.spacer} />
      </View>
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Workout Details</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Name</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g., Upper Body Strength"
              placeholderTextColor="#777"
              value={workoutName}
              onChangeText={setWorkoutName}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Description (Optional)</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              placeholder="Describe your workout..."
              placeholderTextColor="#777"
              value={workoutDescription}
              onChangeText={setWorkoutDescription}
              multiline={true}
              numberOfLines={3}
            />
          </View>
        </View>
        
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Exercises</Text>
          
          {selectedExercises.length > 0 ? (
            <View style={styles.selectedExercisesList}>
              {selectedExercises.map((item, index) => (
                <View key={`${item.exercise.id}-${index}`} style={styles.selectedExerciseItem}>
                  <View style={styles.exerciseHeader}>
                    <Text style={styles.selectedExerciseName}>{item.exercise.name}</Text>
                    <TouchableOpacity 
                      style={styles.removeButton}
                      onPress={() => removeExerciseFromWorkout(index)}
                    >
                      <Ionicons name="trash-outline" size={18} color="#FF6B6B" />
                    </TouchableOpacity>
                  </View>
                  
                  <View style={styles.exerciseControls}>
                    <View style={styles.controlGroup}>
                      <Text style={styles.controlLabel}>Sets</Text>
                      <View style={styles.counterControl}>
                        <TouchableOpacity 
                          style={styles.counterButton}
                          onPress={() => updateExerciseDetails(index, 'sets', Math.max(1, item.sets - 1))}
                        >
                          <Ionicons name="remove" size={18} color="white" />
                        </TouchableOpacity>
                        <Text style={styles.counterValue}>{item.sets}</Text>
                        <TouchableOpacity 
                          style={styles.counterButton}
                          onPress={() => updateExerciseDetails(index, 'sets', item.sets + 1)}
                        >
                          <Ionicons name="add" size={18} color="white" />
                        </TouchableOpacity>
                      </View>
                    </View>
                    
                    <View style={styles.controlGroup}>
                      <Text style={styles.controlLabel}>Reps</Text>
                      <TextInput
                        style={styles.repsInput}
                        value={item.reps}
                        onChangeText={(value) => updateExerciseDetails(index, 'reps', value)}
                        keyboardType="number-pad"
                      />
                    </View>
                    
                    <View style={styles.controlGroup}>
                      <Text style={styles.controlLabel}>Rest (sec)</Text>
                      <View style={styles.counterControl}>
                        <TouchableOpacity 
                          style={styles.counterButton}
                          onPress={() => updateExerciseDetails(
                            index, 
                            'restSeconds', 
                            Math.max(0, item.restSeconds - 15)
                          )}
                        >
                          <Ionicons name="remove" size={18} color="white" />
                        </TouchableOpacity>
                        <Text style={styles.counterValue}>{item.restSeconds}</Text>
                        <TouchableOpacity 
                          style={styles.counterButton}
                          onPress={() => updateExerciseDetails(
                            index, 
                            'restSeconds', 
                            item.restSeconds + 15
                          )}
                        >
                          <Ionicons name="add" size={18} color="white" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyExercisesContainer}>
              <Ionicons name="barbell-outline" size={48} color="#555" />
              <Text style={styles.emptyExercisesText}>No exercises added yet</Text>
            </View>
          )}
          
          <TouchableOpacity 
            style={styles.addExerciseButton}
            onPress={() => setIsExerciseModalVisible(true)}
          >
            <Ionicons name="add" size={20} color="white" />
            <Text style={styles.addExerciseText}>Add Exercise</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={handleSaveWorkout}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <>
              <Ionicons name="save-outline" size={20} color="white" />
              <Text style={styles.saveButtonText}>Save Workout</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
      
      {renderExerciseModal()}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  spacer: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  formSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: '#AAA',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#222',
    borderRadius: 8,
    padding: 12,
    color: 'white',
    fontSize: 16,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  categoryList: {
    flexDirection: 'row',
    marginHorizontal: -8,
  },
  categoryItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#222',
    marginHorizontal: 4,
  },
  categorySelected: {
    backgroundColor: '#FF8C42',
  },
  categoryText: {
    color: '#AAA',
    fontSize: 14,
  },
  categoryTextSelected: {
    color: 'white',
    fontWeight: 'bold',
  },
  emptyExercisesContainer: {
    backgroundColor: '#222',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyExercisesText: {
    color: '#777',
    marginTop: 8,
  },
  addExerciseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 12,
  },
  addExerciseText: {
    color: 'white',
    marginLeft: 8,
    fontWeight: '500',
  },
  selectedExercisesList: {
    marginBottom: 16,
  },
  selectedExerciseItem: {
    backgroundColor: '#222',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  selectedExerciseName: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  removeButton: {
    padding: 4,
  },
  exerciseControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  controlGroup: {
    flex: 1,
    alignItems: 'center',
  },
  controlLabel: {
    color: '#999',
    fontSize: 12,
    marginBottom: 4,
  },
  counterControl: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  counterButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterValue: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    marginHorizontal: 8,
    minWidth: 30,
    textAlign: 'center',
  },
  repsInput: {
    backgroundColor: '#333',
    borderRadius: 4,
    padding: 6,
    minWidth: 50,
    color: 'white',
    textAlign: 'center',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#222',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF8C42',
    borderRadius: 8,
    padding: 16,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#111',
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  modalTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222',
    borderRadius: 8,
    margin: 16,
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    padding: 10,
    color: 'white',
  },
  exerciseList: {
    maxHeight: 400,
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  exerciseIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  exerciseDetails: {
    flex: 1,
  },
  exerciseName: {
    color: 'white',
    fontSize: 16,
    marginBottom: 4,
  },
  exerciseMuscles: {
    color: '#999',
    fontSize: 12,
  },
  loadingText: {
    color: '#999',
    marginTop: 16,
  },
}); 