import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { AssessmentButton } from "@/components/assessment/AssessmentButton";
import { assessmentColors, spacing } from "@/components/ui/AssessmentStyles";
const { width } = Dimensions.get("window");

const generateWeights = (min: number, max: number) =>
  Array.from({ length: max - min + 1 }, (_, i) => min + i);

const WeightSelectionScreen = () => {
  const [unit, setUnit] = useState<"kg" | "lbs">("kg");
  const [selectedWeight, setSelectedWeight] = useState(128);
  const flatListRef = useRef<FlatList>(null);

  const weights =
    unit === "kg" ? generateWeights(30, 200) : generateWeights(66, 440);

  const ITEM_WIDTH = 40;
  const snapToOffsets = weights.map((_, i) => i * ITEM_WIDTH);

  const scrollToWeight = (weight: number) => {
    const index = weights.indexOf(weight);
    flatListRef.current?.scrollToOffset({
      offset: index * ITEM_WIDTH,
      animated: true,
    });
  };

  const handleScroll = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / ITEM_WIDTH);
    setSelectedWeight(weights[index]);
  };

  const router = useRouter();

  const handleSubmit = () => {
    router.push("/(assessment)/polishedUI/ageselection");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Assessment</Text>
        <View style={styles.stepIndicator}>
          <Text style={styles.stepText}>3 of 17</Text>
        </View>
      </View>

      {/* Question */}
      <Text style={styles.questionText}>What is your weight?</Text>

      {/* Unit Switcher */}
      <View style={styles.unitSwitcher}>
        {["kg", "lbs"].map((u) => (
          <TouchableOpacity
            key={u}
            style={[styles.unitButton, unit === u && styles.unitButtonActive]}
            onPress={() => {
              setUnit(u as "kg" | "lbs");
              setSelectedWeight(u === "kg" ? 128 : 282);
              scrollToWeight(u === "kg" ? 128 : 282);
            }}
          >
            <Text
              style={[styles.unitText, unit === u && styles.unitTextActive]}
            >
              {u}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Weight Display */}
      <Text style={styles.weightValue}>
        {selectedWeight}
        <Text style={styles.unitLabel}> {unit}</Text>
      </Text>

      {/* Ruler Picker */}
      <FlatList
        data={weights}
        ref={flatListRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.rulerContainer}
        snapToOffsets={snapToOffsets}
        decelerationRate="fast"
        onScroll={handleScroll}
        scrollEventThrottle={16}
        keyExtractor={(item) => item.toString()}
        renderItem={({ item }) => (
          <View style={styles.rulerItem}>
            <View style={styles.tick} />
            <Text style={styles.rulerText}>{item}</Text>
          </View>
        )}
      />
      <View style={styles.centerIndicator} />

      {/* Continue Button */}
      <AssessmentButton
        title="Continue"
        onPress={handleSubmit}
        icon="arrow-forward"
      />
    </SafeAreaView>
  );
};

export default WeightSelectionScreen;

// Styles
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
    gap: 5,
    marginTop: 44,
    marginBottom: 30,
  },
  headerTitle: {
    color: "#fff",
    fontWeight: "800",
    fontFamily: "WorkSans",
    fontStyle: "normal",
    fontSize: 24,
    gap: 10,
  },
  backButton: {
    backgroundColor: "#2D2D2D",
    padding: 8,
    borderRadius: 100,
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
    fontSize: 30,
    color: "#fff",
    fontWeight: 700,
    marginTop: 20,
    marginBottom: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  unitSwitcher: {
    flexDirection: "row",
    backgroundColor: "#1C1C1E",
    borderRadius: 12,
    marginBottom: 20,
  },
  unitButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
  },
  unitButtonActive: {
    backgroundColor: "#2563EB",
  },
  unitText: {
    color: "#aaa",
    fontWeight: "700",
  },
  unitTextActive: {
    color: "#fff",
  },
  weightValue: {
    color: "#fff",
    fontSize: 120,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  unitLabel: {
    fontSize: 28,
    color: "#aaa",
    marginBottom: 20,
    fontWeight: "500",
    fontFamily: "WorkSans",
  },
  rulerContainer: {
    paddingHorizontal: (width - 40) / 2 - 20,
    marginTop: 20,
    marginBottom: 30,
  },
  rulerItem: {
    width: 40,
    alignItems: "center",
  },
  tick: {
    width: 4,
    height: 20,
    backgroundColor: "#fff",
    marginBottom: 4,
  },
  rulerText: {
    color: "#aaa",
    fontSize: 12,
  },
  centerIndicator: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: 6,
    height: 60,
    borderRadius: 3,
    marginTop: 55,
    backgroundColor: "#fff",
    transform: [{ translateX: -3 }, { translateY: -25 }],
  },
  continueButton: {
    backgroundColor: "#F97316",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 14,
    borderRadius: 10,
    gap: 6,
    marginBottom: 60,
  },
  continueText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
    fontFamily: "WorkSans",
  },
});
