import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState, useCallback } from "react";
import { StyleSheet, View, Text } from "react-native";
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

export default function App() {
  const [isAuth, setIsAuth] = useState(null);
  const [preferencesLoaded, setPreferencesLoaded] = useState(false);
  const authRequired = Constants.manifest.extra.requireAuth;
  const loading = !preferencesLoaded || (authRequired && isAuth === null);

  // run basic configurations the first time app is mounted
  useEffect(() => {
    async function prepare() {
      try {
        // Keep the splash screen visible while we fetch resources
        await SplashScreen.preventAutoHideAsync();

        // when user logs in/out, modify isAuth
        // when user logs out, clear state object and async storage data
        firebase.auth().onAuthStateChanged(user => {
          if (!user) {
            userStateStore.resetAllSessionParams();
            removeAllStorageEntries();
          }
          setIsAuth(!!user);
        });

        // load data from AsyncStorage
        const prefs = await getSafetyPreferences();
        if (prefs) {
          userStateStore.setSafteyPreferences(prefs);
        }
      } finally {
        setPreferencesLoaded(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (!loading) {
      await SplashScreen.hideAsync();
    }
  }, [preferencesLoaded, isAuth]);

  if (loading) {
    return null;
  }

  return (
    <PaperProvider theme={theme}>
      <View style={styles.container} onLayout={onLayoutRootView}>
        {isAuth || !authRequired ? <MapScreen /> : <AuthenticationScreen />}
        <StatusBar style={isAuth || !authRequired ? "dark" : "light"} />
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
