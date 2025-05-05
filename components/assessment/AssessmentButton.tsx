import React from "react";
import {
  TouchableOpacity,
  ActivityIndicator,
  View,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "../ThemedText";
import {
  assessmentStyles,
  assessmentColors,
  spacing,
} from "../ui/AssessmentStyles";

interface AssessmentButtonProps {
  title: string;
  onPress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  variant?: "primary" | "secondary" | "outline";
}

export function AssessmentButton({
  title,
  onPress,
  isLoading = false,
  disabled = false,
  icon,
  style,
  textStyle,
  variant = "primary",
}: AssessmentButtonProps) {
  // Determine button style based on variant
  const getButtonStyle = () => {
    switch (variant) {
      case "secondary":
        return { backgroundColor: assessmentColors.secondary };
      case "outline":
        return {
          backgroundColor: "transparent",
          borderWidth: 1,
          borderColor: assessmentColors.primary,
        };
      default:
        return { backgroundColor: assessmentColors.primary };
    }
  };

  return (
    <TouchableOpacity
      style={[
        assessmentStyles.continueButton,
        getButtonStyle(),
        disabled && assessmentStyles.continueButtonDisabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.8}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={assessmentColors.text} />
      ) : (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ThemedText
            style={[
              { ...assessmentStyles.continueButtonText, fontWeight: "bold" },
              textStyle,
            ]}
          >
            {title}
          </ThemedText>

          {icon && (
            <Ionicons
              name={icon}
              size={22}
              color={assessmentColors.text}
              style={{ marginLeft: spacing.sm }}
            />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

interface SkipButtonProps {
  onPress: () => void;
  text?: string;
}

export function SkipButton({
  onPress,
  text = "Prefer to skip, thanks!",
}: SkipButtonProps) {
  return (
    <TouchableOpacity
      style={assessmentStyles.skipButton}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <ThemedText style={assessmentStyles.skipText}>{text}</ThemedText>
      <Ionicons
        name="close"
        size={18}
        color={assessmentColors.text}
        style={{ opacity: 0.8 }}
      />
    </TouchableOpacity>
  );
}
