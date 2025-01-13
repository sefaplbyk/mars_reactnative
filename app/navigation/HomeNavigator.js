import * as React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import AddPostScreen from "../screens/AddPostScreen";
import FindPeopleScreen from "../screens/FindPeopleScreen";
import Icon from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { Image } from "react-native";
import { useAuth } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";

const Tab = createBottomTabNavigator();
export default function HomeNavigator() {
  const { logout } = useAuth();
  const navigation = useNavigation();
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "black",
          borderTopWidth: 0,
        },
        tabBarActiveTintColor: "white",
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerTitle: "Mars",
          headerLeftContainerStyle: {
            paddingLeft: 20,
          },
          headerTintColor: "white",
          tabBarIcon: ({ color, size, focused }) =>
            focused ? (
              <Icon color={"white"} name="home-sharp" size={24} />
            ) : (
              <Icon color={"white"} name="home-outline" size={24} />
            ),
          headerStyle: {
            backgroundColor: "black",
          },
          headerTitleAlign: "center",
          headerLeft: () => (
            // <Icon color={"white"} name="planet-sharp" size={24} />
            <Image
              source={require("../../assets/splashNew.jpg")}
              resizeMode="cover"
              style={{
                width: 30,
                height: 30,
              }}
            />
          ),
          headerRightContainerStyle: {
            paddingRight: 20,
          },
          headerRight: () => (
            <Icon
              color={"white"}
              name="chatbox"
              size={24}
              onPress={() => navigation.navigate("ChatNavigator")}
            />
          ),
        }}
      />
      <Tab.Screen
        name="FindPeople"
        component={FindPeopleScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) =>
            focused ? (
              <Icon color={"white"} name="people-sharp" size={24} />
            ) : (
              <Icon color={"white"} name="people-outline" size={24} />
            ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="AddPost"
        component={AddPostScreen}
        options={{
          title: "Create Post",
          tabBarIcon: ({ color, size, focused }) =>
            focused ? (
              <Icon color={"white"} name="planet-sharp" size={24} />
            ) : (
              <Icon color={"white"} name="planet-outline" size={24} />
            ),
          headerStyle: {
            backgroundColor: "black",
          },
          headerTitleStyle: {
            color: "white",
          },
        }}
      />
      <Tab.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          headerShown: false,
          headerRightContainerStyle: {
            paddingRight: 20,
          },
          headerRight: () => (
            <Icon
              color={"white"}
              name="log-out-outline"
              size={32}
              onPress={logout}
            />
          ),
          headerStyle: {
            backgroundColor: "black",
          },
          headerTitleStyle: {
            color: "white",
          },
          tabBarIcon: ({ color, size, focused }) =>
            focused ? (
              <FontAwesome color={"white"} name="user" size={24} />
            ) : (
              <FontAwesome color={"white"} name="user-o" size={24} />
            ),
        }}
      />
    </Tab.Navigator>
  );
}
