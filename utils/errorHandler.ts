import { Alert, Platform } from 'react-native';
// Remove sentry import since it's not installed
// import * as Sentry from 'sentry-expo';

// Different types of errors
export enum ErrorType {
  AUTH = 'auth',
  API = 'api',
  NETWORK = 'network',
  VALIDATION = 'validation',
  GENERAL = 'general',
}

// Error with additional context
export interface AppError extends Error {
  type: ErrorType;
  context?: any;
  originalError?: any;
}

// Factory function to create typed errors
export function createError(
  message: string,
  type: ErrorType,
  originalError?: any,
  context?: any
): AppError {
  const error = new Error(message) as AppError;
  error.type = type;
  error.originalError = originalError;
  error.context = context;
  return error;
}

// Log error to console and error reporting service
export function logError(error: Error | AppError, context?: any): void {
  // Always log to console
  console.error('Error:', error);
  
  if (context) {
    console.error('Context:', context);
  }
  
  // If this is our typed error
  if ('type' in error) {
    // Log to error reporting service (commented out since Sentry is not available)
    // Sentry.Native.captureException(error, {
    //   extra: {
    //     type: error.type,
    //     context: error.context || context,
    //     originalError: error.originalError,
    //   },
    // });
  } else {
    // For untyped errors, just send the error itself
    // Sentry.Native.captureException(error, {
    //   extra: { context },
    // });
  }
}

// Display user-friendly error message
export function showError(
  error: Error | AppError,
  defaultMessage = 'An unexpected error occurred. Please try again.'
): void {
  let message = defaultMessage;
  
  // If it's our app error, use its message
  if (error instanceof Error) {
    message = error.message || defaultMessage;
  }
  
  // Special handling for network errors
  if ('type' in error && error.type === ErrorType.NETWORK) {
    message = 'Network error. Please check your internet connection and try again.';
  }
  
  // Show the error to the user
  Alert.alert('Error', message);
}

// Format API errors from Supabase into user-friendly messages
export function handleSupabaseError(error: any): AppError {
  // Default message
  let message = 'An error occurred with the request';
  let type = ErrorType.API;
  
  // Authentication specific errors
  if (error?.message?.includes('auth')) {
    type = ErrorType.AUTH;
    
    // Common auth errors
    if (error.message.includes('Email not confirmed')) {
      message = 'Please confirm your email address before signing in';
    } else if (error.message.includes('Invalid login credentials')) {
      message = 'Incorrect email or password';
    } else if (error.message.includes('Email already in use')) {
      message = 'This email is already registered';
    } else if (error.message.includes('Password')) {
      message = error.message; // Password requirement errors are already clear
    } else {
      message = 'Authentication error: ' + error.message;
    }
  } 
  // Network errors
  else if (error?.message?.includes('network') || error?.code === 'ERR_NETWORK') {
    type = ErrorType.NETWORK;
    message = 'Network error. Please check your connection';
  }
  // Database errors
  else if (error?.code?.startsWith('PGRST')) {
    message = 'Database error: ' + error.message;
  }
  // Other API errors
  else if (error?.message) {
    message = error.message;
  }
  
  return createError(message, type, error);
}

// Global error handler for unhandled errors/promises
export function setupGlobalErrorHandlers(): void {
  if (Platform.OS === 'web') return; // Skip for web platform
  
  // Handle global JS errors
  const originalErrorHandler = ErrorUtils.getGlobalHandler();
  
  ErrorUtils.setGlobalHandler((error, isFatal) => {
    // Log the error
    logError(error, { isFatal });
    
    // Call the original handler
    originalErrorHandler(error, isFatal);
  });
  
  // Handle unhandled promise rejections
  const unhandledRejectionHandler = (id: string, error: any) => {
    logError(error, { unhandledRejection: true, id });
  };
  
  // @ts-ignore - This API exists but types might be missing
  if (global.HermesInternal?.hasProperty('enablePromiseRejectionTracker')) {
    // @ts-ignore
    global.HermesInternal.enablePromiseRejectionTracker({
      allRejections: true,
      onUnhandled: unhandledRejectionHandler,
    });
  }
} 