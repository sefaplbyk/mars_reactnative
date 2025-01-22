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
  console.log(requesterId, targetId, "Here");
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