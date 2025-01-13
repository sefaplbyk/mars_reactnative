import { View, Text, StyleSheet } from "react-native";
import React from "react";

const Comment = ({ userName, content }) => {
  return (
    <View style={styles.commentContainer}>
      <Text style={styles.userName}>{userName}</Text>
      <Text style={styles.content}>{content}</Text>
    </View>
  );
};

export default Comment;

const styles = StyleSheet.create({
  commentContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "gray",
  },
  userName: {
    fontWeight: "bold",
    color: "white",
  },
  content: {
    color: "white",
  },
});
