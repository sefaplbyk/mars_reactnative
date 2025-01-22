import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { COLORS } from "../config";
import axios from "axios";
import { API_URL } from "react-native-dotenv";

export default function RegisterScreen({ navigation }) {
  const [user, setUser] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const validateAndRegister = async () => {
    if (
      !user.name ||
      !user.username ||
      !user.email ||
      !user.password ||
      !user.confirmPassword
    ) {
      setError("All fields are required.");
      return;
    }
    if (user.password !== user.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post(API_URL + "/auth/register", {
        name: user.name,
        username: user.username,
        email: user.email,
        password: user.password,
      });

      if (response.status === 201) {
        Alert.alert(
          "Registration Successful",
          "You have successfully registered.",
          [
            {
              text: "OK",
              onPress: () => {
                navigation.navigate("LoginScreen");
              },
            },
          ]
        );
      }
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/registerBg.jpg")}
        resizeMode="cover"
        style={styles.bgImage}
      >
        <View
          style={{
            width: "80%",
          }}
        >
          <Text style={styles.titleText}>Mars Media</Text>
          <View
            style={{
              gap: 20,
            }}
          >
            <TextInput
              style={styles.textInput}
              placeholderTextColor={"gray"}
              placeholder="Name or full name"
              maxLength={20}
              value={user.name}
              onChangeText={(text) => setUser({ ...user, name: text })}
            />
            <TextInput
              style={styles.textInput}
              placeholderTextColor={"gray"}
              placeholder="User Name"
              maxLength={10}
              value={user.username}
              onChangeText={(text) => setUser({ ...user, username: text })}
            />
            <TextInput
              style={styles.textInput}
              placeholderTextColor={"gray"}
              placeholder="E-Mail"
              value={user.email}
              onChangeText={(text) => setUser({ ...user, email: text })}
            />
            <TextInput
              style={styles.textInput}
              placeholderTextColor={"gray"}
              placeholder="Password"
              value={user.password}
              onChangeText={(text) => setUser({ ...user, password: text })}
              secureTextEntry={true}
            />
            <TextInput
              style={styles.textInput}
              placeholderTextColor={"gray"}
              placeholder="Confirm Password"
              value={user.confirmPassword}
              onChangeText={(text) =>
                setUser({ ...user, confirmPassword: text })
              }
              secureTextEntry={true}
            />
          </View>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          {/* Login-Register Button */}
          <View
            style={{
              gap: 20,
              marginTop: 20,
            }}
          >
            <TouchableOpacity
              onPress={validateAndRegister}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2E5077",
  },
  bgImage: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  titleText: {
    textAlign: "right",
    color: "white",
    fontSize: 50,
    marginBottom: 20,
  },
  textInput: {
    color: COLORS.white,
    backgroundColor: "none",
    borderBottomWidth: 2,
    borderColor: COLORS.secondary,
    paddingVertical: 15,
  },
  button: {
    borderRadius: 30,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.secondary,
    padding: 15,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },
});
