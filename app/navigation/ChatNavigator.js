import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ChatScreen from "../screens/ChatScreen";
import { useAuth } from "../context/AuthContext";
import ChatDetailScreen from "../screens/ChatDetailScreen";
import ChatHeader from '../components/ChatHeader';

const Stack = createNativeStackNavigator();

const ChatNavigator = () => {
  const { user } = useAuth();
  return (
    <Stack.Navigator initialRouteName="ChatScreen">
      <Stack.Screen
        name="ChatScreen"
        component={ChatScreen}
        options={{
          title: `${user.email}`,
          headerStyle: {
            backgroundColor: "black",
          },
          headerTintColor: "white",
        }}
      />
      <Stack.Screen
        name="ChatDetail"
        component={ChatDetailScreen}
        options={({ route }) => ({
          headerTitle: () => <ChatHeader user={route.params.user} />,
          headerStyle: {
            backgroundColor: "black",
          },
          headerTintColor: "white",
        })}
      />
    </Stack.Navigator>
  );
};

export default ChatNavigator;
