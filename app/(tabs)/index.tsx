import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Image, Pressable, StatusBar, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database.types';
import { useRouter } from 'expo-router';

// Define types for our data
type Profile = Database['public']['Tables']['profiles']['Row'];
type Workout = Database['public']['Tables']['workouts']['Row'];
type WorkoutExercise = Database['public']['Tables']['workout_exercises']['Row'] & {
  exercise: Database['public']['Tables']['exercises']['Row'];
};

export default function HomeScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  // State for data
  const [profile, setProfile] = useState<Profile | null>(null);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [featuredWorkout, setFeaturedWorkout] = useState<Workout | null>(null);
  const [workoutExercises, setWorkoutExercises] = useState<WorkoutExercise[]>([]);
  const [exerciseCounts, setExerciseCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Hydration and health score would come from real data in a full implementation
  const healthScore = 88;
  const hydrationAmount = 781;
  const hasNotifications = true;
  const isPro = true;

  // Format the current date
  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).toUpperCase();

  useEffect(() => {
    async function fetchUserData() {
      try {
        setLoading(true);
        
        // Get the current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');
        
        // Fetch the user's profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (profileError) throw profileError;
        setProfile(profileData);
        
        // Fetch the user's workouts
        const { data: workoutsData, error: workoutsError } = await supabase
          .from('workouts')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        if (workoutsError) throw workoutsError;
        setWorkouts(workoutsData);
        
        // Get exercise counts for each workout
        if (workoutsData.length > 0) {
          const counts: Record<string, number> = {};
          
          // Using Promise.all to run queries in parallel
          await Promise.all(workoutsData.map(async (workout) => {
            const { count, error: countError } = await supabase
              .from('workout_exercises')
              .select('*', { count: 'exact', head: true })
              .eq('workout_id', workout.id);
              
            if (!countError) {
              counts[workout.id] = count || 0;
            }
          }));
          
          setExerciseCounts(counts);
        }
        
        // Set the featured workout (most recent one)
        if (workoutsData.length > 0) {
          setFeaturedWorkout(workoutsData[0]);
          
          // Fetch workout exercises with their exercise details
          const { data: exercisesData, error: exercisesError } = await supabase
            .from('workout_exercises')
            .select(`
              *,
              exercise:exercise_id (*)
            `)
            .eq('workout_id', workoutsData[0].id)
            .order('order_index', { ascending: true });
            
          if (exercisesError) throw exercisesError;
          setWorkoutExercises(exercisesData as WorkoutExercise[]);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    }
    
    fetchUserData();
  }, []);

  // Calculate workout stats - in a real app this would come from your API
  const workoutDuration = 25; // minutes
  const workoutCalories = 412; // kcal

  // Handle loading state
  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor }]}>
        <ActivityIndicator size="large" color="#FF8C42" />
        <Text style={styles.loadingText}>Loading your fitness data...</Text>
      </View>
    );
  }

  // Handle error state
  if (error) {
    return (
      <View style={[styles.errorContainer, { backgroundColor }]}>
        <Ionicons name="alert-circle" size={48} color="#FF8C42" />
        <Text style={styles.errorText}>Error loading data</Text>
        <Text style={styles.errorMessage}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.dateContainer}>
          <Ionicons name="calendar-outline" size={18} color="#999" />
          <Text style={styles.dateText}>{currentDate}</Text>
        </View>
        
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications" size={24} color="white" />
          {hasNotifications && (
            <View style={styles.notificationBadge}>
              <Ionicons name="logo-bitcoin" size={12} color="white" />
            </View>
          )}
        </TouchableOpacity>
      </View>
      
      {/* User Section */}
      <View style={styles.userSection}>
        <View style={styles.userInfoContainer}>
          <Image 
            source={profile?.avatar_url ? { uri: profile.avatar_url } : require('@/assets/images/partial-react-logo.png')}
            style={styles.avatar}
          />
          
          <View style={styles.userInfo}>
            <Text style={styles.greeting}>Hello, {profile?.name || 'Fitness Fan'}!</Text>
            <View style={styles.healthScoreContainer}>
              <Ionicons name="add-circle" size={16} color="#FF8C42" />
              <Text style={styles.healthScore}>{healthScore}% Healthy</Text>
              <Text style={styles.separator}>•</Text>
              <Ionicons name="star" size={16} color="#4786FF" />
              <Text style={styles.proLabel}>Pro</Text>
            </View>
          </View>
        </View>
      </View>
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Fitness Metrics Section */}
        <View style={styles.metricsHeader}>
          <Text style={styles.sectionTitle}>Fitness Metrics</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.metricsContainer}>
          {/* Score Card */}
          <LinearGradient
            colors={['#FF8C42', '#FF6B42']}
            style={styles.metricCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.metricCardHeader}>
              <Text style={styles.metricTitle}>Score</Text>
              <Ionicons name="add-circle" size={24} color="white" />
            </View>
            
            <View style={styles.scoreGraphContainer}>
              {/* Simple score graph visualization */}
              {[0.2, 0.4, 0.7, 0.9, 1, 0.6, 0.3].map((height, index) => (
                <View 
                  key={index}
                  style={[
                    styles.scoreBar,
                    { height: 70 * height, opacity: 0.7 + (height * 0.3) }
                  ]}
                />
              ))}
            </View>
            
            <Text style={styles.metricValue}>{healthScore}<Text style={styles.metricUnit}>%</Text></Text>
          </LinearGradient>
          
          {/* Hydration Card */}
          <LinearGradient
            colors={['#4786FF', '#39A1FF']}
            style={styles.metricCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.metricCardHeader}>
              <Text style={styles.metricTitle}>Hydration</Text>
              <Ionicons name="water" size={24} color="white" />
            </View>
            
            <View style={styles.hydrationGraphContainer}>
              {/* Improved hydration graph visualization with SVG path-like wave */}
              <View style={styles.hydrationGraph}>
                <View style={[styles.hydrationPoint, { left: '10%', top: '50%' }]} />
                <View style={[styles.hydrationPoint, { left: '25%', top: '70%' }]} />
                <View style={[styles.hydrationPoint, { left: '40%', top: '40%' }]} />
                <View style={[styles.hydrationPoint, { left: '55%', top: '60%' }]} />
                <View style={[styles.hydrationPoint, { left: '70%', top: '30%' }]} />
                <View style={[styles.hydrationPoint, { left: '85%', top: '20%' }]} />
                <View style={styles.hydrationLine} />
              </View>
            </View>
            
            <Text style={styles.metricValue}>{hydrationAmount}<Text style={styles.metricUnit}>ml</Text></Text>
          </LinearGradient>
        </View>
        
        {/* Workouts Section */}
        <View style={styles.workoutsHeader}>
          <Text style={styles.sectionTitle}>Workouts <Text style={styles.workoutCount}>({workouts.length})</Text></Text>
          <TouchableOpacity>
            <Ionicons name="ellipsis-vertical" size={20} color="#999" />
          </TouchableOpacity>
        </View>
        
        {workouts.length > 0 ? (
          <View style={styles.workoutsList}>
            {workouts.map((workout) => (
              <View key={workout.id} style={styles.workoutCard}>
                <Image 
                  source={require('@/assets/images/partial-react-logo.png')}
                  style={styles.workoutImage}
                />
                
                <View style={styles.workoutOverlay}>
                  <View style={styles.workoutInfo}>
                    <View style={styles.workoutStatsRow}>
                      <View style={styles.workoutStat}>
                        <Ionicons name="time-outline" size={16} color="#999" />
                        <Text style={styles.workoutStatText}>{workoutDuration}min</Text>
                      </View>
                      <View style={styles.workoutStat}>
                        <Ionicons name="flame-outline" size={16} color="#999" />
                        <Text style={styles.workoutStatText}>{workoutCalories}kcal</Text>
                      </View>
                    </View>
                    
                    <Text style={styles.workoutTitle}>{workout.name}</Text>
                    <View style={styles.workoutDetails}>
                      <Text style={styles.workoutType}>
                        {exerciseCounts[workout.id] || 0} {exerciseCounts[workout.id] === 1 ? 'Exercise' : 'Exercises'}
                      </Text>
                      <View style={styles.intensityBadge}>
                        <Text style={styles.intensityText}>{workout.category || 'Intense'}</Text>
                      </View>
                    </View>
                  </View>
                  
                  <TouchableOpacity 
                    style={styles.playButton}
                    onPress={() => router.push({
                      pathname: '/workout-detail',
                      params: { workoutId: workout.id }
                    })}
                  >
                    <Ionicons name="play" size={24} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
            
            <TouchableOpacity 
              style={styles.addWorkoutButton}
              onPress={() => router.push('/create-workout')}
            >
              <Ionicons name="add-circle" size={24} color="#FF8C42" />
              <Text style={styles.addWorkoutText}>Create a new workout</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.noWorkoutsContainer}>
            <Ionicons name="fitness" size={48} color="#555" />
            <Text style={styles.noWorkoutsText}>No workouts yet</Text>
            <TouchableOpacity 
              style={styles.createWorkoutButton}
              onPress={() => router.push('/create-workout')}
            >
              <Text style={styles.createWorkoutText}>Create a Workout</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  loadingText: {
    color: '#FFF',
    marginTop: 10,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
    padding: 20,
  },
  errorText: {
    color: '#FFF',
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorMessage: {
    color: '#AAA',
    marginTop: 5,
    fontSize: 14,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    color: '#999',
    fontSize: 14,
    marginLeft: 5,
    fontWeight: '500',
  },
  notificationButton: {
    height: 50,
    width: 50,
    borderRadius: 25,
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#FF8C42',
    borderRadius: 10,
    height: 20,
    width: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  userInfo: {
    flex: 1,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  healthScoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  healthScore: {
    color: '#999',
    fontSize: 16,
    marginLeft: 5,
    fontWeight: '500',
  },
  separator: {
    color: '#555',
    marginHorizontal: 10,
  },
  proLabel: {
    color: '#999',
    fontSize: 16,
    marginLeft: 5,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  metricsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  seeAllText: {
    color: '#FF8C42',
    fontSize: 16,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  metricCard: {
    width: '48%',
    height: 180,
    borderRadius: 20,
    padding: 15,
  },
  metricCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  metricTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  metricValue: {
    color: 'white',
    fontSize: 36,
    fontWeight: 'bold',
  },
  metricUnit: {
    fontSize: 16,
    fontWeight: 'normal',
  },
  scoreGraphContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 70,
    marginBottom: 15,
  },
  scoreBar: {
    width: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 5,
  },
  hydrationGraphContainer: {
    height: 70,
    justifyContent: 'center',
    marginBottom: 15,
    position: 'relative',
  },
  hydrationGraph: {
    height: 40,
    justifyContent: 'center',
    position: 'relative',
  },
  hydrationLine: {
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 2,
    position: 'absolute',
    width: '100%',
    top: '50%',
    transform: [{ translateY: -1 }],
  },
  hydrationPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'white',
    position: 'absolute',
    zIndex: 1,
  },
  workoutsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  workoutCount: {
    color: '#777',
    fontWeight: 'normal',
  },
  workoutsList: {
    flexDirection: 'column',
  },
  workoutCard: {
    width: '100%',
    height: 220,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#222',
    marginBottom: 20,
  },
  workoutImage: {
    width: '100%',
    height: '100%',
    opacity: 0.7,
  },
  workoutOverlay: {
    ...StyleSheet.absoluteFillObject,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  workoutInfo: {
    flex: 1,
  },
  workoutStatsRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  workoutStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  workoutStatText: {
    color: '#CCC',
    marginLeft: 5,
  },
  workoutTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  workoutDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  workoutType: {
    color: '#CCC',
    marginRight: 10,
  },
  intensityBadge: {
    backgroundColor: '#333',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  intensityText: {
    color: '#CCC',
    fontSize: 12,
  },
  playButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF8C42',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noWorkoutsContainer: {
    height: 220,
    backgroundColor: '#222',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noWorkoutsText: {
    color: '#AAA',
    fontSize: 18,
    marginTop: 10,
    marginBottom: 20,
  },
  createWorkoutButton: {
    backgroundColor: '#FF8C42',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  createWorkoutText: {
    color: 'white',
    fontWeight: '600',
  },
  addWorkoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    backgroundColor: '#222',
    borderRadius: 10,
    marginBottom: 20,
  },
  addWorkoutText: {
    color: '#FF8C42',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
});
