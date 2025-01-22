import axios from "axios";
import { API_URL } from "react-native-dotenv";

export const createPost = async (postData) => {
  try {
    console.log(
      "Attempting to create post with URL:",
      `${API_URL}/posts/create`
    );
    console.log("Post data:", postData);

    const response = await axios.post(
      `${API_URL}/posts/create`,
      {
        title: postData.title,
        content: postData.content,
        authorId: postData.authorId,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Post creation successful:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error details:", {
      message: error.message,
      response: error.response?.data,
      url: error.config?.url,
      status: error.response?.status,
      method: error.config?.method,
    });
    throw error;
  }
};

export const getAllPosts = async () => {
  try {
    const response = await axios.get(`${API_URL}/posts/all`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getLoggedInUserPosts = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/posts/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const addComment = async (commentData) => {
  try {
    const response = await axios.post(
      `${API_URL}/posts/addComment`,
      {
        postId: commentData.postId,
        authorId: commentData.authorId,
        content: commentData.content,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getComment = async (postId) => {
  try {
    const response = await axios.get(
      `${API_URL}/posts/getPostComment/${postId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error details:", {
      message: error.message,
      response: error.response?.data,
      url: error.config?.url,
      status: error.response?.status,
      method: error.config?.method,
    });
  }
};

export const togglePostLike = async (postId, userId) => {
  try {
    const response = await axios.post(`${API_URL}/posts/toggleLike/${postId}`, {
      userId,
    });
    return response.data;
  } catch (error) {
    console.error("Error details:", {
      message: error.message,
      response: error.response?.data,
      url: error.config?.url,
      status: error.response?.status,
      method: error.config?.method,
    });
  }
};

export const getPost = async (postId) => {
  try {
    const response = await axios.get(`${API_URL}/posts/postDetail/${postId}`);
    return response.data;
  } catch (error) {
    console.error("Error details:", {
      message: error.message,
      response: error.response?.data,
      url: error.config?.url,
      status: error.response?.status,
      method: error.config?.method,
    });
  }
};
