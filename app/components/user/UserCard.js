import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Pressable,
} from "react-native";
import React from "react";
import { COLORS } from "../../config";
import { getProfilePic } from "../../utils/profilePicUtils";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../context/AuthContext";
import { sendFollowReq } from "../../services/requestService";

const UserCard = ({ username, email, profilePicture, id }) => {
  const { user } = useAuth();
  console.log(user)
  const userId = user._id || user.luid;
  // const userId = user.luid ? user.luid : user._id
  const navigation = useNavigation();

  const handleFollow = async () => {
    await sendFollowReq(userId, id);
  };

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
        width: "48%",
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
      <TouchableOpacity
        style={{
          backgroundColor: COLORS.accent,
          padding: 10,
          width: "80%",
          borderRadius: 10,
        }}
        onPress={handleFollow}
      >
        <Text
          style={{
            color: COLORS.text,
            textAlign: "center",
            fontWeight: "500",
          }}
        >
          Follow
        </Text>
      </TouchableOpacity>
    </Pressable>
  );
};

export default UserCard;

const styles = StyleSheet.create({});
