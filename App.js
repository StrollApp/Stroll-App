import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";

import MapScreen from "./screens/MapScreen";
import AuthenticationScreen from "./screens/AuthenticationScreen";
import { getSafetyPreferences } from "./store/AsyncStore";
import userStateStore from "./store/UserStateStore";
import firebaseConfig from "./keys/firebaseConfig";
import * as firebase from "firebase";
import theme from "./theme/StrollTheme";

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

export default function App() {
  const [isAuth, setIsAuth] = useState(true);

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
  }, []);

  // when user logs in, store user into state obj
  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      setIsAuth(!!user);
    });
  });

  return (
    <PaperProvider theme={theme}>
      <View style={styles.container}>
        {isAuth ? <MapScreen /> : <AuthenticationScreen />}
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
