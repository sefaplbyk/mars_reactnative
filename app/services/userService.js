import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "react-native-dotenv";

export const getAllUsers = async () => {
  const userId = await AsyncStorage.getItem("userId");
  try {
    const response = await axios.get(`${API_URL}/users/all/${userId}`);
    return response.data;
  } catch (error) { }
};

export const getUserById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/users/${id}`);
    return response.data;
  } catch (error) { }
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

export const toggleUserPrivacy = async (userId, isPrivate) => {
  try {
    const response = await axios.put(`${API_URL}/users/userPrivacy/${userId}`, {
      isPrivate: isPrivate,
    });
    return response.data;
  } catch (error) { }
};

export const checkAccessibilityAndGetUserPost = async (userId, profileId) => {
  try {
    const res = await axios.get(`${API_URL}/users/profile/getUserPost`, {
      params: {
        userId: userId,
        profileId: profileId,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching user posts:", error.message);
  }
};

export const getFollowers = async (userId) => {
  try {
    const res = await axios.get(`${API_URL}/users/followers/${userId}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching user posts:", error.message);
  }
};

export const getFollowings = async (userId) => {
  try {
    const res = await axios.get(`${API_URL}/users/followings/${userId}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching user posts:", error.message);
  }
};

export const updateUserProfile = async (userId, fullname, bio) => {
  try {
    const response = await axios.put(`${API_URL}/users/profile/update/${userId}`, {
      fullname,
      bio,
    });

    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data || error.message
    };
  }
};