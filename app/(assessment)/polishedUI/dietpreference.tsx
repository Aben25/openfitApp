// // AssessmentScreen.tsx

// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   FlatList,
//   StyleSheet,
//   SafeAreaView,
// } from "react-native";
// import {
//   Ionicons,
//   MaterialCommunityIcons,
//   FontAwesome5,
// } from "@expo/vector-icons";

// type DietOption = {
//   id: string;
//   label: string;
//   description: string;
//   icon: React.ReactNode;
// };

// const dietOptions: DietOption[] = [
//   {
//     id: "plant",
//     label: "Plant Based",
//     description: "Vegan",
//     icon: <MaterialCommunityIcons name="leaf" size={20} color="#fff" />,
//   },
//   {
//     id: "carbo",
//     label: "Carbo Diet",
//     description: "Bread, etc",
//     icon: <MaterialCommunityIcons name="bread-slice" size={20} color="#fff" />,
//   },
//   {
//     id: "special",
//     label: "Specialized",
//     description: "Paleo, keto, etc",
//     icon: <FontAwesome5 name="utensils" size={18} color="#fff" />,
//   },
//   {
//     id: "traditional",
//     label: "Traditional",
//     description: "Fruit diet",
//     icon: (
//       <MaterialCommunityIcons name="fruit-watermelon" size={20} color="#fff" />
//     ),
//   },
// ];

// const AssessmentScreen = () => {
//   const [selectedId, setSelectedId] = useState<string | null>(null);

//   const renderCard = ({ item }: { item: DietOption }) => {
//     const isSelected = item.id === selectedId;
//     return (
//       <TouchableOpacity
//         style={[styles.card, isSelected && styles.cardSelected]}
//         onPress={() => setSelectedId(item.id)}
//       >
//         <View style={styles.cardHeader}>
//           {item.icon}
//           <Text style={styles.cardLabel}>{item.label}</Text>
//         </View>
//         <Text style={{ color: "#aaa", marginBottom: 12 }}>
//           {item.description}
//         </Text>
//         <View style={[styles.radio, isSelected && styles.radioSelected]} />
//       </TouchableOpacity>
//     );
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity style={styles.backButton}>
//           <Ionicons name="chevron-back" size={20} color="#fff" />
//         </TouchableOpacity>

//         <Text style={styles.headerTitle}>Assessment</Text>

//         <View style={styles.stepIndicator}>
//           <Text style={styles.stepText}>8 of 17</Text>
//         </View>
//       </View>

//       {/* Question */}
//       <Text style={styles.questionText}>
//         Do you have a specific{"\n"}diet preference?
//       </Text>

//       {/* Cards */}
//       <View style={styles.optionsContainer}>
//         <FlatList
//           data={dietOptions}
//           renderItem={renderCard}
//           keyExtractor={(item) => item.id}
//           numColumns={2}
//           columnWrapperStyle={{ justifyContent: "space-between", gap: 10 }}
//           contentContainerStyle={{ gap: 10 }}
//         />
//       </View>

//       {/* Continue Button */}
//       <TouchableOpacity
//         style={{
//           backgroundColor: "#F97316",
//           padding: 16,
//           borderRadius: 12,
//           alignItems: "center",
//           marginTop: 30,
//         }}
//       >
//         <Text style={{ color: "#fff", fontWeight: "600", fontSize: 16 }}>
//           Continue →
//         </Text>
//       </TouchableOpacity>
//     </SafeAreaView>
//   );
// };

// export default AssessmentScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#0F0F0F",
//     padding: 20,
//   },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginTop: 50,
//     marginBottom: 0,
//   },
//   headerTitle: {
//     color: "#fff",
//     fontWeight: "800",
//     fontFamily: "WorkSans",
//     fontStyle: "normal",
//     fontSize: 24,
//     textAlign: "center",
//     flex: 1,
//   },
//   backButton: {
//     backgroundColor: "#2D2D2D",
//     padding: 8,
//     borderRadius: 100,
//   },
//   stepIndicator: {
//     backgroundColor: "#172554",
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     borderRadius: 10,
//   },
//   stepText: {
//     color: "#2563EB",
//     fontSize: 14,
//     fontWeight: "600",
//   },
//   questionText: {
//     fontSize: 22,
//     color: "#fff",
//     fontWeight: "bold",
//     marginTop: 44,
//     marginBottom: 44,
//   },
//   optionsContainer: {
//     gap: 16,
//   },
//   card: {
//     flex: 1,
//     borderRadius: 15,
//     backgroundColor: "#050505",
//     padding: 15,
//     overflow: "hidden",
//     position: "relative",
//     minHeight: 120,
//   },
//   cardSelected: {
//     borderWidth: 2,
//     borderColor: "#F97316",
//   },
//   cardHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 8,
//     gap: 6,
//   },
//   cardLabel: {
//     color: "#fff",
//     fontSize: 14,
//     fontWeight: "500",
//   },
//   cardImage: {
//     width: "100%",
//     height: 140,
//     borderRadius: 10,
//   },
//   radio: {
//     position: "absolute",
//     bottom: 10,
//     right: 10,
//     width: 18,
//     height: 18,
//     borderRadius: 9,
//     borderWidth: 2,
//     borderColor: "#fff",
//   },
//   radioSelected: {
//     backgroundColor: "#FF7F00",
//     borderColor: "#FF7F00",
//   },
//   skipButton: {
//     backgroundColor: "#431407",
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 14,
//     borderRadius: 10,
//     marginTop: 30,
//     marginBottom: 10,
//     gap: 6,
//   },
//   skipText: {
//     color: "#F97316",
//     fontWeight: "500",
//   },
// });
