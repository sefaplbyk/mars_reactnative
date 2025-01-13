import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PostDetailScreen from "../screens/PostDetailScreen";
const Stack = createNativeStackNavigator();

const PostNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="PostDetailScreen"
        component={PostDetailScreen}
        options={{
          // headerShown: false,
          headerStyle: {
            backgroundColor: "black",
          },
          headerTintColor: "white",         
        }}
      />
    </Stack.Navigator>
  );
};

export default PostNavigator;
