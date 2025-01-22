import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../config";
import { Ionicons } from "@expo/vector-icons";
import SettingsModal from "../components/settings/SettingsModal";
import { getProfilePic } from "../utils/profilePicUtils";
import {
  checkAccessibilityAndGetUserPost,
  getUserById,
} from "../services/userService";
import Icon from "react-native-vector-icons/Ionicons";
import Post from "../components/post/Post";
import { getLoggedInUserPosts } from "../services/postService";
import { formatDate } from "../utils/formatDate";
import Screen from "../components/layout/Screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { sendFollowReq } from "../services/requestService";

const ProfileScreen = ({ route }) => {
  const { user } = useAuth();
  const navigation = useNavigation();
  const userId = route.params?.id || (user.luid ? user.luid : user._id);
  const [userData, setUserData] = useState({});
  const [postsData, setPostsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(
    !(
      route.params?.id &&
      route.params?.id !== (user.luid ? user.luid : user._id)
    )
  );
  const [refreshing, setRefreshing] = useState(false);

  const getUser = async () => {
    try {
      setLoading(true);
      const userProfile = await getUserById(userId);
      setUserData(userProfile);
    } catch (error) {
      console.log(error, "errorFetchUser");
    } finally {
      setLoading(false);
    }
  };
  const getLoggedUserPost = async () => {
    try {
      setLoading(true);
      const userPosts = await getLoggedInUserPosts(userId);
      setPostsData(userPosts);
    } catch (error) {
      console.log(error, "errorFetchUserPost");
    } finally {
      setLoading(false);
    }
  };

  const getUserPost = async () => {
    try {
      setLoading(true);
      const userPosts = await checkAccessibilityAndGetUserPost(
        user.luid ? user.luid : user._id,
        userId
      );
      setPostsData(userPosts);
    } catch (error) {
      console.log(error, "errorFetchUserPost");
    } finally {
      setLoading(false);
    }
  };
  const fetchUserData = async () => {
    if (isOwnProfile) {
      //Get my post
      await getLoggedUserPost();
    } else {
      //get user Post
      await getUserPost();
    }
    await getUser();
  };
  useEffect(() => {
    fetchUserData();
  }, [userId]);
  const onRefresh = () => {
    setRefreshing(true);
    fetchUserData();
    setTimeout(() => {
      // Yenileme tamamlandıktan sonra 'refreshing' durumunu false yapın
      setRefreshing(false);
    }, 2000); // 2 saniye simülasyonu
  };
  const checkIfFollowing = async () => {
    const isFollowing = await checkIfUserIsFollowing(userId);
    setIsFollowing(isFollowing);
  };
  const handleEditProfile = () => {
    if (isOwnProfile) {
      navigation.navigate("EditProfile");
    }
  };

  const handleFollow = async () => {
    // Takip etme fonksiyonu
    const info = await sendFollowReq(user.luid ? user.luid : user._id, userId);
    console.log(info);
    // followUser(userId);
    // setIsFollowing(true);
  };

  const handleUnfollow = () => {
    // Takipten çıkma fonksiyonu
    unfollowUser(userId);
    setIsFollowing(false);
  };

  if (loading) {
    return (
      <Screen>
        <ActivityIndicator size="large" color={COLORS.secondary} />
      </Screen>
    );
  }
  const renderPostItem = ({ item }) => (
    <Post
      postId={item.id}
      postAuthorId={item.authorId}
      userName={item.userName}
      userEmail={item.userEmail}
      userProfilePic={item.userProfilePic}
      content={item.content}
      likes={item.likes}
      commentsCount={item.commentsCount || 0}
      date={formatDate(item.date)}
      item={item}
    />
  );
  console.log(userData);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Icon
          name="chevron-back"
          size={28}
          color={COLORS.white}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.username}>{userData?.username}</Text>
        <SettingsModal user={userData} />
      </View>
      <View style={styles.profileSection}>
        <View style={styles.profileHeader}>
          <Image
            source={getProfilePic(userData?.profilePicture)}
            style={styles.profileImage}
          />
          <View style={styles.profileStats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userData?.postsCount}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <Pressable
              // disabled={true}
              onPress={() =>
                navigation.navigate("FollowersAndFollowingScreen", {
                  username: userData?.fullname,
                  id: userId,
                })
              }
              style={styles.statItem}
            >
              <Text style={styles.statNumber}>{userData?.followersCount}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </Pressable>
            <Pressable
              disabled={!postsData?.accessibility}
              onPress={() =>
                navigation.navigate("FollowersAndFollowingScreen", {
                  username: userData?.fullName,
                })
              }
              style={styles.statItem}
            >
              <Text style={styles.statNumber}>{userData?.followingsCount}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.bioSection}>
          <Text style={styles.name}>{userData?.fullname}</Text>
          <Text style={styles.bio}>{userData?.bio}</Text>
        </View>

        <View style={styles.buttonGroup}>
          {isOwnProfile ? (
            <TouchableOpacity
              style={styles.editButton}
              onPress={handleEditProfile}
            >
              <Text style={styles.buttonText}>Edit Profile</Text>
            </TouchableOpacity>
          ) : isFollowing ? (
            <TouchableOpacity
              style={styles.editButton}
              onPress={handleUnfollow}
            >
              <Text style={styles.buttonText}>Takipten Çık</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.editButton} onPress={handleFollow}>
              <Text style={styles.buttonText}>Takip Et</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <FlatList
        data={postsData}
        renderItem={renderPostItem}
        keyExtractor={(item) => item.id.toString()}
        scrollEnabled={false}
        contentContainerStyle={styles.postsContainer}
      />
      {userData.isPrivate && route.params?.id && (
        <Text
          style={{
            color: COLORS.white,
            textAlign: "center",
            fontSize: 24,
          }}
        >
          Bu Hesap Gizlidir, Postları görmek için takip ediniz.
        </Text>
      )}
      {postsData?.length === 0 && (
        <Text
          style={{
            color: COLORS.white,
            textAlign: "center",
          }}
        >
          Gösterilecek hiç post yok.
        </Text>
      )}
      <Pressable onPress={() => navigation.navigate("AddPost")}>
        <Text
          style={{
            color: COLORS.white,
            textAlign: "center",
            marginTop: 30,
            fontSize: 20,
          }}
        >
          {postsData?.length === 0 &&
            (userId === (user.luid ? user.luid : user._id)
              ? "Post paylaşmak için tıklayın."
              : "")}
        </Text>
      </Pressable>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    marginBottom: 15,
  },
  username: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: "bold",
  },
  profileSection: {
    padding: 15,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: COLORS.secondary,
  },
  profileStats: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    marginLeft: 15,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  statLabel: {
    color: COLORS.white,
    fontSize: 12,
  },
  bioSection: {
    marginBottom: 15,
  },
  name: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  bio: {
    color: COLORS.white,
    fontSize: 14,
    marginTop: 5,
  },
  website: {
    color: "#3897f0",
    fontSize: 14,
    marginTop: 5,
  },
  buttonGroup: {
    flexDirection: "row",
    marginBottom: 15,
    gap: 10,
  },
  editButton: {
    flex: 1,
    backgroundColor: COLORS.secondary,
    padding: 8,
    borderRadius: 6,
    alignItems: "center",
  },
  shareButton: {
    backgroundColor: COLORS.secondary,
    padding: 8,
    borderRadius: 6,
    width: 40,
    alignItems: "center",
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: "600",
  },

  postsContainer: {
    padding: 2,
  },
  postContainer: {
    flex: 1 / 3,
    aspectRatio: 1,
    padding: 2,
  },
  postImage: {
    width: "100%",
    height: "100%",
  },
});

export default ProfileScreen;
