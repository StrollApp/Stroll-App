import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";

import MapScreen from "./screens/MapScreen";
import { getSafetyPreferences } from "./store/AsyncStore";
import userStateStore from "./store/UserStateStore";
import theme from "./theme/StrollTheme";

export default function App() {
  // before we start, load data from AsyncStorage
  useEffect(() => {
    getSafetyPreferences()
      .then(prefs => {
        // if prefs not null, put it in state management
        if (prefs) {
          userStateStore.setSafteyPreferences(prefs);
        }
      })
      .catch(console.log);
  });

  return (
    <PaperProvider theme={theme}>
      <View style={styles.container}>
        <MapScreen />
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
