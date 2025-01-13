import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

const ChatHeader = ({ user }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() =>
        navigation.navigate("HomeNavigator", {
          screen: "ProfileScreen",
        })
      }
    >
      <Image source={{ uri: user.avatar }} style={styles.avatar} />
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{user.firstName}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  titleContainer: {
    justifyContent: "center",
  },
  title: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  onlineStatus: {
    color: "#4CAF50",
    fontSize: 12,
  },
});

export default ChatHeader;
