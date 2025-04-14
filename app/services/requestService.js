import axios from "axios";
import { API_URL } from "react-native-dotenv";

export const getRequest = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/user/request/${userId}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const sendFollowReq = async (requesterId, targetId) => {
  try {
    const response = await axios.post(
      `${API_URL}/user/followReq`,
      {
        requesterId: requesterId,
        targetId: targetId,
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

export const acceptReq = async (requestId) => {
  try {
    const response = await axios.post(
      `${API_URL}/user/acceptRequest/${requestId}`,

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

export const rejectReq = async (requestId) => {
  try {
    const response = await axios.post(
      `${API_URL}/user/rejectRequest/${requestId}`,

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
}
export const checkFollowStatus = async (requesterId, targetId) => {
  try {
    const response = await axios.post(`${API_URL}/user/check_follow_status`, {
      requesterId,
      targetId
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const cancelFollowRequest = async (requesterId, targetId) => {
  try {
    const response = await axios.post(`${API_URL}/user/cancel_follow_request`, {
      requesterId,
      targetId,
    });
    console.log(response.data.message); 
  } catch (error) {
    console.error("İstek iptal edilirken bir hata oluştu:", error);
  }
};