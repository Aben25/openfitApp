import React, { useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity,
  ImageBackground
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';
import { useRestTimer } from '@/hooks/useRestTimer';

interface WorkoutRestTimerProps {
  initialSeconds: number;
  onComplete: () => void;
  onSkip: () => void;
  onPrevious?: () => void;
  onEndWorkout?: () => void;
  exerciseImage?: string;
  nextExerciseName?: string;
}

const WorkoutRestTimer: React.FC<WorkoutRestTimerProps> = ({
  initialSeconds,
  onComplete,
  onSkip,
  onPrevious,
  onEndWorkout,
  exerciseImage,
  nextExerciseName
}) => {
  const insets = useSafeAreaInsets();
  
  // Use our timer hook
  const {
    seconds,
    isPaused,
    isComplete,
    progress,
    togglePause,
    skipTimer,
    addTime
  } = useRestTimer({
    initialSeconds,
    onTimerComplete: onComplete,
    autoStart: true
  });
  
  // Handle auto-complete
  useEffect(() => {
    if (isComplete) {
      onComplete();
    }
  }, [isComplete, onComplete]);
  
  // Calculate circle values
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);
  
  return (
    <View style={styles.container}>
      {/* Rest timer content */}
      <View style={styles.timerContainer}>
        {/* Video/exercise preview */}
        <View style={styles.videoPreview}>
          {exerciseImage ? (
            <ImageBackground 
              source={{ uri: exerciseImage }} 
              style={styles.videoContainer}
              resizeMode="cover"
            >
              <LinearGradient
                colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.2)']}
                style={styles.videoGradient}
              />
              {nextExerciseName && (
                <Text style={styles.nextExerciseText}>
                  Next: {nextExerciseName}
                </Text>
              )}
            </ImageBackground>
          ) : (
            <View style={styles.videoContainer}>
              <View style={styles.exerciseImagePlaceholder} />
              {nextExerciseName && (
                <Text style={styles.nextExerciseText}>
                  Next: {nextExerciseName}
                </Text>
              )}
            </View>
          )}
        </View>
        
        {/* Rest label */}
        <Text style={styles.restLabel}>
          Rest {initialSeconds} Seconds
        </Text>
        
        {/* Timer circle */}
        <View style={styles.timerCircleWrapper}>
          <View style={styles.timerControlsRow}>
            {/* 10 seconds button on left */}
            <TouchableOpacity 
              style={styles.secondsButtonContainer}
              onPress={() => addTime(10)}
            >
              <Ionicons name="time-outline" size={18} color="#FFFFFF" style={styles.secondsButtonIcon} />
              <Text style={styles.secondsButtonText}>10</Text>
            </TouchableOpacity>
            
            {/* Timer circle */}
            <View style={styles.timerCircleContainer}>
              <Svg height="100" width="100" viewBox="0 0 100 100">
                {/* Background circle */}
                <Circle
                  cx="50"
                  cy="50"
                  r={radius}
                  stroke="#333333"
                  strokeWidth="6"
                  fill="#262626"
                />
                
                {/* Progress circle */}
                <Circle
                  cx="50"
                  cy="50"
                  r={radius}
                  stroke="#FF4E50"
                  strokeWidth="6"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  rotation="-90"
                  origin="50, 50"
                />
                
                {/* Timer text */}
                <SvgText
                  fill="#FFFFFF"
                  fontSize="40"
                  fontWeight="bold"
                  x="50"
                  y="50"
                  textAnchor="middle"
                  alignmentBaseline="central"
                >
                  {seconds.toString()}
                </SvgText>
                
                {/* SEC text */}
                <SvgText
                  fill="#BBBBBB"
                  fontSize="12"
                  x="50"
                  y="70"
                  textAnchor="middle"
                  alignmentBaseline="middle"
                >
                  SEC
                </SvgText>
              </Svg>
            </View>
            
            {/* 10 seconds button on right */}
            <TouchableOpacity 
              style={styles.secondsButtonContainer}
              onPress={() => addTime(10)}
            >
              <Ionicons name="time-outline" size={18} color="#FFFFFF" style={styles.secondsButtonIcon} />
              <Text style={styles.secondsButtonText}>10</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Control buttons */}
        <View style={styles.controlsContainer}>
          {/* Previous button */}
          <TouchableOpacity 
            style={styles.controlButton} 
            onPress={onPrevious}
            disabled={!onPrevious}
          >
            <Ionicons 
              name="play-skip-back" 
              size={30} 
              color={onPrevious ? "#FFFFFF" : "rgba(150, 150, 150, 0.5)"} 
            />
          </TouchableOpacity>
          
          {/* Play/Pause button */}
          <TouchableOpacity 
            style={styles.playPauseButton} 
            onPress={togglePause}
            activeOpacity={0.7}
          >
            <Ionicons 
              name={isPaused ? "play" : "pause"} 
              size={34} 
              color="#FFFFFF" 
            />
          </TouchableOpacity>
          
          {/* Next button */}
          <TouchableOpacity 
            style={styles.controlButton} 
            onPress={skipTimer}
          >
            <Ionicons name="play-skip-forward" size={30} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        
        {/* End workout button */}
        <TouchableOpacity 
          style={styles.endWorkoutButton}
          onPress={onEndWorkout}
        >
          <Text style={styles.endWorkoutText}>End workout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  timerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    width: '100%',
  },
  videoPreview: {
    width: '100%',
    height: 240,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
  },
  videoContainer: {
    flex: 1,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  exerciseImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#313131',
  },
  videoGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%',
  },
  nextExerciseText: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  restLabel: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
    color: '#FFFFFF',
  },
  timerCircleWrapper: {
    marginVertical: 20,
    alignItems: 'center',
    width: '100%',
  },
  timerControlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
  },
  secondsButtonContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#262626',
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondsButtonIcon: {
    position: 'absolute',
    top: 2,
    left: 11,
  },
  secondsButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10,
  },
  timerCircleContainer: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 10,
    marginBottom: 30,
    backgroundColor: '#262626',
    borderRadius: 30,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  controlButton: {
    padding: 12,
  },
  playPauseButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(150, 150, 150, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 30,
  },
  endWorkoutButton: {
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 30,
    backgroundColor: '#FFEDB3',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  endWorkoutText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default WorkoutRestTimer; 