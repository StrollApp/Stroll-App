import {
  makeRedirectUri,
  ResponseType,
  useAuthRequest,
  useAutoDiscovery,
} from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import firebase from "firebase";
import React from "react";
import { Button, Platform, StyleSheet, View } from "react-native";

import authConfig from "../keys/authConfig.json";

const signInWithGoogleAsync = async () => {
  WebBrowser.maybeCompleteAuthSession();
  const useProxy = Platform.select({ web: false, default: true });
  const discovery = useAutoDiscovery("https://accounts.google.com");

  // Request
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: Platform.select({
        web: authConfig.web.client_id,
        default: "you do not have this yet"
      }),
      redirectUri: makeRedirectUri({
        // For usage in bare and standalone
        native: "you do not have this yet",
        useProxy
      }),
      usePKCE: false,
      responseType: ResponseType.Token,
      scopes: ["openid", "profile"]
    },
    discovery
  );

  console.log("LOGIN")
  // prompt login
  await promptAsync({ useProxy });

  // on login success, input credentials into firebase
  if (response && response.type === "success") {
    const credential = new firebase.auth.GoogleAuthProvider.credential(
      null, // Pass the access_token as the second property
      response.params.access_token
    );
    firebase.auth().signInWithCredential(credential);
  }
};

export { signInWithGoogleAsync };
