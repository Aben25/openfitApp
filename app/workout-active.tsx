import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  StatusBar, 
  ActivityIndicator, 
  Alert,
  TextInput,
  ScrollView,
  Modal,
  Dimensions,
  Linking,
  AccessibilityInfo
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Video, ResizeMode } from 'expo-av';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import { useWorkoutState } from '@/hooks/useWorkoutState';
import * as Haptics from 'expo-haptics';
import WorkoutRestTimer from '@/components/WorkoutRestTimer';

// Add type definitions at the top of the file
interface Workout {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  rating?: number;
  // Add other properties as needed
}

interface Exercise {
  id: string;
  name: string;
  description?: string;
  video_url?: string;
  image_url?: string;
  instructions?: string;
  // Add other exercise properties as needed
}

interface WorkoutExercise {
  id: string;
  workout_id: string;
  exercise_id: string;
  sets: number;
  reps?: number;
  exercise: Exercise;
  // Add other workout exercise properties as needed
}

// Input validation
const validateSetInput = (value: string, field: 'weight' | 'reps'): boolean => {
  const num = parseInt(value);
  if (field === 'weight') {
    return num >= 0 && num <= 1000; // reasonable weight range
  }
  return num > 0 && num <= 100; // reasonable rep range
};

interface WorkoutState {
  workout: Workout | null;
  exercises: WorkoutExercise[];
  currentExerciseIndex: number;
  completedSets: { [key: string]: boolean[] };
  setInputValues: { [key: string]: { weight: string; reps: string }[] };
  workoutLogId: string | null;
  workoutStartTime: Date | null;
  workoutElapsedTime: number;
  isResting: boolean;
  restTimer: number;
  isSaving: boolean;
  offlineQueue: any[];
  loading: boolean;
  error: string | null;
  // Function properties
  updateSetInputValue: (exerciseId: string, setIndex: number, field: 'weight' | 'reps', value: string) => void;
  setRestTimer: (time: number) => void;
  setIsResting: (isResting: boolean) => void;
  setCurrentExerciseIndex: (index: number) => void;
  completeSet: (exerciseId: string, setIndex: number) => Promise<void>;
  setState: React.Dispatch<React.SetStateAction<WorkoutState>>;
  fetchWorkoutDetails: () => Promise<void>;
}

const initialWorkoutState: WorkoutState = {
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
  isSaving: false,
  offlineQueue: [],
  loading: true,
  error: null,
  // Initialize function properties
  updateSetInputValue: () => {},
  setRestTimer: () => {},
  setIsResting: () => {},
  setCurrentExerciseIndex: () => {},
  completeSet: async () => {},
  setState: () => {},
  fetchWorkoutDetails: async () => {}
};

const LoadingSpinner = () => (
  <View style={styles.videoLoadingContainer}>
    <ActivityIndicator size="large" color="#FF8C42" />
    <Text style={styles.videoLoadingText}>Loading video...</Text>
  </View>
);

export default function WorkoutActiveScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { workoutId } = useLocalSearchParams();
  const videoRef = useRef<Video | null>(null);
  
  // Additional state variables
  const [isPaused, setIsPaused] = useState(false);
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [workoutRating, setWorkoutRating] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [useWebView, setUseWebView] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Use our new workout state hook
  const {
    workout,
    exercises,
    currentExerciseIndex,
    completedSets,
    setInputValues,
    workoutLogId,
    workoutStartTime,
    workoutElapsedTime,
    isResting,
    restTimer,
    loading,
    error,
    completeSet,
    setState,
    fetchWorkoutDetails
  } = useWorkoutState(workoutId as string);
  
  // Custom action functions for workout state management
  const updateSetInputValue = useCallback((exerciseId: string, setIndex: number, field: 'weight' | 'reps', value: string) => {
    setState(prev => ({
      ...prev,
      setInputValues: {
        ...prev.setInputValues,
        [exerciseId]: prev.setInputValues[exerciseId].map((set, idx) => 
          idx === setIndex ? { ...set, [field]: value } : set
        )
      }
    }));
  }, [setState]);

  const setRestTimer = useCallback((time: number) => {
    setState(prev => ({
      ...prev,
      restTimer: time
    }));
  }, [setState]);

  const setIsResting = useCallback((rest: boolean) => {
    setState(prev => ({
      ...prev,
      isResting: rest
    }));
  }, [setState]);

  const setCurrentExerciseIndex = useCallback((index: number) => {
    setState(prev => ({
      ...prev,
      currentExerciseIndex: index
    }));
  }, [setState]);

  // Initialize workout
  useEffect(() => {
    fetchWorkoutDetails().catch(err => {
      console.error('Failed to fetch workout details:', err);
    });
  }, [fetchWorkoutDetails]);

  // Rest timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isResting && restTimer > 0 && !isPaused) {
      interval = setInterval(() => {
        setState(prev => ({
          ...prev,
          restTimer: prev.restTimer - 1
        }));
      }, 1000);
    } else if (isResting && restTimer === 0) {
      setIsResting(false);
      
      // Haptic feedback
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      // Alert user
      Alert.alert('Rest Complete', 'Time to continue your workout!');
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isResting, restTimer, isPaused, setState, setIsResting]);
  
  // Add handler function for pause/resume
  const handlePauseResumeRest = useCallback(() => {
    setIsPaused(!isPaused);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [isPaused]);
  
  // Memoized values
  const currentExercise = useMemo(() => 
    exercises[currentExerciseIndex]?.exercise,
    [exercises, currentExerciseIndex]
  );
  
  const currentWorkoutExercise = useMemo(() => 
    exercises[currentExerciseIndex],
    [exercises, currentExerciseIndex]
  );
  
  const currentCompletedSets = useMemo(() => 
    currentWorkoutExercise ? 
      (completedSets[currentWorkoutExercise.id] || []).filter(Boolean).length : 0,
    [completedSets, currentWorkoutExercise]
  );
  
  const totalSets = useMemo(() => 
    currentWorkoutExercise?.sets || 3,
    [currentWorkoutExercise]
  );
  
  // Format elapsed time as mm:ss
  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);
  
  // Video handling
  const handleOpenVideo = useCallback(async () => {
    let rawVideoUrl = currentExercise?.video_url || '';
    
    if (!rawVideoUrl) {
      Alert.alert('No Video', 'This exercise does not have a video demonstration');
      return;
    }
    
    if (rawVideoUrl.includes('vimeo.com')) {
      setUseWebView(true);
      const vimeoId = rawVideoUrl.split('/').pop();
      if (vimeoId && /^\d+$/.test(vimeoId)) {
        rawVideoUrl = `https://player.vimeo.com/video/${vimeoId}?autoplay=1`;
      }
    } else {
      setUseWebView(false);
    }
    
    setVideoUrl(rawVideoUrl);
    setVideoModalVisible(true);
    setIsVideoLoading(true);
    setVideoError(null);
    
    if (useWebView) {
      setTimeout(() => setIsVideoLoading(false), 500);
      return;
    }
    
    try {
      if (videoRef.current) {
        await videoRef.current.unloadAsync();
        await new Promise(resolve => setTimeout(resolve, 500));
        await videoRef.current.loadAsync({ uri: rawVideoUrl }, {}, false);
        await videoRef.current.playAsync();
      }
    } catch (error) {
      console.error('Error loading video:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setVideoError('Failed to load video: ' + errorMessage);
      
      if (!rawVideoUrl.includes('vimeo.com')) {
        setTimeout(() => {
          setUseWebView(true);
          setIsVideoLoading(false);
          setVideoError(null);
        }, 1000);
      }
    } finally {
      setIsVideoLoading(false);
    }
  }, [currentExercise, useWebView]);
  
  const handleCloseVideo = useCallback(async () => {
    if (videoRef.current) {
      await videoRef.current.pauseAsync();
    }
    setVideoModalVisible(false);
  }, []);
  
  // Set management
  const handleAddSet = useCallback(async () => {
    if (!currentWorkoutExercise) return;
    
    try {
      setState(prev => ({
        ...prev,
        completedSets: {
          ...prev.completedSets,
          [currentWorkoutExercise.id]: [...(prev.completedSets[currentWorkoutExercise.id] || []), false]
        },
        setInputValues: {
          ...prev.setInputValues,
          [currentWorkoutExercise.id]: [
            ...(prev.setInputValues[currentWorkoutExercise.id] || []),
            { weight: '0', reps: '10' }
          ]
        }
      }));
      
      await supabase
        .from('workout_exercises')
        .update({ sets: (completedSets[currentWorkoutExercise.id]?.length || 0) + 1 })
        .eq('id', currentWorkoutExercise.id);
        
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Set Added', 'A new set has been added to this exercise');
    } catch (err) {
      console.error('Error adding set:', err);
      Alert.alert('Error', 'Failed to add set');
    }
  }, [currentWorkoutExercise, completedSets, setState]);
  
  const handleRemoveSet = useCallback(async () => {
    if (!currentWorkoutExercise) return;
    const currentSets = completedSets[currentWorkoutExercise.id] || [];
    
    if (currentSets.length <= 1) {
      Alert.alert('Cannot Remove', 'An exercise must have at least one set');
      return;
    }
    
    if (currentSets[currentSets.length - 1]) {
      Alert.alert('Cannot Remove', 'Cannot remove a completed set');
      return;
    }
    
    try {
      setState(prev => ({
        ...prev,
        completedSets: {
          ...prev.completedSets,
          [currentWorkoutExercise.id]: prev.completedSets[currentWorkoutExercise.id].slice(0, -1)
        },
        setInputValues: {
          ...prev.setInputValues,
          [currentWorkoutExercise.id]: prev.setInputValues[currentWorkoutExercise.id].slice(0, -1)
        }
      }));
      
      await supabase
        .from('workout_exercises')
        .update({ sets: currentSets.length - 1 })
        .eq('id', currentWorkoutExercise.id);
        
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (err) {
      console.error('Error removing set:', err);
      Alert.alert('Error', 'Failed to remove set');
    }
  }, [currentWorkoutExercise, completedSets, setState]);
  
  // Complete workout
  const completeWorkout = useCallback(async () => {
    try {
      if (workoutLogId) {
        await supabase
          .from('workout_logs')
          .update({ 
            completed_at: new Date().toISOString(),
            notes: 'Workout completed successfully',
            duration: workoutElapsedTime,
            rating: workoutRating
          })
          .eq('id', workoutLogId);
        
        if (workoutRating > 0) {
          await supabase
            .from('workouts')
            .update({ rating: workoutRating })
            .eq('id', workoutId);
        }
          
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert('Workout Complete!', 'Great job! Your workout has been recorded.', [
          { 
            text: 'Return Home', 
            onPress: () => router.push('/(tabs)') 
          }
        ]);
      }
    } catch (err) {
      console.error('Error completing workout:', err);
      Alert.alert('Error', 'Failed to record workout completion');
    }
  }, [workoutLogId, workoutElapsedTime, workoutRating, workoutId, router]);
  
  // Get the next exercise for the rest timer
  const nextExercise = useMemo(() => {
    if (currentExerciseIndex < exercises.length - 1) {
      return exercises[currentExerciseIndex + 1]?.exercise;
    }
    return null;
  }, [currentExerciseIndex, exercises]);
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF8C42" />
        <Text style={styles.loadingText}>Preparing your workout...</Text>
      </View>
    );
  }
  
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={48} color="#FF8C42" />
        <Text style={styles.errorText}>Error loading workout</Text>
        <Text style={styles.errorMessage}>{error}</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <Header 
        title={workout?.name || 'Active Workout'}
        showBackButton={true}
        rightIcon="options"
        onRightPress={() => console.log('Options pressed')}
        transparent={false}
        containerStyle={styles.headerContainer}
        titleStyle={styles.headerTitle}
        backButtonStyle={styles.headerButton}
        rightButtonStyle={styles.headerButton}
      />
      
      {/* Workout Duration Bar */}
      <View style={styles.durationContainer}>
        <View style={styles.durationContent}>
          <Ionicons name="time-outline" size={18} color="#FF8C42" />
          <Text style={styles.durationText}>{formatTime(workoutElapsedTime)}</Text>
        </View>
      </View>
      
      {/* Show rest timer if currently resting */}
      {isResting ? (
        <WorkoutRestTimer
          initialSeconds={60} // Default rest time in seconds
          onComplete={() => {
            setIsResting(false);
            setRestTimer(0);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }}
          onSkip={() => {
            setIsResting(false);
            setRestTimer(0);
          }}
          onPrevious={currentExerciseIndex > 0 ? () => {
            setRestTimer(0);
            setIsResting(false);
            setCurrentExerciseIndex(currentExerciseIndex - 1);
          } : undefined}
          onEndWorkout={() => {
            Alert.alert(
              'End Workout',
              'Are you sure you want to end this workout?',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'End', style: 'destructive', onPress: () => setShowRatingModal(true) }
              ]
            );
          }}
          exerciseImage={currentExercise?.image_url}
          nextExerciseName={nextExercise?.name}
        />
      ) : (
        /* Workout Content */
        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          {exercises.length > 0 ? (
            <>
              <View style={styles.progressContainer}>
                <Text style={styles.progressText}>
                  Exercise {currentExerciseIndex + 1} of {exercises.length}
                </Text>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { width: `${((currentExerciseIndex + 1) / exercises.length) * 100}%` }
                    ]} 
                  />
                </View>
              </View>
              
              <View style={styles.exerciseContainer}>
                <Text style={styles.exerciseName}>{currentExercise?.name || 'Unknown Exercise'}</Text>
                
                <View style={styles.setsContainer}>
                  <Text style={styles.setsText}>
                    {currentCompletedSets} / {totalSets} sets completed
                  </Text>
                </View>
                
                {/* Video Preview Button */}
                {currentExercise?.video_url && (
                  <View style={styles.videoButtonsContainer}>
                    <TouchableOpacity 
                      style={styles.videoButton}
                      onPress={handleOpenVideo}
                    >
                      <Ionicons name="play-circle" size={28} color="white" />
                      <Text style={styles.videoButtonText}>Watch Demo</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={styles.browserButton}
                      onPress={() => {
                        const url = currentExercise?.video_url;
                        if (url) {
                          Linking.openURL(url);
                        }
                      }}
                    >
                      <Ionicons name="open-outline" size={24} color="white" />
                      <Text style={styles.videoButtonText}>Open in Browser</Text>
                    </TouchableOpacity>
                  </View>
                )}
                
                {/* Progress indicators for sets */}
                <View style={styles.setProgressContainer}>
                  {currentWorkoutExercise && Array.from({ length: totalSets }).map((_, idx) => (
                    <View 
                      key={idx}
                      style={[
                        styles.setIndicator,
                        completedSets[currentWorkoutExercise.id] && 
                        completedSets[currentWorkoutExercise.id][idx] ? 
                          styles.setCompleted : styles.setIncomplete
                      ]}
                    />
                  ))}
                </View>
                
                {/* Current set input */}
                {currentWorkoutExercise && (
                  <View style={styles.currentSetCard}>
                    <View style={styles.setTitleContainer}>
                      <Text style={styles.currentSetTitle}>
                        Current Set: {currentCompletedSets + 1} / {totalSets}
                      </Text>
                      <View style={styles.setControlsContainer}>
                        <TouchableOpacity 
                          style={styles.setControlButton}
                          onPress={handleRemoveSet}
                        >
                          <Ionicons name="remove-circle" size={24} color="#FF8C42" />
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={styles.setControlButton}
                          onPress={handleAddSet}
                        >
                          <Ionicons name="add-circle" size={24} color="#4CAF50" />
                        </TouchableOpacity>
                      </View>
                    </View>
                    
                    <View style={styles.inputRow}>
                      <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Weight</Text>
                        <View style={styles.inputContainer}>
                          <TextInput
                            style={styles.input}
                            value={setInputValues[currentWorkoutExercise.id]?.[currentCompletedSets]?.weight || '0'}
                            onChangeText={(value) => updateSetInputValue(
                              currentWorkoutExercise.id, 
                              currentCompletedSets, 
                              'weight', 
                              value
                            )}
                            keyboardType="numeric"
                          />
                          <Text style={styles.inputUnit}>lbs</Text>
                        </View>
                      </View>
                      
                      <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Reps</Text>
                        <View style={styles.inputContainer}>
                          <TextInput
                            style={styles.input}
                            value={setInputValues[currentWorkoutExercise.id]?.[currentCompletedSets]?.reps || '10'}
                            onChangeText={(value) => updateSetInputValue(
                              currentWorkoutExercise.id, 
                              currentCompletedSets, 
                              'reps', 
                              value
                            )}
                            keyboardType="numeric"
                          />
                          <Text style={styles.inputUnit}>reps</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                )}
              </View>
              
              <View style={styles.controlsContainer}>
                <TouchableOpacity 
                  style={styles.controlButton}
                  onPress={() => setCurrentExerciseIndex(Math.max(0, currentExerciseIndex - 1))}
                  disabled={currentExerciseIndex === 0}
                >
                  <Ionicons 
                    name="chevron-back-circle" 
                    size={36} 
                    color={currentExerciseIndex === 0 ? "#555" : "white"} 
                  />
                  <Text style={styles.controlText}>Previous</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.completeButton,
                    (isSaving || isResting) && styles.disabledButton
                  ]}
                  onPress={completeSet}
                  disabled={isSaving || isResting}
                >
                  {isSaving ? (
                    <ActivityIndicator size="small" color="#4CAF50" />
                  ) : (
                    <Ionicons name="checkmark-circle" size={48} color={isResting ? "#555" : "#4CAF50"} />
                  )}
                  <Text style={[styles.completeText, isResting && styles.disabledText]}>
                    {isResting ? 'Resting...' : 'Complete Set'}
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.controlButton}
                  onPress={() => {
                    if (currentExerciseIndex < exercises.length - 1) {
                      setCurrentExerciseIndex(currentExerciseIndex + 1);
                    } else {
                      setShowRatingModal(true);
                    }
                  }}
                >
                  <Ionicons name="chevron-forward-circle" size={36} color="white" />
                  <Text style={styles.controlText}>
                    {currentExerciseIndex < exercises.length - 1 ? 'Next' : 'Finish'}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="fitness" size={64} color="#555" />
              <Text style={styles.emptyText}>No exercises found in this workout</Text>
              <TouchableOpacity 
                style={styles.returnButton}
                onPress={() => router.push('/(tabs)')}
              >
                <Text style={styles.returnButtonText}>Return to Home</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      )}
      
      {/* Video Modal */}
      <Modal
        visible={videoModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCloseVideo}
      >
        <View style={styles.modalContainer}>
          <View style={styles.videoContainer}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleCloseVideo}
            >
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
            
            {isVideoLoading && (
              <View style={styles.videoLoadingContainer}>
                <ActivityIndicator size="large" color="#FF8C42" />
                <Text style={styles.videoLoadingText}>Loading video...</Text>
              </View>
            )}
            
            {videoError && (
              <View style={styles.videoErrorContainer}>
                <Ionicons name="alert-circle" size={48} color="#FF8C42" />
                <Text style={styles.videoErrorText}>{videoError}</Text>
                
                <TouchableOpacity 
                  style={styles.retryButton}
                  onPress={() => {
                    const url = currentExercise?.video_url;
                    if (url) {
                      Linking.openURL(url);
                      handleCloseVideo();
                    }
                  }}
                >
                  <Text style={styles.retryButtonText}>Open in Browser</Text>
                  <Ionicons name="open-outline" size={18} color="#fff" style={{marginLeft: 5}} />
                </TouchableOpacity>
              </View>
            )}
            
            {useWebView ? (
              <WebView
                source={{
                  uri: videoUrl || '',
                  headers: { Accept: 'application/json' }
                }}
                style={styles.video}
                onLoadStart={() => setIsVideoLoading(true)}
                onLoadEnd={() => setIsVideoLoading(false)}
                renderLoading={() => <LoadingSpinner />}
              />
            ) : (
              <Video
                ref={videoRef}
                source={{ uri: videoUrl || '' }}
                style={styles.video}
                resizeMode={ResizeMode.CONTAIN}
                shouldPlay
                useNativeControls
              />
            )}
          </View>
        </View>
      </Modal>
      
      {/* Rating Modal */}
      <Modal
        visible={showRatingModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowRatingModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingTitle}>Rate Your Workout</Text>
            <Text style={styles.ratingSubtitle}>How difficult was this workout?</Text>
            
            <View style={styles.ratingStars}>
              {[1, 2, 3, 4, 5].map(rating => (
                <TouchableOpacity
                  key={rating}
                  onPress={() => setWorkoutRating(rating)}
                >
                  <Ionicons
                    name={rating <= workoutRating ? "star" : "star-outline"}
                    size={40}
                    color="#FF8C42"
                    style={styles.ratingStar}
                  />
                </TouchableOpacity>
              ))}
            </View>
            
            <TouchableOpacity
              style={styles.completeWorkoutButton}
              onPress={completeWorkout}
            >
              <Text style={styles.completeWorkoutButtonText}>Complete Workout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const { width } = Dimensions.get('window');

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
  durationContainer: {
    backgroundColor: 'rgba(40, 40, 40, 0.8)',
    paddingVertical: 8,
    alignItems: 'center',
  },
  durationContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  durationText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressText: {
    color: '#CCC',
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#333',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF8C42',
    borderRadius: 4,
  },
  exerciseContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  exerciseName: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  setsContainer: {
    backgroundColor: '#333',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 20,
  },
  setsText: {
    color: 'white',
    fontSize: 18,
  },
  videoButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  videoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF8C42',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginLeft: 12,
  },
  videoButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  setProgressContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  setIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  setCompleted: {
    backgroundColor: '#4CAF50',
  },
  setIncomplete: {
    backgroundColor: '#555',
  },
  timerContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(40, 40, 40, 0.8)',
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    width: '100%',
    borderWidth: 1,
    borderColor: '#FF8C42',
  },
  timerText: {
    color: '#FF8C42',
    fontSize: 60,
    fontWeight: 'bold',
  },
  timerLabel: {
    color: '#999',
    fontSize: 16,
  },
  instructionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  instructionsText: {
    color: '#CCC',
    fontSize: 16,
    textAlign: 'center',
  },
  currentSetCard: {
    backgroundColor: '#222',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    marginBottom: 20,
  },
  currentSetTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputGroup: {
    flex: 1,
    marginHorizontal: 10,
  },
  inputLabel: {
    color: '#AAA',
    fontSize: 14,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  inputUnit: {
    color: '#AAA',
    fontSize: 14,
    marginLeft: 4,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  controlButton: {
    alignItems: 'center',
  },
  controlText: {
    color: '#CCC',
    marginTop: 5,
    fontSize: 14,
  },
  completeButton: {
    alignItems: 'center',
  },
  completeText: {
    color: '#4CAF50',
    marginTop: 5,
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.5,
  },
  disabledText: {
    color: '#555',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: 400,
  },
  emptyText: {
    color: '#CCC',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 30,
  },
  returnButton: {
    backgroundColor: '#FF8C42',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  returnButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  videoContainer: {
    width: '90%',
    height: width * 0.7, // Make video container more proportional
    backgroundColor: '#000',
    position: 'relative',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
  },
  video: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 8,
  },
  videoLoadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  videoLoadingText: {
    color: 'white',
    marginTop: 12,
  },
  videoErrorContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  videoErrorText: {
    color: 'white',
    marginTop: 12,
  },
  ratingContainer: {
    backgroundColor: '#222',
    borderRadius: 20,
    padding: 24,
    width: width * 0.8,
    alignItems: 'center',
  },
  ratingTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  ratingSubtitle: {
    color: '#CCC',
    fontSize: 16,
    marginBottom: 24,
  },
  ratingStars: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  ratingStar: {
    marginHorizontal: 8,
  },
  completeWorkoutButton: {
    backgroundColor: '#FF8C42',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
  },
  completeWorkoutButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerContainer: {
    backgroundColor: '#1a1a1a',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  headerButton: {
    backgroundColor: 'rgba(255,140,66,0.2)',
  },
  skipTimerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF8C42',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 15,
  },
  skipTimerText: {
    color: '#fff',
    fontWeight: 'bold',
    marginRight: 5,
  },
  setTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  setControlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  setControlButton: {
    padding: 5,
    marginLeft: 10,
  },
  retryButton: {
    backgroundColor: '#FF8C42',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 16,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  browserButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#444',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginLeft: 12,
  },
}); 