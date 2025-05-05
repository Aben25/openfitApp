import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  SafeAreaView,
} from "react-native";
import { Ionicons, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
type GoalOption = {
  id: string;
  label: string;
  icon: React.ReactNode;
};

const goalOptions: GoalOption[] = [
  {
    id: "lose_weight",
    label: "I wanna lose weight",
    icon: <MaterialIcons name="fitness-center" size={20} color="#fff" />,
  },
  {
    id: "ai_coach",
    label: "I wanna try AI Coach",
    icon: <FontAwesome5 name="robot" size={18} color="#fff" />,
  },
  {
    id: "get_bulks",
    label: "I wanna get bulks",
    icon: <FontAwesome5 name="dumbbell" size={18} color="#fff" />,
  },
  {
    id: "gain_endurance",
    label: "I wanna gain endurance",
    icon: <MaterialIcons name="favorite" size={20} color="#fff" />,
  },
  {
    id: "just_trying",
    label: "Just trying out the app",
    icon: <FontAwesome5 name="smile-beam" size={18} color="#fff" />,
  },
];
const router = useRouter();
const handlesubmit = () => {
  router.push("/(assessment)/polishedUI/genderSelectionScreen");
};
const FitnessGoalScreen = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const renderItem = ({ item }: { item: GoalOption }) => {
    const isSelected = item.id === selectedId;

    return (
      <TouchableOpacity
        style={[styles.option, isSelected && styles.optionSelected]}
        onPress={() => setSelectedId(item.id)}
      >
        <View style={styles.optionLeft}>
          <View style={styles.iconContainer}>{item.icon}</View>
          <Text style={styles.optionText}>{item.label}</Text>
        </View>
        <View style={[styles.radio, isSelected && styles.radioSelected]} />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="chevron-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Assessment</Text>
        <View style={styles.stepBadge}>
          <Text style={styles.stepText}>1 of 17</Text>
        </View>
      </View>

      <Text style={styles.question}>What’s your fitness{"\n"}goal/target?</Text>

      <FlatList
        data={goalOptions}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ gap: 10 }}
        style={{ marginBottom: 20 }}
      />

      {/* Continue Button */}
      <TouchableOpacity style={styles.continueButton}>
        <Text style={styles.continueText}>Continue </Text>
        <Ionicons
          name="arrow-forward"
          size={20}
          color="#fff"
          onPress={handlesubmit}
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default FitnessGoalScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F0F0F",
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    backgroundColor: "#2D2D2D",
    padding: 10,
    borderRadius: 100,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
  },
  stepBadge: {
    backgroundColor: "#172554",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  stepText: {
    color: "#2563EB",
    fontWeight: "600",
    fontSize: 14,
  },
  question: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#fff",
    marginVertical: 40,
    alignItems: "center",
    textAlign: "center",
    fontFamily: "worksans",
    letterSpacing: 1,
    marginBottom: 60,
  },
  option: {
    backgroundColor: "#1F1F1F",
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  optionSelected: {
    borderColor: "#F97316",
    borderWidth: 2,
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    marginRight: 12,
  },
  optionText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: 600,
    fontFamily: "worksans",
  },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 5,
    borderColor: "#fff",
    borderWidth: 2,
  },
  radioSelected: {
    backgroundColor: "#F97316",
    borderColor: "#F97316",
  },
  continueButton: {
    backgroundColor: "#F97316",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
    marginBottom: 55,
  },
  continueText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
