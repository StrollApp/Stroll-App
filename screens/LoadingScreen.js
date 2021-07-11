import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Paragraph, Title, Subheading, useTheme } from "react-native-paper";
import { Colors } from "react-native/Libraries/NewAppScreen";

const LoadingScreen = props => {
  const { colors } = useTheme();

  return (
    <View
      style={{
        flex: 1,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FBFBFB",
        height: "100%"
      }}
    >
      <Text
        style={{
          color: "#D0D0D0",
          fontSize: 50,
          fontWeight: "700",
          fontStyle: "italic"
        }}
      >
        Stroll
      </Text>
      <Text
        style={{
          position: "absolute",
          bottom: 90,
          color: "#DADADA",
          fontSize: 15,
          fontStyle: "italic",
          fontWeight: "600",
        }}
      >
        Load app contents...
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({});

export default LoadingScreen;
