import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Pressable,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../config";
import SettingsModal from "../components/settings/SettingsModal";
import { getProfilePic } from "../utils/profilePicUtils";
import {
  checkAccessibilityAndGetUserPost,
  getFollowings,
  getUserById,
  unfollowUser
} from "../services/userService";
import Icon from "react-native-vector-icons/Ionicons";
import Post from "../components/post/Post";
import { getLoggedInUserPosts } from "../services/postService";
import { formatDate } from "../utils/formatDate";
import Screen from "../components/layout/Screen";
import { sendFollowReq } from "../services/requestService";
import EditProfileModal from "../components/profile/EditProfileModal";

const ProfileScreen = ({ route }) => {
  const { user } = useAuth();
  const navigation = useNavigation();
  const userId = route.params?.id || (user.luid ? user.luid : user._id);

  const [userData, setUserData] = useState({});
  const [postsData, setPostsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const isOwnProfile =
    !route.params?.id || route.params?.id === (user.luid || user._id);

  const fetchUser = async () => {
    try {
      const userProfile = await getUserById(userId);
      setUserData(userProfile);
    } catch (error) {
      console.log(error, "errorFetchUser");
    }
  };

  const fetchPosts = async () => {
    try {
      const posts = isOwnProfile
        ? await getLoggedInUserPosts(userId)
        : await checkAccessibilityAndGetUserPost(user._id, userId);
      setPostsData(posts);
    } catch (error) {
      console.log(error, "errorFetchUserPost");
    }
  };

  const checkIfFollowing = async () => {
    try {
      const followings = await getFollowings(user._id);
      const isFollowingUser = followings.some((f) => f._id === userId);
      setIsFollowing(isFollowingUser);
    } catch (err) {
      console.log("Takip kontrolü başarısız:", err);
    }
  };

  const fetchUserData = async () => {
    setLoading(true);
    await fetchUser();
    await fetchPosts();
    if (!isOwnProfile) {
      await checkIfFollowing();
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchUserData().finally(() => setRefreshing(false));
  };

  const handleFollow = async () => {
    try {
      const info = await sendFollowReq(user._id, userId);
      console.log(info, "info");
      await checkIfFollowing();
    } catch (err) {
      console.log("Takip isteği gönderilemedi:", err);
    }
  };

   const handleUnfollow = async () => {
    console.log(user._id, userId,"user._id, userId")
    try {
      await unfollowUser(user._id, userId);
      setIsFollowing(false);
    } catch (err) {
      console.log("Takipten çıkılamadı:", err);
    }
  };

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

  if (loading) {
    return (
      <Screen>
        <ActivityIndicator size="large" color={COLORS.secondary} />
      </Screen>
    );
  }

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
              disabled={!postsData?.accessibility}
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
              onPress={() =>
                navigation.navigate("FollowersAndFollowingScreen", {
                  username: userData?.fullname,
                  id: userId,
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
              onPress={() => setModalVisible(true)}
            >
              <EditProfileModal
                userData={userData}
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                setUserData={setUserData}
              />
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
        <Text style={styles.privateText}>
          Bu Hesap Gizlidir, Postları görmek için takip ediniz.
        </Text>
      )}
      {postsData?.length === 0 && (
        <Text style={styles.noPosts}>Gösterilecek hiç post yok.</Text>
      )}

      {postsData?.length === 0 && isOwnProfile && (
        <Pressable onPress={() => navigation.navigate("AddPost")}>
          <Text style={styles.addPostText}>Post paylaşmak için tıklayın.</Text>
        </Pressable>
      )}
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
    fontSize: 12,
    marginTop: 15,
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
  buttonText: {
    color: COLORS.white,
    fontWeight: "600",
  },
  postsContainer: {
    padding: 2,
  },
  privateText: {
    color: COLORS.white,
    textAlign: "center",
    fontSize: 16,
    marginTop: 20,
  },
  noPosts: {
    color: COLORS.white,
    textAlign: "center",
    marginTop: 20,
  },
  addPostText: {
    color: COLORS.white,
    textAlign: "center",
    marginTop: 30,
    fontSize: 20,
  },
});

export default ProfileScreen;
