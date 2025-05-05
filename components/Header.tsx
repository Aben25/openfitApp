import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

type HeaderProps = {
  title?: string;
  showBackButton?: boolean;
  rightIcon?: React.ComponentProps<typeof Ionicons>["name"];
  onRightPress?: () => void;
  transparent?: boolean;
  light?: boolean;
  containerStyle?: any;
  titleStyle?: any;
  backButtonStyle?: any;
  rightButtonStyle?: any;
  onBackPress?: () => void;
};

const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = false,
  rightIcon,
  onRightPress,
  transparent = false,
  light = false,
  containerStyle,
  titleStyle,
  backButtonStyle,
  rightButtonStyle,
  onBackPress,
}) => {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // Determine background color based on transparent and light props
  const backgroundColor = transparent
    ? "transparent"
    : light
    ? "#FFFFFF"
    : "#000000";

  // Determine text and icon color based on light prop
  const contentColor = light ? "#000000" : "#FFFFFF";

  // Default back button handler
  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          backgroundColor,
        },
        containerStyle,
      ]}
    >
      <StatusBar
        barStyle={light ? "dark-content" : "light-content"}
        backgroundColor={backgroundColor}
        translucent={transparent}
      />

      <View style={styles.content}>
        {/* Left (Back) Button */}
        {showBackButton ? (
          <TouchableOpacity
            style={[styles.button, backButtonStyle]}
            onPress={handleBackPress}
          >
            <Ionicons name="chevron-back" size={24} color={contentColor} />
          </TouchableOpacity>
        ) : (
          <View style={styles.buttonPlaceholder} />
        )}

        {/* Title */}
        <Text
          style={[styles.title, { color: contentColor }, titleStyle]}
          numberOfLines={1}
        >
          {title}
        </Text>

        {/* Right Button */}
        {rightIcon ? (
          <TouchableOpacity
            style={[styles.button, rightButtonStyle]}
            onPress={onRightPress}
          >
            <Ionicons name={rightIcon} size={24} color={contentColor} />
          </TouchableOpacity>
        ) : (
          <View style={styles.buttonPlaceholder} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 50,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginHorizontal: 10,
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(128,128,128,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonPlaceholder: {
    width: 40,
  },
});

export default Header;
