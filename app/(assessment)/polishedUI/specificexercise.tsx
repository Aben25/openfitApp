import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
} from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { AssessmentButton } from "@/components/assessment/AssessmentButton";
import { useRouter } from "expo-router";
type Exercise = {
  id: string;
  label: string;
  icon: keyof typeof FontAwesome5.glyphMap;
};

const exercises: Exercise[] = [
  { id: "1", label: "Jogging", icon: "running" },
  { id: "2", label: "Walking", icon: "walking" },
  { id: "3", label: "Hiking", icon: "hiking" },
  { id: "4", label: "Skating", icon: "skating" },
  { id: "5", label: "Biking", icon: "bicycle" },
  { id: "6", label: "Weightlift", icon: "dumbbell" },
  { id: "7", label: "Cardio", icon: "heartbeat" },
  { id: "8", label: "Yoga", icon: "spa" },
  { id: "9", label: "Other", icon: "ellipsis-h" },
];

const ExercisePreferenceScreen = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const router = useRouter();
  const handleSubmit = () => {
    router.push("/(assessment)/polishedUI/drugsupplement");
  };

  const handleBack = () => {
    router.push("/(assessment)/polishedUI/commitmentscreen");
  };
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons
            name="chevron-back"
            size={28}
            color="#fff"
            onPress={handleBack}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>Assessment</Text>
        <View style={styles.stepBadge}>
          <Text style={styles.stepText}>10 of 17</Text>
        </View>
      </View>

      {/* Question */}
      <Text style={styles.questionText}>
        Do you have a specific{"\n"}
        <Text style={styles.bold}>Exercise Prefrence?</Text>
      </Text>

      {/* Grid of Exercises */}
      <FlatList
        data={exercises}
        numColumns={3}
        contentContainerStyle={styles.grid}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const isSelected = selected === item.id;
          return (
            <TouchableOpacity
              style={[styles.exerciseBox, isSelected && styles.selectedBox]}
              onPress={() => setSelected(item.id)}
            >
              <FontAwesome5
                name={item.icon}
                size={28}
                color={isSelected ? "#fff" : "#9A9A9A"}
              />
              <Text
                style={[styles.exerciseText, isSelected && styles.selectedText]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        }}
      />

      {/* Continue Button */}
      <AssessmentButton
        title="Continue"
        onPress={handleSubmit}
        icon="arrow-forward"
      />
    </SafeAreaView>
  );
};

export default ExercisePreferenceScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0C0C0C",
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  header: {
    flexDirection: "row",
    marginTop: 50,
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },
  stepBadge: {
    backgroundColor: "#172554",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  stepText: {
    color: "#2563EB",
    fontSize: 14,
  },
  questionText: {
    color: "#fff",
    fontSize: 30,
    textAlign: "center",
    marginVertical: 30,
    fontFamily: "worksans",
    fontWeight: 700,
  },
  bold: {
    fontWeight: "700",
  },
  grid: {
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  exerciseBox: {
    backgroundColor: "#1C1C1E",
    width: 90,
    height: 130,
    margin: 10,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedBox: {
    backgroundColor: "#3A3A3C",
    borderColor: "#fff",
    borderWidth: 1,
  },
  exerciseText: {
    color: "#9A9A9A",
    marginTop: 8,
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "worksans",
  },
  selectedText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "worksans",
  },
  continueButton: {
    flexDirection: "row",
    backgroundColor: "#FF7A00",
    paddingVertical: 16,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  continueText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginRight: 10,
  },
});
