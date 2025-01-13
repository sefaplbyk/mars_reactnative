import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { COLORS } from '../config'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'

const Tab = createMaterialTopTabNavigator();

const mockFollowers = [
  {
    id: "1",
    name: "Alex Thompson",
    username: "@alexdev",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    bio: "Senior React Native Developer | Tech Lead @Microsoft",
    isFollowing: false,
  },
  {
    id: "2",
    name: "Emma Wilson",
    username: "@emmaw",
    avatar: "https://randomuser.me/api/portraits/women/22.jpg",
    bio: "UI/UX Designer | Previously @Apple | Coffee Addict ☕",
    isFollowing: true,
  },
  {
    id: "3",
    name: "David Chen",
    username: "@davidc",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    bio: "Full Stack Developer | AWS Certified | 🚀 Building cool stuff",
    isFollowing: true,
  },
  {
    id: "4",
    name: "Sophia Martinez",
    username: "@sophiatech",
    avatar: "https://randomuser.me/api/portraits/women/28.jpg",
    bio: "iOS Developer | Open Source Contributor | 📱",
    isFollowing: false,
  },
  {
    id: "5",
    name: "James Wilson",
    username: "@jwilson",
    avatar: "https://randomuser.me/api/portraits/men/52.jpg",
    bio: "Product Manager @Netflix | Tech Enthusiast",
    isFollowing: true,
  },
  {
    id: "6",
    name: "Luna Kim",
    username: "@lunakim",
    avatar: "https://randomuser.me/api/portraits/women/42.jpg",
    bio: "UX Researcher | PhD in HCI | Love designing experiences 🎨",
    isFollowing: false,
  },
  {
    id: "7",
    name: "Marcus Johnson",
    username: "@marcusj",
    avatar: "https://randomuser.me/api/portraits/men/36.jpg",
    bio: "Backend Developer | Python & Node.js | 🎮 Gamer",
    isFollowing: true,
  },
  {
    id: "8",
    name: "Olivia Brown",
    username: "@oliviab",
    avatar: "https://randomuser.me/api/portraits/women/15.jpg",
    bio: "Frontend Engineer @Google | React Expert | 🎯",
    isFollowing: false,
  },
  {
    id: "9",
    name: "Daniel Lee",
    username: "@danlee",
    avatar: "https://randomuser.me/api/portraits/men/68.jpg",
    bio: "Mobile App Developer | Flutter & React Native | 🌟",
    isFollowing: true,
  },
  {
    id: "10",
    name: "Isabella Garcia",
    username: "@isabellag",
    avatar: "https://randomuser.me/api/portraits/women/33.jpg",
    bio: "DevOps Engineer | Cloud Architecture | ☁️",
    isFollowing: false,
  },
];

const mockFollowing = [
  {
    id: "1",
    name: "Sarah Connor",
    username: "@sconnor",
    avatar: "https://randomuser.me/api/portraits/women/91.jpg",
    bio: "AI Researcher | Machine Learning Expert | 🤖",
    isFollowing: true,
  },
  {
    id: "2",
    name: "Michael Zhang",
    username: "@mzhang",
    avatar: "https://randomuser.me/api/portraits/men/72.jpg",
    bio: "Software Architect | Cloud Native | k8s enthusiast 🚀",
    isFollowing: true,
  },
  {
    id: "3",
    name: "Emily Parker",
    username: "@emilyp",
    avatar: "https://randomuser.me/api/portraits/women/55.jpg",
    bio: "Product Designer | Figma Expert | Design Systems 🎨",
    isFollowing: true,
  },
  {
    id: "13",
    name: "Chris Anderson",
    username: "@chris_a",
    avatar: "https://randomuser.me/api/portraits/men/92.jpg",
    bio: "Security Engineer | Blockchain Developer | 🔒",
    isFollowing: true,
  },
];

const Header = ({ username }) => {
  const navigation = useNavigation()
  
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
  )
}

const UserCard = ({ user, onToggleFollow }) => {
  return (
    <View style={styles.userCard}>
      <Image source={{ uri: user.avatar }} style={styles.avatar} />
      <View style={styles.userInfo}>
        <Text style={styles.name}>{user.name}</Text>
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

const UserList = ({ type }) => {
  const [users, setUsers] = useState(type === 'followers' ? mockFollowers : mockFollowing);

  const handleToggleFollow = (userId) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, isFollowing: !user.isFollowing } : user
      )
    );
  };

  return (
    <FlatList
      data={users}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <UserCard user={item} onToggleFollow={handleToggleFollow} />
      )}
      style={styles.list}
    />
  );
};

const FollowersScreen = () => <UserList type="followers" />
const FollowingScreen = () => <UserList type="following" />

const FollowersAndFollowingScreen = ({ route }) => {
  const { username = "John Doe" } = route.params || {}
  
  return (
    <View style={styles.container}>
      <Header username={username} />
      <Tab.Navigator
        screenOptions={{
          tabBarIndicatorStyle: { backgroundColor: COLORS.primary, height: 3 },
          tabBarLabelStyle: { 
            fontWeight: 'bold', 
            textTransform: 'none',
            fontSize: 14
          },
          tabBarStyle: { 
            elevation: 0, 
            shadowOpacity: 0,
            backgroundColor: COLORS.white 
          },
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.gray,
        }}
      >
        <Tab.Screen
          name="Followers"
          component={FollowersScreen}
          options={{ tabBarLabel: "Followers " + (mockFollowers.length) }}
        />
        <Tab.Screen
          name="Following"
          component={FollowingScreen}
          options={{ tabBarLabel: "Following " + (mockFollowing.length) }}
        />
      </Tab.Navigator>
    </View>
  )
}

export default FollowersAndFollowingScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray2,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.black,
    flex: 1,
    textAlign: 'center',
  },
  rightPlaceholder: {
    width: 40,
  },
  list: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
  },
  userCard: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: COLORS.white,
    marginVertical: 0.5,
    alignItems: 'center',
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
    fontWeight: 'bold',
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
    alignItems: 'center',
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
    fontWeight: '600',
  },
  followingButtonText: {
    color: COLORS.primary,
  },
})
