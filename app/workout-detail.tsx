import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useLocalSearchParams, useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import { LinearGradient } from "expo-linear-gradient";
import Header from "@/components/Header";

export default function WorkoutDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { workoutId } = useLocalSearchParams();

  // State
  const [workout, setWorkout] = useState<{ id: string; name: string } | null>(
    null
  );
  const [exercises, setExercises] = useState<
    {
      id: any;
      sets: any;
      reps: any;
      rest_interval: any;
      exercises: { id: any; name: any; description: any };
    }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data (replace with actual data from API)
  const totalExercises = 25;
  const duration = 58; // minutes
  const calories = 254; // kcal
  const sets = "3x4";
  const trainer = "Azunyan U. Wu";

  // Fetch workout data
  useEffect(() => {
    async function fetchWorkoutData() {
      try {
        setLoading(true);

        // Fetch workout details
        const { data: workoutData, error: workoutError } = await supabase
          .from("workouts")
          .select("*")
          .eq("id", workoutId)
          .single();

        if (workoutError) throw workoutError;

        setWorkout(workoutData);

        // Fetch exercises for this workout
        const { data: exercisesData, error: exercisesError } = await supabase
          .from("workout_exercises")
          .select(
            `
            id,
            sets,
            reps,
            rest_interval,
            exercises (
              id,
              name,
              description
            )
          `
          )
          .eq("workout_id", workoutId)
          .order("order_index", { ascending: true });

        if (exercisesError) throw exercisesError;

        setExercises(
          (exercisesData || []).map((exercise) => ({
            ...exercise,
            exercises: exercise.exercises[0], // Assuming the first item is the relevant one
          }))
        );
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    }

    if (workoutId) {
      fetchWorkoutData();
    } else {
      setLoading(false);
      setError("No workout ID provided");
    }
  }, [workoutId]);

  // Handle start workout button press
  const handleStartWorkout = () => {
    router.push(`/workout-active?workoutId=${workoutId}`);
  };

  // Loading state
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF8C42" />
        <Text style={styles.loadingText}>Loading workout details...</Text>
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={64} color="#FF4949" />
        <Text style={styles.errorText}>Something went wrong</Text>
        <Text style={styles.errorMessage}>{error}</Text>
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
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Background Image */}
      <Image
        source={{
          uri: "https://images.unsplash.com/photo-1526401485004-46910ecc8e51?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
        }}
        style={[styles.backgroundImage, { opacity: 0.9 }]}
        resizeMode="cover"
      />

      {/* Overlay Gradient */}
      <LinearGradient
        colors={["rgba(0,0,0,0.3)", "rgba(0,0,0,0.5)", "rgba(0,0,0,0.8)"]}
        style={styles.gradient}
      />

      {/* Header */}
      <Header
        title={workout?.name || "Workout Detail"}
        showBackButton={true}
        rightIcon="ellipsis-horizontal"
        onRightPress={() => console.log("Settings pressed")}
        transparent={true}
        light={true}
      />

      {/* Content */}
      <View style={[styles.content, { paddingBottom: insets.bottom }]}>
        {/* Total Exercises Badge */}
        <View style={styles.totalBadge}>
          <Text style={styles.totalText}>{exercises.length || 1} Total</Text>
        </View>

        {/* Workout Title */}
        <Text style={styles.workoutTitle}>{workout?.name || "Test Ben 3"}</Text>
        <Text style={styles.trainerName}>With {trainer}</Text>

        {/* Workout Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Ionicons name="time" size={24} color="white" />
            <Text style={styles.statValue}>{duration}min</Text>
            <Text style={styles.statLabel}>Time</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <Ionicons name="flame" size={24} color="white" />
            <Text style={styles.statValue}>{calories}kcal</Text>
            <Text style={styles.statLabel}>Calorie</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <Ionicons name="sync" size={24} color="white" />
            <Text style={styles.statValue}>{sets}</Text>
            <Text style={styles.statLabel}>Sets</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.startButton}
            onPress={handleStartWorkout}
          >
            <Text style={styles.startButtonText}>Start Workout</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.saveButton}>
            <Ionicons name="heart-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  loadingText: {
    color: "white",
    marginTop: 12,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
    padding: 20,
  },
  errorText: {
    color: "white",
    marginTop: 12,
    fontSize: 18,
    fontWeight: "bold",
  },
  errorMessage: {
    color: "#AAA",
    marginTop: 8,
    fontSize: 14,
    textAlign: "center",
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  headerContainer: {
    paddingHorizontal: 10,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  content: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 20,
  },
  totalBadge: {
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 30,
    marginBottom: 16,
  },
  totalText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  workoutTitle: {
    color: "white",
    fontSize: 48,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  trainerName: {
    color: "#CCC",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 30,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(30,30,30,0.6)",
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    color: "#BBB",
    fontSize: 16,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#444",
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  startButton: {
    flex: 1,
    height: 60,
    backgroundColor: "#FF8C42",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  startButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  saveButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(128,128,128,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  retryButton: {
    marginTop: 20,
    paddingHorizontal: 30,
    paddingVertical: 12,
    backgroundColor: "#FF8C42",
    borderRadius: 30,
  },
  retryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
