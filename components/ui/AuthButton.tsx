import {
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedText } from '@/components/ThemedText';

type AuthButtonProps = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  variant?: 'filled' | 'outline';
  icon?: keyof typeof Ionicons.glyphMap;
};

export function AuthButton({
  title,
  onPress,
  loading = false,
  disabled = false,
  style,
  textStyle,
  variant = 'filled',
  icon,
}: AuthButtonProps) {
  const primaryColor = useThemeColor({}, 'primaryColor');
  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'primaryButton');
  const borderColor = useThemeColor({}, 'socialButtonBorder');
  
  const buttonStyles = [
    styles.button,
    variant === 'filled' 
      ? { backgroundColor } 
      : { borderColor, ...styles.outline },
    disabled && styles.disabled,
    style,
  ];
  
  const textStyles = [
    styles.text,
    variant === 'filled' ? styles.filledText : { color: textColor },
    disabled && styles.disabledText,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'filled' ? '#fff' : primaryColor} />
      ) : (
        <>
          {icon && (
            <Ionicons
              name={icon}
              size={20}
              color={variant === 'filled' ? '#fff' : textColor}
              style={styles.icon}
            />
          )}
          <ThemedText style={textStyles}>{title}</ThemedText>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    flexDirection: 'row',
    width: '100%',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  filledText: {
    color: '#fff',
  },
  disabled: {
    opacity: 0.7,
  },
  disabledText: {
    opacity: 0.7,
  },
  icon: {
    marginRight: 8,
  },
}); 