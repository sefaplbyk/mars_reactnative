import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { COLORS } from "../config";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { getFollowers, getFollowings } from "../services/userService";
import { getProfilePic } from "../utils/profilePicUtils";

const Tab = createMaterialTopTabNavigator();



const Header = ({ username }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Ionicons name="chevron-back" size={28} color={COLORS.black} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{username}</Text>
      <View style={styles.rightPlaceholder} />
    </View>
  );
};

const UserCard = ({ user, onToggleFollow }) => {
  console.log(user,"user")
  return (
    <View style={styles.userCard}>
      <Image source={getProfilePic(user.profilePicture)} style={styles.avatar} />
      <View style={styles.userInfo}>
        <Text style={styles.name}>{user.fullname}</Text>
        <Text style={styles.username}>{user.username}</Text>
        <Text style={styles.bio} numberOfLines={2}>
          {user.bio}
        </Text>
      </View>
      <TouchableOpacity
        style={[
          styles.followButton,
          user.isFollowing && styles.followingButton,
        ]}
        onPress={() => onToggleFollow(user.id)}
      >
        <Text
          style={[
            styles.followButtonText,
            user.isFollowing && styles.followingButtonText,
          ]}
        >
          {user.isFollowing ? "Following" : "Follow"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const UserList = ({ type,usersData }) => {
  const [users, setUsers] = useState(
    type === "followers" ? usersData.followers : usersData.followings
  );

  const handleToggleFollow = (userId) => {
    setUsers(
      users.map((user) =>
        user.luid === userId
          ? { ...user, isFollowing: !user.isFollowing }
          : user
      )
    );
  };

  return (
    <FlatList
      data={users}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <UserCard user={item} onToggleFollow={handleToggleFollow} />
      )}
      style={styles.list}
    />
  );
};

const FollowersAndFollowingScreen = ({ route }) => {
  const [followers, setFollowers] = useState([]);
  const [followings, setFollowings] = useState([]);
  const { username , id } = route.params ;
  useEffect(() => {
    const fetchUser = async () => {
      const followers = await getFollowers(id);
      setFollowers(followers);
      const followings = await getFollowings(id);
      setFollowings(followings);
    };

    fetchUser();
  }, []);
  const FollowersScreen = () => (
    <UserList type="followers" usersData={{ followers, followings }} />
  );
  const FollowingScreen = () => <UserList type="following" usersData={{ followers, followings }}/>;
  return (
    <View style={styles.container}>
      <Header username={username} />
      <Tab.Navigator
        screenOptions={{
          tabBarIndicatorStyle: { backgroundColor: COLORS.primary, height: 3 },
          tabBarLabelStyle: {
            fontWeight: "bold",
            textTransform: "none",
            fontSize: 14,
          },
          tabBarStyle: {
            elevation: 0,
            shadowOpacity: 0,
            backgroundColor: COLORS.white,
          },
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.gray,
        }}
      >
        <Tab.Screen
          name="Followers"
          component={FollowersScreen}
          options={{ tabBarLabel: "Followers " + followers?.length || 0 }}
        />
        <Tab.Screen
          name="Following"
          component={FollowingScreen}
          options={{ tabBarLabel: "Following " + followings?.length || 0 }}
        />
      </Tab.Navigator>
    </View>
  );
};

export default FollowersAndFollowingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 56,
    paddingHorizontal: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray2,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.black,
    flex: 1,
    textAlign: "center",
  },
  rightPlaceholder: {
    width: 40,
  },
  list: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
  },
  userCard: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: COLORS.white,
    marginVertical: 0.5,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray2,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.lightGray2,
  },
  userInfo: {
    flex: 1,
    marginLeft: 15,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.black,
  },
  username: {
    fontSize: 14,
    color: COLORS.gray,
    marginTop: 2,
  },
  bio: {
    fontSize: 14,
    color: COLORS.darkgray,
    marginTop: 4,
  },
  followButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    minWidth: 100,
    alignItems: "center",
    elevation: 1,
  },
  followingButton: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  followButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "600",
  },
  followingButtonText: {
    color: COLORS.primary,
  },
});
