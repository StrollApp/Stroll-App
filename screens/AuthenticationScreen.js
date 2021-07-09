import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { observer } from "mobx-react";

const AuthenticationScreen = observer(props => {
  return <View style={styles.container}></View>;
});

const styles = StyleSheet.create({
  container: {
    alignSelf: "stretch",
    height: "100%"
  }
});

export default AuthenticationScreen;
