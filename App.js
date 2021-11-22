import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState, useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import * as SplashScreen from "expo-splash-screen";

import MapScreen from "./screens/MapScreen";
import AuthenticationScreen from "./screens/AuthenticationScreen";
import {
  getSafetyPreferences,
  removeAllStorageEntries
} from "./store/AsyncStore";
import userStateStore from "./store/UserStateStore";
import firebaseConfig from "./keys/firebaseConfig";
import * as firebase from "firebase";
import theme from "./theme/StrollTheme";
import Constants from "expo-constants";

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

const possibleScreens = {
  map: Symbol("map"),
  authentication: Symbol("authentication")
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState(possibleScreens.authentication); // Pre-render authentication screen for speed
  const authRequired = Constants.manifest.extra.requireAuth;

  // run basic configurations the first time app is mounted
  useEffect(() => {
    (async () => {
      // Keep the splash screen visible while we fetch resources
      await SplashScreen.preventAutoHideAsync();

      // load data from AsyncStorage
      const prefs = await getSafetyPreferences();
      if (prefs) {
        userStateStore.setSafteyPreferences(prefs);
      }

      setCurrentScreen(possibleScreens.prerendering);

      // when user logs in/out, modify isAuth
      // when user logs out, clear state object and async storage data
      firebase.auth().onAuthStateChanged(user => {
        console.log("user changed", user);

        if (!user) {
          if (authRequired) {
            setCurrentScreen(possibleScreens.authentication);
          } else {
            setCurrentScreen(possibleScreens.map);
          }
          userStateStore.resetAllSessionParams();
          removeAllStorageEntries();
        } else {
          setCurrentScreen(possibleScreens.map);
        }

        SplashScreen.hideAsync();
      });
    })();
  }, []);

  return (
    <PaperProvider theme={theme}>
      <View style={styles.container}>
        {currentScreen == possibleScreens.map ? <MapScreen /> : <AuthenticationScreen />}
        <StatusBar style={currentScreen == possibleScreens.map ? "dark" : "light"} />
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
