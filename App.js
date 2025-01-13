import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./app/navigation/AppNavigator";
import { StatusBar } from "react-native";
import { AuthProvider } from "./app/context/AuthContext";

export default function App() {
  return (
    <>
      <AuthProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </AuthProvider>
      <StatusBar />
    </>
  );
}
