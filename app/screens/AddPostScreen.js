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
  Pressable,
  Alert,
} from "react-native";
import Screen from "../components/layout/Screen";
import { COLORS } from "../config";
import { createPost } from "../services/postService.js";
import { useAuth } from "../context/AuthContext";
import * as ImagePicker from "expo-image-picker";
import {CLOUDINARY_URL} from "react-native-dotenv"
const AddPostScreen = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const authorId = (user?.luid ? user?.luid : user._id);

  const uploadImageToCloudinary = async (uri) => {
    try {
      const formData = new FormData();
      const filename = uri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;

      formData.append('file', {
        uri,
        type,
        name: filename
      });
      
      formData.append('upload_preset', 'mars_social_preset');

      const response = await fetch(
        `${CLOUDINARY_URL}`,
        {
          method: 'POST',
          body: formData
        }
      );

      const data = await response.json();
      console.log("Upload response:", data); 

      if (data.error) {
        console.error("Cloudinary error:", data.error);
        throw new Error(data.error.message);
      }
      return data.secure_url;
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      return null;
    }
  };

  const handlePost = async () => {
    try {
      let imageUrl = '';
      if (image) {
        imageUrl = await uploadImageToCloudinary(image);
        if (!imageUrl) {
          Alert.alert('Error', 'Failed to upload image');
          return;
        }
      }

      const postData = {
        title,
        content,
        authorId,
        imageUrl
      };

      await createPost(postData);
      setTitle('');
      setContent('');
      setImage(null);
      
      Alert.alert('Success', 'Post created successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to create post');
      console.error(error);
    }
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
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
                resizeMode="cover"
              />
            ) : (
              <Text
                style={{
                  color: "white",
                  textAlign: "center",
                  marginTop: 150,
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
          <TouchableOpacity
            style={styles.button}
            onPress={handlePost}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Posting..." : "Post"}
            </Text>
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
});

export default AddPostScreen;
