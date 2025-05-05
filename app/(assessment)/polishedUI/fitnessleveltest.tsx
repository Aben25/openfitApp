import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import {
  Ionicons,
  MaterialCommunityIcons,
  Entypo,
  FontAwesome5,
} from "@expo/vector-icons";
import { useRouter } from "expo-router";

type DietOption = {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
};
const route = useRouter();
const handlesubmit = () => {
  route.push("/(assessment)/polishedUI/commitmentscreen");
};
const options: DietOption[] = [
  {
    id: "plant",
    title: "Plant Based",
    subtitle: "Vegan",
    icon: <MaterialCommunityIcons name="leaf" size={20} color="#fff" />,
  },
  {
    id: "carbo",
    title: "Carbo Diet",
    subtitle: "Bread, etc",
    icon: <Ionicons name="fitness" size={20} color="#fff" />,
  },
  {
    id: "specialized",
    title: "Specialized",
    subtitle: "Paleo, keto, etc",
    icon: (
      <MaterialCommunityIcons
        name="silverware-fork-knife"
        size={20}
        color="#fff"
      />
    ),
  },
  {
    id: "traditional",
    title: "Traditional",
    subtitle: "Fruit diet",
    icon: <FontAwesome5 name="apple-alt" size={18} color="#fff" />,
  },
];

export default function DietPreferenceScreen() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="chevron-back" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Assessment</Text>
        <View style={styles.stepIndicator}>
          <Text style={styles.stepText}>8 of 17</Text>
        </View>
      </View>

      <Text style={styles.questionText}>
        Do you have a specific{"\n"}diet preference?
      </Text>

      <FlatList
        data={options}
        numColumns={2}
        keyExtractor={(item) => item.id}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        contentContainerStyle={{ gap: 16 }}
        renderItem={({ item }) => {
          const isSelected = selectedId === item.id;
          return (
            <TouchableOpacity
              style={[styles.card, isSelected && styles.cardSelected]}
              onPress={() => setSelectedId(item.id)}
            >
              <View>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
              </View>
              <View style={styles.icon}>{item.icon}</View>
            </TouchableOpacity>
          );
        }}
      />

      <TouchableOpacity style={styles.continueButton}>
        <Text style={styles.continueText}>Continue</Text>
        <Ionicons
          name="arrow-forward"
          size={20}
          color="#fff"
          onPress={handlesubmit}
        />
      </TouchableOpacity>
    </View>
  );
}
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
  },
  backButton: {
    backgroundColor: "#2D2D2D",
    padding: 8,
    borderRadius: 100,
  },
  headerTitle: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 20,
  },
  stepIndicator: {
    backgroundColor: "#172554",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  stepText: {
    color: "#60A5FA",
    fontWeight: "600",
    fontSize: 14,
  },
  questionText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 30,

    textAlign: "center",
    marginVertical: 40,
  },
  card: {
    backgroundColor: "#24262B",
    padding: 16,
    borderRadius: 15,
    width: "48%",

    minHeight: 150,
    justifyContent: "space-between",
  },
  cardSelected: {
    backgroundColor: "#676C75",
    borderWidth: 2,
    borderColor: "#F97316",
  },
  cardTitle: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  cardSubtitle: {
    color: "#A1A1AA",
    fontSize: 12,
    marginTop: 2,
  },
  icon: {
    alignSelf: "flex-end",
    marginTop: 8,
  },
  continueButton: {
    marginTop: 30,
    backgroundColor: "#F97316",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 14,
    borderRadius: 10,
    gap: 6,
    marginBottom: 25,
  },
  continueText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
