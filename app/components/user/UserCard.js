import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Pressable,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { COLORS } from "../../config";
import { getProfilePic } from "../../utils/profilePicUtils";
import { useFocusEffect, useIsFocused, useNavigation } from "@react-navigation/native";
import { useAuth } from "../../context/AuthContext";
import { cancelFollowRequest, checkFollowStatus, sendFollowReq } from "../../services/requestService";
import { getFollowings, unfollowUser } from "../../services/userService";

const UserCard = ({ username, email, profilePicture, id }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [followStatus, setFollowStatus] = useState(null);

  const { user } = useAuth();
  const userId = user._id || user.luid;
  // const userId = user.luid ? user.luid : user._id
  const navigation = useNavigation();

  const checkIfFollowing = async () => {
    try {
      const followings = await getFollowings(userId);
      const isFollowingUser = followings.some((f) => f._id === id);
      const res = await checkFollowStatus(userId, id)
      setFollowStatus(res.status)
      setIsFollowing(isFollowingUser);
    } catch (err) {
      console.log("Takip kontrolü başarısız:", err);
    }
  };

  const handleFollow = async () => {
    try {
      await sendFollowReq(userId, id);
      await checkIfFollowing();
    } catch (err) {
      console.log("Takip isteği gönderilemedi:", err);
    }
  };
  const handleUnfollow = async () => {
    try {
      await unfollowUser(userId, id);
      setIsFollowing(false);
    } catch (err) {
      console.log("Takipten çıkılamadı:", err);
    }
  };
  const handleCancelFollowRequest = async () => {
    try {
      await cancelFollowRequest(id, userId)
      setFollowStatus("")
    } catch (err) {
      console.log("Takip kontrolü başarısız:", err);
    }
  }

  useEffect(() => {
    checkIfFollowing()
  }, [])
 
  return (
    <Pressable
      onPress={() => navigation.navigate("UserProfile", { id })}
      style={{
        borderWidth: 1,
        backgroundColor: "rgba(0,0,0,0.7)",
        borderColor: "white",
        alignItems: "center",
        borderRadius: 10,
        paddingVertical: 20,
        minWidth: "48%",
        gap: 10,
      }}
    >
      <Image
        source={getProfilePic(profilePicture)}
        style={{
          width: 100,
          height: 100,
          borderRadius: 50,
        }}
      />
      <View>
        <Text
          style={{
            textAlign: "center",
            color: "white",
            fontWeight: "900",
            fontSize: 16,
          }}
        >
          {username}
        </Text>
        <Text
          style={{
            textAlign: "center",
            color: "white",
            fontWeight: "500",
          }}
        >
          {email}
        </Text>
      </View>
      {isFollowing ? (
        <TouchableOpacity
          style={[styles.profileBtn, { backgroundColor: COLORS.gray, }]}
          onPress={handleUnfollow}
        >
          <Text style={styles.buttonText}>Takipten Çık</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={[styles.profileBtn, { backgroundColor: COLORS.gray, }]}
          onPress={followStatus == "pending" ? handleCancelFollowRequest : handleFollow}>
          {/* Takip isteği yollandıysa -> Takip isteği yollandı Yollanmadıysa -> Takip et  */}
          <Text style={styles.buttonText}>{followStatus == "pending" ? "Takip isteğini iptal et" : "Takip Et"}</Text>
        </TouchableOpacity>
      )}
    </Pressable>
  );
};

export default UserCard;

const styles = StyleSheet.create({
  profileBtn: {
    flex: 1,
    padding: 8,
    borderRadius: 6,
    alignItems: "center",
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: "600",
  },
});
