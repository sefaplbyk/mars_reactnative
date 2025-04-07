import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Pressable,
} from "react-native";
import { COLORS } from "../config";
import Screen from "../components/layout/Screen";

const scientists = [
  {
    id: 1,
    name: "Albert Einstein",
    image: require("../../assets/aEinstein.jpeg"),
  },
  {
    id: 2,
    name: "Nikola Tesla",
    image: require("../../assets/NikolaTesla.jpeg"),
  },
  {
    id: 3,
    name: "Isaac Newton",
    image: require("../../assets/IsaacNewton.jpeg"),
  },
  {
    id: 4,
    name: "Galileo Galilei",
    image: require("../../assets/GalileoGalilei.jpeg"),
  },
  { id: 5, name: "Elon Musk", image: require("../../assets/elonMusk.jpeg") },
  {
    id: 6,
    name: "Louis Pasteur",
    image: require("../../assets/LouisPasteur.jpeg"),
  },
  {
    id: 7,
    name: "Robert Oppenheimer",
    image: require("../../assets/RobertOppenheimer.jpeg"),
  },
  { id: 8, name: "Thomas Edison", image: require("../../assets/tEdison.jpeg") },
];

const EducationScreen = ({ navigation }) => {
  const renderScientist = ({ item }) => (
    <Pressable
      style={styles.scientistCard}
      onPress={() => navigation.navigate("ChatBotScreen", { scientist: item })}
    >
      <Image source={item.image} style={styles.scientistImage} />
      <View style={styles.scientistInfo}>
        <Text style={styles.scientistName}>{item.name}</Text>
        {/* <Text style={styles.scientistDesc}>{item.description}</Text> */}
      </View>
    </Pressable>
  );

  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.header}>Chat with Scientists</Text>
        <FlatList
          data={scientists}
          renderItem={renderScientist}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.accent,
    padding: 16,
    textAlign: "center",
  },
  list: {
    padding: 16,
  },
  scientistCard: {
    flexDirection: "row",
    borderRadius: 12,
    marginBottom: 16,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    borderColor: COLORS.accent,
  },
  scientistImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  scientistInfo: {
    marginLeft: 16,
    flex: 1,
  },
  scientistName: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.white,
    marginBottom: 4,
  },
  scientistDesc: {
    fontSize: 14,
    color: COLORS.gray,
  },
});

export default EducationScreen;
