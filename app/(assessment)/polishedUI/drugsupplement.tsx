import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
const AssessmentScreen: React.FC = () => {
  const router = useRouter();
  const handleYes = () => {
    router.push("/(assessment)/complete");
  };

  const handleBack = () => {
    router.push("/(assessment)/polishedUI/target");
  };

  const handleNo = () => {
    console.log("User has no previous fitness experience");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topSection}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons
            name="arrow-back"
            size={24}
            color="white"
            onPress={handleBack}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>Assessment</Text>
        <View style={styles.stepIndicator}>
          <Text style={styles.stepText}>11 of 17</Text>
        </View>
      </View>

      <Text style={styles.questionText}>
        Are you taking any {"\n"} supplements?
      </Text>

      <Image
        source={require("../../../assets/images/drug.png")} // Replace with your image path
        style={styles.image}
        resizeMode="contain"
      />

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.optionButton, styles.noButton]}
          onPress={handleNo}
        >
          <Text style={styles.buttonText}>No</Text>
          <AntDesign name="close" size={18} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.optionButton, styles.yesButton]}
          onPress={handleYes}
        >
          <Text style={styles.buttonText}>Yes</Text>
          <AntDesign name="check" size={18} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AssessmentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "Sandow Gray/100",
    paddingHorizontal: 24,
    justifyContent: "space-between",
  },
  topSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 50,
  },
  backButton: {
    backgroundColor: "#2D2D2D",
    padding: 8,
    borderRadius: 100,
  },
  headerText: {
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
    fontWeight: "600",
    fontSize: 14,
  },
  questionText: {
    color: "white",
    fontSize: 34,

    fontWeight: "800",
    textAlign: "center",
    marginTop: -40,
    fontFamily: "worksans",
    letterSpacing: 1,
  },
  image: {
    height: 300,
    width: "100%",
    alignSelf: "center",
    marginVertical: 10,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 60,
    gap: 4,
  },
  optionButton: {
    flex: 1,
    marginHorizontal: 1,
    paddingVertical: 16,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    gap: 2,
  },
  noButton: {
    backgroundColor: "#2D2D2D",
  },
  yesButton: {
    backgroundColor: "#F97316",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "800",
    fontFamily: "worksans",
    marginRight: 6,
  },
});
