import React, { useEffect } from "react";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { StyleSheet, View } from "react-native";
import { Button } from "react-native-paper";

import * as firebase from "firebase";
import authConfig from "../keys/authConfig.json";
import { signInWithCredential } from "../helpers/firebaseAuth";

WebBrowser.maybeCompleteAuthSession();

const AuthenticationScreen = props => {
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: authConfig.web.client_id
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;

      const credential = firebase.auth.GoogleAuthProvider.credential(id_token);
      firebase
        .auth()
        .signInWithCredential(credential)
        .then(credential => {
          const user = credential.user;
          console.log("user now logged in, user object is,");
          console.log(user);
        })
        .catch(console.log);
    }
  }, [response]);

  return (
    <View style={styles.container}>
      <Button
        mode='outlined'
        disabled={!request}
        onPress={() => {
          promptAsync();
        }}
      >
        Log In with Google
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});

export default AuthenticationScreen;
