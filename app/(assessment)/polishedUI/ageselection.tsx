import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AssessmentButton } from "@/components/assessment/AssessmentButton";
import { useRouter } from "expo-router";

const { height } = Dimensions.get("window");

const generateAges = (min: number, max: number) =>
  Array.from({ length: max - min + 1 }, (_, i) => min + i);

const ITEM_HEIGHT = 60;

const AgeSelectionScreen = () => {
  const [selectedAge, setSelectedAge] = useState(18);
  const flatListRef = useRef<FlatList>(null);
  const ages = generateAges(10, 100);

  // Scroll to initial age
  useEffect(() => {
    scrollToAge(selectedAge);
  }, []);

  const scrollToAge = (age: number) => {
    const index = ages.indexOf(age);
    flatListRef.current?.scrollToOffset({
      offset: index * ITEM_HEIGHT,
      animated: true,
    });
  };

  const handleMomentumScrollEnd = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    setSelectedAge(ages[index]);
  };

  const router = useRouter();

  const handleSubmit = () => {
    router.push("/(assessment)/polishedUI/fittest");
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Assessment</Text>
        <View style={styles.stepIndicator}>
          <Text style={styles.stepText}>4 of 17</Text>
        </View>
      </View>

      <Text style={styles.questionText}>What is your age?</Text>

      <AssessmentButton
        title="Continue"
        onPress={handleSubmit}
        icon="arrow-forward"
      />
    </SafeAreaView>
  );
};

export default AgeSelectionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F0F0F",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 50,
    marginBottom: 0,
  },
  backButton: {
    backgroundColor: "#2D2D2D",
    padding: 8,
    borderRadius: 100,
  },
  headerTitle: {
    color: "#fff",
    fontWeight: "800",
    fontFamily: "WorkSans",
    fontStyle: "normal",
    fontSize: 24,
    gap: 10,
  },
  stepIndicator: {
    backgroundColor: "#172554",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  stepText: {
    color: "#2563EB",
    fontSize: 14,
    fontWeight: 600,
  },
  questionText: {
    fontSize: 32,
    color: "#fff",
    fontFamily: "worksans",
    fontWeight: 800,
    marginTop: 40,
    marginBottom: 10,
    textAlign: "center",
  },
  pickerWrapper: {
    flex: 1,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  pickerItem: {
    height: ITEM_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
  pickerText: {
    fontSize: 24,
    fontWeight: "600",
  },
  unselectedText: {
    color: "#666",
    fontSize: 24,
  },
  selectedText: {
    color: "#fff",
    fontSize: 48,
  },
  selectorBox: {
    position: "absolute",
    top: (height - ITEM_HEIGHT) / 2,
    left: 20,
    right: 20,
    height: ITEM_HEIGHT,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#555",
    backgroundColor: "#1A1A1A",
    zIndex: 1,
  },
  continueButton: {
    backgroundColor: "#FF7F00",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 14,
    borderRadius: 10,
    gap: 6,
  },
  continueText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
