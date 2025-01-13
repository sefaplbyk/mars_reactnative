import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "react-native-dotenv";

export const getAllUsers = async () => {
  const userId = await AsyncStorage.getItem("userId");
  try {
    const response = await axios.get(`${API_URL}/users/all/${userId}`);
    return response.data;
  } catch (error) {}
};

export const getUserById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/users/${id}`);
    return response.data;
  } catch (error) {}
};

export const getUserByEmail = async (email) => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    if (!token) {
      throw new Error("Authentication token not found");
    }

    const response = await axios.get(`${API_URL}/users/profile/${email}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.data) {
      return response.data.data || response.data;
    }

    throw new Error("Invalid response format");
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Server error");
    } else if (error.request) {
      throw new Error("Network error. Please check your connection.");
    } else {
      throw new Error(error.message || "Something went wrong");
    }
  }
};
