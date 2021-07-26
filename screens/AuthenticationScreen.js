import React, { useEffect, useState } from "react";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { StyleSheet, View, Text, Image } from "react-native";
import { Button } from "react-native-paper";

import * as firebase from "firebase";
import authConfig from "../keys/authConfig.json";
import { signInWithCredential } from "../helpers/firebaseAuth";
import { LinearGradient } from "expo-linear-gradient";

import TypeWriter from 'react-native-typewriter';

import googleGImg from '../assets/google_G.png';

import Svg, {
  Path
} from 'react-native-svg';

WebBrowser.maybeCompleteAuthSession();

const AuthenticationScreen = props => {
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: authConfig.web.client_id,
    iosClientId: authConfig.iOS.client_id,
    
  });

  const [locationIndex, setLocationIndex] = useState(0);

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

  const supportedLocations = ["Berkeley"]; //Putting only one will essentially just make the TypeWriter type it out once, and then it will just stay there.

  const nextLocation = () => {
    setTimeout(() => {
      setLocationIndex((locationIndex + 1) % supportedLocations.length);
    }, 3000);
  }

  return (
    <View style={styles.container}>
      <View style={styles.mainBackground}>
        <LinearGradient colors={['#7492FF', '#D185FF']} style={{height: "100%"}} start={{x: 0, y: 0}} end={{x: 1, y: 0}}>
          <View style={styles.backgroundStart}>
            <View>
              <Text style={{fontSize: 50, color: "white", fontWeight: "bold"}}>Stroll</Text>
            </View>
            <View styles={styles.subtitleContainer}>
              <Text style={{fontSize: 20, color: "white", fontWeight: "bold", textAlign: "center"}}>Find the safest walk through</Text>
              <TypeWriter fixed={true} minDelay={120} maxDelay={150} style={{textAlign: "center", fontWeight: "bold", fontSize: 20, color: "white"}} typing={1} onTypingEnd={nextLocation}>{supportedLocations[locationIndex]}</TypeWriter>
            </View>
            <Button
              mode='contained'
              color="white"
              disabled={!request}
              style={{display: "flex", flexDirection: "column"}}
              onPress={() => {
                promptAsync();
              }}
            >
              <Image source={googleGImg} style={{width: 15, height: 15}} />
              <Text>  </Text>
              Sign In with Google
            </Button>
          </View>
          <View style={styles.mainBackgroundEnd}>
            <Svg height="100" width="100%" viewBox="0 0 15 5" preserveAspectRatio="none">
              <Path
                d="M 0 3 C 8 8 6 2 15 0 L 15 5 L 0 5"
                fill="white"
                stroke="none"
              />
            </Svg>
          </View>
        </LinearGradient>
      </View>
      <View style={styles.pageBottom}>
        <Svg height="100" width="100%" viewBox="0 0 15 5.2" preserveAspectRatio="none">
          <Path
            d="M -0.3 3 C 8 8 6 2 15.5 0"
            fill="none"
            stroke="#9055FF"
            strokeWidth={0.1}
            strokeDasharray="1.3, 1.3"
          >
            
          </Path>
        </Svg>
        <View style={styles.copyright}>
          <Text style={{fontSize: 13, color: "#777"}}>Copyright © 2021 Stroll, All rights reserved.</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "100%"
  },
  mainBackground: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    flex: 1,
  },
  subtitleContainer: {
    color: "white"
  },
  pageBottom: {
    height: 160,
    display: "flex",
    flexDirection: "column"
  },
  backgroundStart: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingTop: 70
  },
  mainBackgroundEnd: {
    width: "100%",
    height: 100,
  },
  copyright: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }
});

export default AuthenticationScreen;
