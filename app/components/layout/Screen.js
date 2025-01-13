import { ImageBackground, StyleSheet, Text, View } from "react-native";
import React from "react";

const Screen = ({ children, ...props }) => {
  return (
    <View {...props} style={styles.container}>
      <ImageBackground
        source={require("../../../assets/registerBg.jpg")}
        resizeMode="cover"
        style={{
          flex: 1,
          width: "100%",
        }}
      >
        {children}
      </ImageBackground>
    </View>
  );
};

export default Screen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
