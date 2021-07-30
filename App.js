import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import * as SplashScreen from "expo-splash-screen";

import MapScreen from "./screens/MapScreen";
import AuthenticationScreen from "./screens/AuthenticationScreen";
import { getSafetyPreferences, removeAllStorageEntries } from "./store/AsyncStore";
import userStateStore from "./store/UserStateStore";
import firebaseConfig from "./keys/firebaseConfig";
import * as firebase from "firebase";
import theme from "./theme/StrollTheme";

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

export default function App() {
  const [isAuth, setIsAuth] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // before we start, load data from AsyncStorage
  useEffect(() => {
    getSafetyPreferences()
      .then(prefs => {
        // if prefs not null, put it in state management
        if (prefs) {
          userStateStore.setSafteyPreferences(prefs);
        }
      })
      .catch(console.log)
      .finally(() => {
        setIsLoaded(true);
      });
  }, []);

  // keep splash screen up when app until app finishes loads
  useEffect(() => {
    (async () => {
      await SplashScreen.preventAutoHideAsync();
    })();
  }, []);

  // when user logs in/out, modify isAuth
  // when user logs out, clear state object and async storage data
  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      if (!user) {
        userStateStore.resetAllSessionParams();
        removeAllStorageEntries();
      }
      setIsAuth(!!user);
    });
  });

  if (!isLoaded || isAuth === null) {
    return null;
  }

  return (
    <PaperProvider theme={theme}>
      <View
        style={styles.container}
        onLayout={async () => {
          await SplashScreen.hideAsync();
        }}
      >
        {isAuth ? <MapScreen /> : <AuthenticationScreen />}
        <StatusBar style={isAuth ? "dark" : "light"} />
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
