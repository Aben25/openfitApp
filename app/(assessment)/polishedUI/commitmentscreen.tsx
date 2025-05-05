import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { AssessmentButton } from "@/components/assessment/AssessmentButton";

import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";

const days = [1, 2, 3, 4, 5];
const { width } = Dimensions.get("window");

const CommitmentScreen = () => {
  const [selectedDay, setSelectedDay] = useState(5);
  const router = useRouter();

  const handleSubmit = () => {
    router.push("/(assessment)/polishedUI/specificexercise");
  };

  const handleBack = () => {
    router.push("/(assessment)/polishedUI/dietpreference");
  };
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Assessment</Text>
        <View style={styles.stepBadge}>
          <Text style={styles.stepText}>9 of 17</Text>
        </View>
      </View>

      <Text style={styles.questionText}>
        How many days/wk{"\n"}will you commit?
      </Text>

      <Text style={styles.largeText}>{selectedDay}x</Text>

      <View style={styles.selectionContainer}>
        {days.map((day) => (
          <TouchableOpacity
            key={day}
            style={[
              styles.circleButton,
              selectedDay === day && styles.selectedButton,
            ]}
            onPress={() => setSelectedDay(day)}
          >
            <Text
              style={[
                styles.dayText,
                selectedDay === day && styles.selectedDayText,
              ]}
            >
              {day}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.commitmentText}>
        I’m committed to exercising{" "}
        <Text style={styles.bold}>{selectedDay}x</Text> weekly
      </Text>

      <AssessmentButton
        title="Continue"
        onPress={handleSubmit}
        icon="arrow-forward"
      />
    </SafeAreaView>
  );
};

export default CommitmentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0C0C0C",
    paddingHorizontal: 20,
    justifyContent: "space-between",
    paddingBottom: 40,
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
    fontWeight: "700",
  },
  stepBadge: {
    backgroundColor: "#192137",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 12,
  },
  stepText: {
    color: "#2563EB",
    fontSize: 14,
  },
  questionText: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "700",
    textAlign: "center",
    fontFamily: "worksans",
    marginTop: 60,
  },
  largeText: {
    fontSize: 190,
    fontWeight: "900",

    color: "#fff",
    textAlign: "center",
    marginVertical: 40,
    // fontFamily: "worksans",
    letterSpacing: 1,
  },
  selectionContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#1C1C1E",
    borderRadius: 20,
    padding: 10,
    marginBottom: 20,
  },
  circleButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2C2C2E",
  },
  selectedButton: {
    backgroundColor: "#2959F6",
  },
  dayText: {
    color: "#9A9A9A",
    fontSize: 16,
    fontWeight: "500",
  },
  selectedDayText: {
    color: "#fff",
    fontWeight: "700",
  },
  commitmentText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 15,
    marginBottom: 30,
    letterSpacing: 1,
    fontFamily: "worksans",
    fontWeight: 700,
  },
  bold: {
    fontWeight: "700",
  },
  continueButton: {
    flexDirection: "row",
    backgroundColor: "#FF7A00",
    paddingVertical: 16,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  continueText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginRight: 10,
  },
});
