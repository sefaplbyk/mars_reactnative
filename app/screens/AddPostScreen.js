import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Button,
  Pressable,
} from "react-native";
import Screen from "../components/layout/Screen";
import { COLORS } from "../config";
import { createPost } from "../services/postService.js";
import { useAuth } from "../context/AuthContext";
import * as ImagePicker from "expo-image-picker";

const AddPostScreen = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);

  const { user } = useAuth();
  const authorId = (user?.luid ? user?.luid : user._id);
  const handlePost = async () => {
    const post = { title, content, authorId };
    await createPost({ title, content, authorId });
    // console.log("Title:", title);
    // console.log("content:", content);
    // alert("Post submitted!");
    setTitle("");
    setContent("");
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });


    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <Screen>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "position"}
      >
        <ScrollView style={styles.container}>
          <Pressable
            onPress={pickImage}
            style={{
              width: "100%",
              height: 400,
            }}
          >
            {image ? (
              <Image
                source={{ uri: image }}
                style={styles.image}
                //  resizeMode="center"
              />
            ) : (
              <Text
                style={{
                  color: "white",
                }}
              >
                Launch Picture
              </Text>
            )}
          </Pressable>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              placeholder="Title"
              value={title}
              onChangeText={setTitle}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Content</Text>
            <TextInput
              style={styles.input}
              placeholder="Content"
              value={content}
              onChangeText={setContent}
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={handlePost}>
            <Text style={styles.buttonText}>Post</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  placeholder: {
    width: 200,
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
  },
  image: {
    flex: 1,
    borderRadius: 10,
  },
  button: {
    borderWidth: 1,
    borderColor: COLORS.secondary,
    backgroundColor: "black",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 5,
    color: "white",
  },
  input: {
    height: 40,
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  containerImg: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default AddPostScreen;
