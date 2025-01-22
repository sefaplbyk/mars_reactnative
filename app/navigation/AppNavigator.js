import React, { useEffect } from "react";
import HomeNavigator from "./HomeNavigator";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthNavigator from "./AuthNavigator";
import { useAuth } from "../context/AuthContext";
import PostDetailScreen from "../screens/PostDetailScreen";
import PostNavigator from "./PostNavigator";
import ChatNavigator from "./ChatNavigator";
import FollowersAndFollowingScreen from "../screens/FollowersAndFollowingScreen";
import ProfileScreen from "../screens/ProfileScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserById } from "../services/userService";
import Notifications from "../screens/Notifications";
const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { isLoggedIn, setIsLoggedIn,setUser } = useAuth();

  const checkAuth = async () => {
    const token = await AsyncStorage.getItem("userToken");
    const userId = await AsyncStorage.getItem("userId");
    if (token && userId) {
      setIsLoggedIn(true);
      const getUser = await getUserById(userId);
      setUser(getUser)
    }
  };
  useEffect(() => {
    checkAuth();
  }, []);
  return (
    <Stack.Navigator>
      {isLoggedIn ? (
        <Stack.Screen
          name="HomeNavigator"
          component={HomeNavigator}
          options={{
            headerShown: false,
          }}
        />
      ) : (
        <Stack.Screen
          name="AuthNavigator"
          component={AuthNavigator}
          options={{
            headerShown: false,
          }}
        />
      )}
      <Stack.Screen
        name="PostNavigator"
        component={PostNavigator}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ChatNavigator"
        component={ChatNavigator}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="FollowersAndFollowingScreen"
        component={FollowersAndFollowingScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="UserProfile"
        component={ProfileScreen}
        options={{
          tabBarButton: () => null,
          tabBarStyle: { display: "none" },
          headerShown: false,
        }}
      />
      <Stack.Screen
        name = "Notifications"
        component={Notifications}
        // options={{
        //   headerShown:false
        // }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
