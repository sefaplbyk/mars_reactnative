import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import React, { useCallback, useState } from "react";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../../config";
import { getProfilePic } from "../../utils/profilePicUtils";
import { togglePostLike } from "../../services/postService";
import { useAuth } from "../../context/AuthContext";

const Post = ({
  postId,
  postAuthorId,
  userName,
  userEmail,
  userProfilePic,
  content,
  imageUrl,
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
      {/* Header Section */}
      <View style={styles.headerSection}>
        <Pressable 
          style={styles.userInfo}
          onPress={() => navigation.navigate("UserProfile", { id: postAuthorId })}
        >
          <Image
            source={getProfilePic(userProfilePic)}
            style={styles.avatar}
          />
          <View style={styles.userTexts}>
            <Text style={styles.userName}>{userName}</Text>
            <Text style={styles.userEmail}>{userEmail}</Text>
          </View>
        </Pressable>
        <Text style={styles.dateText}>{date}</Text>
      </View>

      {/* Content Section */}
      <Pressable onPress={handlePostDetail}>
        {/* Text Content */}
        {content && (
          <Text 
            style={[
              styles.contentText,
              imageUrl ? { marginBottom: 12 } : null
            ]} 
            numberOfLines={textShown ? undefined : 3}
            onTextLayout={onTextLayout}
          >
            {content}
          </Text>
        )}
        
        {/* Image Content */}
        {imageUrl && (
          <View style={styles.imageWrapper}>
            <Image 
              source={{ uri: imageUrl }} 
              style={styles.postImage}
              resizeMode="contain"
            />
          </View>
        )}
      </Pressable>

      {/* Actions Section */}
      <View style={styles.actionsContainer}>
        <Pressable onPress={handlePostDetail} style={styles.actionButton}>
          <Icon name="chatbubble-outline" color={COLORS.white} size={22} />
          <Text style={styles.actionText}>{commentsCount}</Text>
        </Pressable>

        <Pressable onPress={handlePressLike} style={styles.actionButton}>
          <Icon
            name={liked ? "heart" : "heart-outline"}
            color={liked ? COLORS.primary : COLORS.white}
            size={22}
          />
          <Text style={styles.actionText}>{likesLength}</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  postContainer: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 15,
    padding: 15,
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  userTexts: {
    justifyContent: 'center',
  },
  userName: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 15,
  },
  userEmail: {
    color: COLORS.gray,
    fontSize: 12,
  },
  dateText: {
    color: COLORS.gray,
    fontSize: 12,
  },
  contentText: {
    color: COLORS.white,
    fontSize: 14,
    lineHeight: 20,
  },
  imageWrapper: {
    width: '100%',
    height: 250,
    borderRadius: 10,
    overflow: 'hidden',
    marginVertical: 8,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  postImage: {
    width: '100%',
    height: '100%',
    borderRadius:20
  },
  actionsContainer: {
    flexDirection: 'row',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    padding: 5,
  },
  actionText: {
    color: COLORS.white,
    marginLeft: 5,
    fontSize: 14,
  }
});

export default Post;
