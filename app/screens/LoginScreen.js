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
import axios from 'axios';
import { useAuth } from "../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";


import {API_URL} from 'react-native-dotenv';

export default function LoginScreen({ navigation }) {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  console.log(API_URL)
  const {login} = useAuth()

  const handleLogin = async () => {
    if (!credentials.email || !credentials.password) {
      setError("Email and password are required.");
      return;
    }

    try {
      const response = await axios.post(API_URL+'/auth/login', {
        email: credentials.email,
        password: credentials.password
      });
      if (response.status === 200) {
        // navigation.navigate("HomeNavigator");
        AsyncStorage.setItem('userToken', response.data.token)
      await AsyncStorage.setItem('userId', response.data.user.id);

      login({
        id: response.data.user.id,
        email: response.data.user.email,
        username: response.data.user.username,
        profilePicture: response.data.user.profilePicture
      });
      }
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/registerBg.jpg")}
        resizeMode="cover"
        style={styles.bgImage}
      >
        <View style={{ width: "80%" }}>
          <Text style={styles.titleText}>Mars Media</Text>
          <View style={{ gap: 20 }}>
            <TextInput
              style={styles.textInput}
              placeholderTextColor={"gray"}
              placeholder="E-Mail"
              secureTextEntry = {false}
              value={credentials.email}
              onChangeText={(text) => setCredentials({ ...credentials, email: text })}
              keyboardType="email-address"
            />
            <TextInput
              style={styles.textInput}
              placeholderTextColor={"gray"}
              placeholder="Password"
              secureTextEntry = {true}
              value={credentials.password}
              onChangeText={(text) => setCredentials({ ...credentials, password: text })}
            />
          </View>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <View style={{ gap: 20, marginTop: 20 }}>
            <TouchableOpacity onPress={handleLogin} style={styles.button}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("RegisterScreen")}
              style={[styles.button, { backgroundColor: 'transparent', borderWidth: 1, borderColor: COLORS.secondary }]}
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
