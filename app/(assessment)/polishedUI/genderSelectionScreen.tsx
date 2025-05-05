// GenderSelectionScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { AssessmentButton } from "@/components/assessment/AssessmentButton";
import { assessmentColors, spacing } from "@/components/ui/AssessmentStyles";
import { useRouter } from "expo-router";

const GenderSelectionScreen = () => {
  const [selectedGender, setSelectedGender] = useState<
    "male" | "female" | null
  >(null);
  const router = useRouter();

  const handleSubmit = () => {
    router.push("/(assessment)/polishedUI/weightselection");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Assessment</Text>
        <View style={styles.stepIndicator}>
          <Text style={styles.stepText}>2 of 17</Text>
        </View>
      </View>

      <Text style={styles.questionText}>What is your gender?</Text>

      <View style={styles.optionsContainer}>
        {["male", "female"].map((gender) => {
          const isSelected = selectedGender === gender;
          const label = gender === "male" ? "Male" : "Female";

          const imageSource = {
            uri:
              gender === "male"
                ? "https://i.pinimg.com/736x/ae/55/e6/ae55e6516902217d26603a354ca12bc4.jpg"
                : "https://i.pinimg.com/736x/3d/cf/69/3dcf691003a2be7f4bf3090f7bcf1506.jpg",
          };

          return (
            <TouchableOpacity
              key={gender}
              style={[styles.card, isSelected && styles.cardSelected]}
              onPress={() => setSelectedGender(gender as "male" | "female")}
            >
              <View style={styles.cardHeader}>
                <FontAwesome5
                  name={gender === "male" ? "mars" : "venus"}
                  size={16}
                  color={isSelected ? "#FF7F00" : "#fff"}
                />
                <Text
                  style={[styles.cardLabel, isSelected && { color: "#FF7F00" }]}
                >
                  {label}
                </Text>
              </View>
              <Image
                source={imageSource}
                style={styles.cardImage}
                resizeMode="cover"
              />
              <View
                style={[styles.radio, isSelected && styles.radioSelected]}
              />
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity style={styles.skipButton}>
        <Text style={styles.skipText}>Prefer to skip, thanks!</Text>
        <Ionicons name="close" size={16} color="#F97316" />
      </TouchableOpacity>

      <AssessmentButton
        title="Continue"
        onPress={handleSubmit}
        icon="arrow-forward"
      />
    </SafeAreaView>
  );
};

export default GenderSelectionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F0F0F",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 50,
    marginBottom: 0,
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
    fontSize: 22,
    color: "#fff",
    fontWeight: "bold",
    marginTop: 44,
    marginBottom: 44,
  },
  optionsContainer: {
    gap: 16,
  },
  card: {
    borderRadius: 15,
    backgroundColor: "#050505",
    padding: 15,
    overflow: "hidden",
    position: "relative",
  },
  cardSelected: {
    borderWidth: 2,
    borderColor: "#F97316",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 6,
  },
  cardLabel: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  cardImage: {
    width: "100%",
    height: 140,
    borderRadius: 10,
  },
  radio: {
    position: "absolute",
    bottom: 10,
    right: 10,
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#fff",
  },
  radioSelected: {
    backgroundColor: "#FF7F00",
    borderColor: "#FF7F00",
  },
  skipButton: {
    backgroundColor: "#431407",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 14,
    borderRadius: 10,
    marginTop: 30,
    marginBottom: 10,
    gap: 6,
  },
  skipText: {
    color: "#F97316",
    fontWeight: "500",
  },
});
