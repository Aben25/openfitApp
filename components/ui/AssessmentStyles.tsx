import { StyleSheet, Dimensions, Platform } from 'react-native';

// Get screen dimensions
const { width, height } = Dimensions.get('window');

// Define colors
export const assessmentColors = {
  background: '#000000',
  cardBackground: '#1C1C1E',
  primary: '#FF8C42',
  secondary: '#3478F6',
  text: '#FFFFFF',
  textSecondary: '#BBBBBB',
  error: '#FF375F',
  success: '#34C759',
  border: '#2C2C2E',
  buttonDisabled: '#4A4A4A',
  progressBackground: 'rgba(59, 89, 152, 0.7)',
  skipButtonBackground: 'rgba(255, 59, 48, 0.2)',
  overlayBackground: 'rgba(0, 0, 0, 0.8)',
  selectedItemBackground: 'rgba(255, 140, 66, 0.1)',
};

// Define spacing
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Define typography
export const typography = {
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: assessmentColors.text,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500',
    color: assessmentColors.textSecondary,
  },
  body: {
    fontSize: 16,
    color: assessmentColors.text,
  },
  button: {
    fontSize: 18,
    fontWeight: '600',
    color: assessmentColors.text,
  },
  caption: {
    fontSize: 14,
    color: assessmentColors.textSecondary,
  },
};

// Define common styles
export const assessmentStyles = StyleSheet.create({
  // Layout
  safeArea: {
    flex: 1,
    backgroundColor: assessmentColors.background,
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
  },
  container: {
    flex: 1,
    backgroundColor: assessmentColors.background,
  },
  scrollContainer: {
    flex: 1,
    paddingTop: 100,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 100,
  },
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },

  // Typography
  screenTitle: {
    ...typography.title,
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.subtitle,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  bodyText: {
    ...typography.body,
    marginBottom: spacing.md,
  },

  // Buttons
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.lg,
    backgroundColor: assessmentColors.overlayBackground,
    paddingBottom: Platform.OS === 'ios' ? 34 : spacing.lg,
  },
  continueButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: assessmentColors.primary,
    borderRadius: 12,
    paddingVertical: spacing.md,
  },
  continueButtonDisabled: {
    backgroundColor: assessmentColors.buttonDisabled,
  },
  continueButtonText: {
    ...typography.button,
    marginRight: spacing.sm,
  },
  skipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    marginBottom: spacing.md,
    borderRadius: 12,
    backgroundColor: assessmentColors.skipButtonBackground,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '500',
    color: assessmentColors.text,
    marginRight: spacing.sm,
  },
  skipIcon: {
    opacity: 0.8,
  },

  // Cards and Options
  card: {
    backgroundColor: assessmentColors.cardBackground,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: assessmentColors.border,
  },
  selectedCard: {
    borderColor: assessmentColors.primary,
    backgroundColor: assessmentColors.selectedItemBackground,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  // Progress
  progressContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 10 : 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    zIndex: 10,
  },
  backButton: {
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: assessmentColors.cardBackground,
  },
  progressIndicator: {
    backgroundColor: assessmentColors.progressBackground,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  progressText: {
    color: assessmentColors.text,
    fontSize: 14,
    fontWeight: '600',
  },

  // Form elements
  input: {
    backgroundColor: assessmentColors.cardBackground,
    borderRadius: 8,
    padding: spacing.md,
    color: assessmentColors.text,
    fontSize: 16,
    marginBottom: spacing.md,
  },
  slider: {
    width: '100%',
    height: 40,
  },

  // Utility
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  errorText: {
    color: assessmentColors.error,
    fontSize: 14,
    marginTop: spacing.sm,
  },
  successText: {
    color: assessmentColors.success,
    fontSize: 14,
    marginTop: spacing.sm,
  },
});