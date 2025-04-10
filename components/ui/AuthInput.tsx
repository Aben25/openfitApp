import { useState } from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity, TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedText } from '@/components/ThemedText';

type AuthInputProps = TextInputProps & {
  label: string;
  error?: string | null;
  isPassword?: boolean;
};

export function AuthInput({
  label,
  error,
  isPassword = false,
  value,
  onChangeText,
  ...rest
}: AuthInputProps) {
  const [secureTextEntry, setSecureTextEntry] = useState(isPassword);
  const backgroundColor = useThemeColor({}, 'inputBackground');
  const textColor = useThemeColor({}, 'text');
  const placeholderColor = useThemeColor({}, 'secondaryText');
  const borderColor = error ? '#FF375F' : useThemeColor({}, 'inputBorder');

  return (
    <View style={styles.container}>
      <ThemedText style={styles.label}>{label}</ThemedText>
      <View style={[styles.inputContainer, { backgroundColor, borderColor }]}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          style={[styles.input, { color: textColor }]}
          placeholderTextColor={placeholderColor}
          secureTextEntry={secureTextEntry}
          autoCapitalize="none"
          {...rest}
        />
        {isPassword && (
          <TouchableOpacity
            onPress={() => setSecureTextEntry(!secureTextEntry)}
            style={styles.iconButton}
          >
            <Ionicons
              name={secureTextEntry ? 'eye-outline' : 'eye-off-outline'}
              size={22}
              color={placeholderColor}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <ThemedText style={styles.error}>{error}</ThemedText>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    width: '100%',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 0,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
  },
  iconButton: {
    padding: 5,
  },
  error: {
    fontSize: 14,
    color: '#FF375F',
    marginTop: 6,
  },
}); 