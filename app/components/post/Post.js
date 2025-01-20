import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import React, { useCallback, useState } from "react";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../../config";
import { getProfilePic } from "../../utils/profilePicUtils";
import { togglePostLike } from "../../services/postService";
import { useAuth } from "../../context/AuthContext";

const Post = ({
  postAuthorId,
  postId,
  userName,
  userEmail,
  userProfilePic,
  content,
  commentsCount,
  likes,
  date,
  item,
}) => {
  const { user } = useAuth();
  const [liked, setLiked] = useState(likes.includes((user.luid ? user.luid : user._id)) || false);
  const navigation = useNavigation();
  const [textShown, setTextShown] = useState(false);
  const [lengthMore, setLengthMore] = useState(false);
  const [likesLength, setLikesLength] = useState(likes.length || 0);
  const toggleNumberOfLines = () => {
    setTextShown(!textShown);
  };
  const onTextLayout = useCallback((e) => {
    setLengthMore(e.nativeEvent.lines.length >= 4);
  }, []);
  const handlePostDetail = () => {
    navigation.navigate("PostNavigator", {
      screen: "PostDetailScreen",
      params: {
        postId:postId
      },
    });
  };
  const handlePressLike = async () => {
    await togglePostLike(postId, user.luid ? user.luid : user._id);
    setLiked(!liked);
    setLikesLength(liked ? likesLength - 1 : likesLength + 1);
  };
  return (
    <View style={styles.postContainer}>
      {/* Post Left  */}
      <Pressable
        onPress={() => navigation.navigate("UserProfile", { id: postAuthorId })}
      >
        <Image
          source={getProfilePic(userProfilePic)}
          style={styles.userProfilePhoto}
        />
      </Pressable>
      {/* Post Right */}
      <View style={styles.postRight}>
        <Pressable
          onPress={() =>
            navigation.navigate("UserProfile", { id: postAuthorId })
          }
          style={styles.postHeader}
        >
          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.userEmail}>{userEmail}</Text>
        </Pressable>
        <Pressable onPress={handlePostDetail}>
          <Text
            onTextLayout={onTextLayout}
            numberOfLines={textShown ? undefined : 2}
            style={styles.postContent}
          >
            {content}
          </Text>

          {lengthMore ? (
            <Text
              onPress={toggleNumberOfLines}
              style={{
                lineHeight: 21,
                color: "gray",
                fontWeight: "bold",
                textAlign: "right",
              }}
            >
              {textShown ? "Read less..." : "Read more..."}
            </Text>
          ) : null}
          {/* <Text style={styles.postContent}>{content}</Text> */}
        </Pressable>
        {/* Actions */}
        <View style={styles.actions}>
          <View style={{ flexDirection: "row", gap: 20 }}>
            <Pressable onPress={handlePostDetail} style={styles.actionItem}>
              <Icon name="chatbubble-outline" color={COLORS.white} size={24} />
              <Text style={styles.actionText}>{commentsCount}</Text>
            </Pressable>

            <View style={styles.actionItem}>
              {liked ? (
                <Icon
                  name="heart-sharp"
                  color={COLORS.white}
                  size={24}
                  onPress={handlePressLike}
                />
              ) : (
                <Icon
                  name="heart-outline"
                  color={COLORS.white}
                  size={24}
                  onPress={handlePressLike}
                />
              )}
              <Text style={styles.actionText}>{likesLength}</Text>
            </View>
          </View>
          <Text style={styles.postDate}>{date}</Text>
        </View>
      </View>
      <View style={styles.separator} />
    </View>
  );
};

export default Post;
const styles = StyleSheet.create({
  postContainer: {
    flexDirection: "row",
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: "rgba(12,12,12,0.75)",
  },
  userProfilePhoto: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.white,
    borderRadius: 25,
  },
  postRight: {
    paddingHorizontal: 10,
    gap: 10,
    flex: 1,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 6,
  },
  userName: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 16,
  },
  userEmail: {
    color: COLORS.white,
    fontSize: 12,
  },
  postContent: {
    color: COLORS.white,
    paddingRight: 10,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 20,
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  actionText: {
    color: COLORS.white,
  },
  postDate: {
    color: "gray",
    fontSize: 12,
    textAlign: "right",
  },
  separator: {
    position: "absolute",
    borderWidth: 0.25,
    borderColor: COLORS.white,
    bottom: 0,
    left: 0,
    right: 0,
  },
});
