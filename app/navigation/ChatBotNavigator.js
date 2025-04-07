import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import EducationScreen from "../screens/EducationScreen";
import ChatBotScreen from "../screens/ChatBotScreen";

const Stack = createNativeStackNavigator();

const ChatBotNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="EducationScreen">
      <Stack.Screen
        name="EducationScreen"
        component={EducationScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ChatBotScreen"
        component={ChatBotScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default ChatBotNavigator;
