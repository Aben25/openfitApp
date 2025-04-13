import { useState, useEffect, useCallback } from 'react';
import * as Haptics from 'expo-haptics';

interface UseRestTimerProps {
  initialSeconds: number;
  onTimerComplete?: () => void;
  autoStart?: boolean;
}

interface UseRestTimerReturn {
  seconds: number;
  isPaused: boolean;
  isComplete: boolean;
  progress: number;
  resetTimer: (newSeconds?: number) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  togglePause: () => void;
  skipTimer: () => void;
  addTime: (secondsToAdd: number) => void;
}

export function useRestTimer({
  initialSeconds,
  onTimerComplete,
  autoStart = true
}: UseRestTimerProps): UseRestTimerReturn {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isPaused, setIsPaused] = useState(!autoStart);
  const [isComplete, setIsComplete] = useState(false);
  
  // Calculate progress (0-1)
  const progress = Math.max(0, Math.min(1, 1 - seconds / initialSeconds));

  // Main timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (!isPaused && seconds > 0) {
      interval = setInterval(() => {
        setSeconds(prev => {
          const newValue = prev - 1;
          if (newValue <= 0) {
            clearInterval(interval!);
            setIsComplete(true);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            onTimerComplete?.();
            return 0;
          }
          return newValue;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPaused, seconds, onTimerComplete]);
  
  // Reset timer to initial or provided value
  const resetTimer = useCallback((newSeconds?: number) => {
    setSeconds(newSeconds !== undefined ? newSeconds : initialSeconds);
    setIsComplete(false);
    setIsPaused(!autoStart);
  }, [initialSeconds, autoStart]);
  
  // Pause the timer
  const pauseTimer = useCallback(() => {
    setIsPaused(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);
  
  // Resume the timer
  const resumeTimer = useCallback(() => {
    setIsPaused(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);
  
  // Toggle between pause and resume
  const togglePause = useCallback(() => {
    setIsPaused(prev => !prev);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);
  
  // Skip the timer
  const skipTimer = useCallback(() => {
    setSeconds(0);
    setIsComplete(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onTimerComplete?.();
  }, [onTimerComplete]);
  
  // Add more time to the timer
  const addTime = useCallback((secondsToAdd: number) => {
    setSeconds(prev => prev + secondsToAdd);
    setIsComplete(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, []);
  
  return {
    seconds,
    isPaused,
    isComplete,
    progress,
    resetTimer,
    pauseTimer,
    resumeTimer,
    togglePause,
    skipTimer,
    addTime
  };
} 