import {
  View,
  Text,
  Image,
  TextInput,
  FlatList,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import Icon from "react-native-vector-icons/Ionicons";
import Comment from "../components/comment/Comment";
import Screen from "../components/layout/Screen";
import { COLORS } from "../config";
import {
  addComment,
  getComment,
  getPost,
  togglePostLike,
} from "../services/postService";
import { useAuth } from "../context/AuthContext";
import { getProfilePic } from "../utils/profilePicUtils";
import { formatDate } from "../utils/formatDate";

const PostDetailScreen = ({ route }) => {
  const { user } = useAuth();
  const { postId } = route.params;
  const [post, setPost] = useState();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [liked, setLiked] = useState(
    post?.likes.includes(user.luid ? user.luid : user._id) || false
  );
  const [likesLength, setLikesLength] = useState(post?.likes.length || 0);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [textShown, setTextShown] = useState(false);
  const [lengthMore, setLengthMore] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPost();
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [post]);

  const toggleNumberOfLines = () => {
    setTextShown(!textShown);
  };

  const onTextLayout = useCallback((e) => {
    setLengthMore(e.nativeEvent.lines.length >= 4);
  }, []);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const fetchedPost = await getPost(postId);
      setPost(fetchedPost);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const fetchComments = async () => {
    try {
      setCommentsLoading(true);
      const commentsData = await getComment(post._id);
      setComments(commentsData);
    } catch (error) {
      console.log("Error fetching comments:", error);
    } finally {
      setCommentsLoading(false);
    }
  };
  const handleComment = async () => {
    const resComm = await addComment({
      postId: post._id,
      authorId: user.luid ? user.luid : user._id,
      content: newComment,
    });
    setComments([resComm, ...comments]);
    setNewComment("");
  };
  const toggleLike = async () => {
    togglePostLike(post._id, user.luid ? user.luid : user._id);
    setLikesLength(liked ? likesLength - 1 : likesLength + 1);
    setLiked(!liked);
  };
  useEffect(() => {
    if (post) {
      setLiked(post?.likes.includes(user.luid ? user.luid : user._id));
      setLikesLength(post.likes.length);
    }
  }, [post, user]);

  const renderCommentItem = ({ item }) => {
    return (
      <View style={styles.commentWrapper}>
        <Image
          source={getProfilePic(item?.authorId?.profilePicture)}
          style={styles.commentAvatar}
        />
        <View style={styles.commentContent}>
          <View style={styles.commentHeader}>
            <Text style={styles.commentUserName}>
              {item.authorId?.username}
            </Text>
            <Text style={styles.commentTime}>{formatDate(item.createdAt)}</Text>
          </View>
          <Text style={styles.commentText}>{item.content}</Text>
        </View>
      </View>
    );
  };
  if (loading) {
    return (
      <Screen>
        <ActivityIndicator size="large" color={COLORS.secondary} />
      </Screen>
    );
  }
  return (
    <View style={styles.container}>
      <View style={styles.postContainer}>
        {/* Post Left */}
        <View>
          <Image
            source={getProfilePic(post.authorId.profilePicture)}
            style={styles.userProfilePhoto}
          />
        </View>
        {/* Post Right */}
        <View style={styles.postRight}>
          <View style={styles.postHeader}>
            <Text style={styles.userName}>{post.authorId.username}</Text>
            <Text style={styles.userEmail}>{post.authorId.email}</Text>
          </View>
          {/* <Text style={styles.postContent}>{post.title}</Text> */}
          <ScrollView style={{ maxHeight: 200 }}>
            <Text
              onTextLayout={onTextLayout}
              numberOfLines={textShown ? undefined : 5}
              style={styles.postContent}
            >
              {post.content}
            </Text>
          </ScrollView>
          {lengthMore ? (
            <Text
              onPress={toggleNumberOfLines}
              style={{
                lineHeight: 21,
                color: COLORS.primary,
                textAlign: "right",
              }}
            >
              {textShown ? "Read less..." : "Read more..."}
            </Text>
          ) : null}
          {/* Actions */}
          <View style={styles.actions}>
            <View style={{ flexDirection: "row", gap: 20 }}>
              <View style={styles.actionItem}>
                <Icon name="chatbubble-outline" color={"white"} size={24} />
                <Text style={styles.actionText}>{comments?.length ?? 0}</Text>
              </View>
              <View style={styles.actionItem}>
                {liked ? (
                  <Icon
                    name="heart-sharp"
                    color={"white"}
                    size={24}
                    onPress={toggleLike}
                  />
                ) : (
                  <Icon
                    name="heart-outline"
                    color={"white"}
                    size={24}
                    onPress={toggleLike}
                  />
                )}
                <Text style={styles.actionText}>{likesLength}</Text>
              </View>
            </View>
            <Text style={styles.postDate}>{formatDate(post.createdAt)}</Text>
          </View>
        </View>
        {/* <View style={styles.separator} /> */}
      </View>
      {/* Comments Section */}
      <View style={styles.commentsSection}>
        <Text style={styles.commentsSectionTitle}>Comments</Text>
        {commentsLoading ? (
          <ActivityIndicator color={COLORS.primary} size="large" />
        ) : (
          <FlatList
            data={comments}
            renderItem={renderCommentItem}
            keyExtractor={(item) => item._id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.commentsContainer}
            ItemSeparatorComponent={() => (
              <View style={styles.commentSeparator} />
            )}
            ListEmptyComponent={
              <Text
                style={{
                  color: COLORS.white,
                  textAlign: "center",
                }}
              >
                Henüz yorum yok konuşmayı başlat....
              </Text>
            }
          />
        )}
      </View>
      <View style={styles.commentInputWrapper}>
        <Image
          source={getProfilePic(user.profilePicture)}
          style={styles.inputAvatar}
        />
        <View style={styles.commentInputContainer}>
          <TextInput
            style={styles.commentInput}
            placeholder="Write a comment..."
            placeholderTextColor="#666"
            value={newComment}
            onChangeText={setNewComment}
            multiline
            maxLength={100}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              !newComment.trim() && styles.sendButtonDisabled,
            ]}
            onPress={handleComment}
            disabled={!newComment.trim()}
          >
            <Icon
              name="send"
              size={20}
              color={newComment.trim() ? COLORS.primary : "#666"}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default PostDetailScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "black",
    flex: 1,
  },
  postContainer: {
    flexDirection: "row",
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: "rgba(0,0,0,0.75)",
    marginBottom: 20,
  },
  userProfilePhoto: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 25,
  },
  postRight: {
    paddingHorizontal: 10,
    gap: 10,
    flex: 1,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  userName: {
    color: "white",
    fontWeight: "bold",
  },
  userEmail: {
    color: "white",
    fontWeight: "bold",
  },
  postDate: {
    color: "gray",
    fontSize: 12,
    textAlign: "right",
  },
  separator: {
    position: "absolute",
    borderWidth: 0.25,
    borderColor: "white",
    bottom: 0,
    left: 0,
    right: 0,
  },
  postContent: {
    color: "white",
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
    color: "white",
  },
  commentsList: {
    width: "100%",
    maxHeight: 400,
  },
  commentsContainer: {
    paddingBottom: 20,
  },
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginTop: 20,
  },
  commentInput: {
    flex: 1,
    color: "white",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  commentsSection: {
    flex: 1,
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.accent,
    paddingTop: 10,
  },
  commentsSectionTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  commentWrapper: {
    flexDirection: "row",
    padding: 10,
    gap: 10,
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  commentUserName: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  commentTime: {
    color: "#666",
    fontSize: 12,
  },
  commentText: {
    color: "white",
    fontSize: 14,
    lineHeight: 20,
  },
  commentActions: {
    flexDirection: "row",
    marginTop: 8,
    gap: 16,
  },
  commentAction: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  commentActionText: {
    color: "#666",
    fontSize: 12,
  },
  commentSeparator: {
    height: 1,
    backgroundColor: "#222",
    marginVertical: 10,
  },
  commentInputWrapper: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 0.5,
    borderTopColor: "#222",
    gap: 10,
    alignItems: "center",
  },
  inputAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  commentInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#222",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  commentInput: {
    flex: 1,
    color: "white",
    fontSize: 14,
    maxHeight: 100,
    padding: 0,
  },
  sendButton: {
    padding: 4,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});
