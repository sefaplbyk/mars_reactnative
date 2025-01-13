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
} from "react-native";
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../config";
import { Ionicons } from "@expo/vector-icons";
import SettingsModal from "../components/settings/SettingsModal";
import { getProfilePic } from "../utils/profilePicUtils";
import { getUserById } from "../services/userService";
import Icon from "react-native-vector-icons/Ionicons";
import Post from "../components/post/Post";
import { getUserPosts } from "../services/postService";
import { formatDate } from "../utils/formatDate";

const ProfileScreen = ({ route }) => {
  console.log(route.params, "route.params");
  const { user } = useAuth();
  const navigation = useNavigation();
  const userId = route.params?.id || user.id;
  const [userData, setUserData] = useState({});
  const [postsData, setPostsData] = useState([]);
  const [loading, setLoading] = useState(true);
  console.log(userId, "userId");

  const getUser = async () => {
    try {
      const userProfile = await getUserById(userId);
      setUserData(userProfile);
    } catch (error) {
      console.log(error, "error");
    }
  };

  const getPost = async () => {
    try {
      const userPosts = await getUserPosts(userId);
      setPostsData(userPosts);
    } catch (error) {
      console.log(error, "error");
    }
  };

  useEffect(() => {
    getUser();
    getPost();
  }, []);

  const renderPostItem = ({ item }) => (
    <Post
      userName={item.userName}
      userEmail={item.userEmail}
      userProfilePic={item.userProfilePic}
      content={item.content}
      commentsCount={item.commentsCount}
      likesCount={item.likesCount}
      date={formatDate(item.date)}
    />

  );
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Icon
          name="chevron-back"
          size={28}
          color={COLORS.white}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.username}>{userData.username}</Text>
        <SettingsModal />
      </View>
      <View style={styles.profileSection}>
        <View style={styles.profileHeader}>
          <Image
            source={getProfilePic(userData?.profilePicture)}
            style={styles.profileImage}
          />
          <View style={styles.profileStats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userData.postsCount}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <Pressable
              onPress={() =>
                navigation.navigate("FollowersAndFollowingScreen", {
                  username: userData.fullName,
                })
              }
              style={styles.statItem}
            >
              <Text style={styles.statNumber}>{userData.followersCount}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </Pressable>
            <Pressable
              onPress={() =>
                navigation.navigate("FollowersAndFollowingScreen", {
                  username: userData.fullName,
                })
              }
              style={styles.statItem}
            >
              <Text style={styles.statNumber}>{userData.followingCount}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.bioSection}>
          <Text style={styles.name}>{userData.fullname}</Text>
          <Text style={styles.bio}>{userData.bio}</Text>
        </View>

        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate("EditProfile")}
          >
            <Text style={styles.buttonText}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareButton}>
            <Ionicons
              name="share-social-outline"
              size={20}
              color={COLORS.white}
            />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={postsData}
        renderItem={renderPostItem}
        keyExtractor={(item) => item.id.toString()}
        scrollEnabled={false}
        contentContainerStyle={styles.postsContainer}
      />
      {postsData.length === 0 && (
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
          {postsData.length === 0 &&
            (userId === user.id ? "Post paylaşmak için tıklayın." : "")}
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
