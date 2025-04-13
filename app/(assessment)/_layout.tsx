import { Stack } from 'expo-router';
import { AssessmentProvider } from '@/context/AssessmentContext';

export default function AssessmentLayout() {
  return (
    <AssessmentProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="about-you" />
        <Stack.Screen name="fitness-goals" />
        <Stack.Screen name="cardio-level" />
        <Stack.Screen name="strength-level" />
        <Stack.Screen name="workout-environment" />
        <Stack.Screen name="workout-schedule" />
        <Stack.Screen name="excluded-exercises" />
        <Stack.Screen name="complete" />
      </Stack>
    </AssessmentProvider>
  );
}
