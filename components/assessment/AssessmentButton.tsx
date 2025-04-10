import React from 'react';
import { 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator, 
  View,
  StyleProp,
  ViewStyle 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '../ThemedText';

interface AssessmentButtonProps {
  title: string;
  onPress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  icon?: string;
  style?: StyleProp<ViewStyle>;
}

export function AssessmentButton({
  title,
  onPress,
  isLoading = false,
  disabled = false,
  icon,
  style
}: AssessmentButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        disabled && styles.disabledButton,
        style
      ]}
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.8}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color="#FFFFFF" />
      ) : (
        <View style={styles.buttonContent}>
          <ThemedText style={styles.buttonText}>
            {title}
          </ThemedText>
          
          {icon && (
            <Ionicons 
              name={icon as any} 
              size={22} 
              color="#FFFFFF" 
              style={styles.buttonIcon} 
            />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

export function SkipButton({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.skipButton} onPress={onPress}>
      <ThemedText style={styles.skipText}>Prefer to skip, thanks!</ThemedText>
      <Ionicons name="close" size={18} color="#FFFFFF" style={styles.skipIcon} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 18,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF8C42',
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  buttonIcon: {
    marginLeft: 8,
  },
  skipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 59, 48, 0.2)',
  },
  skipText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    marginRight: 8,
  },
  skipIcon: {
    opacity: 0.8,
  }
}); 