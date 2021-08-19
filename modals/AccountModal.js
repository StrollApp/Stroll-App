import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Modal,
  View
} from "react-native";
import {
  Button,
  Card,
  Divider,
  IconButton,
  Title,
  useTheme,
  Avatar,
  Paragraph,
  Caption
} from "react-native-paper";
import { Platform } from "react-native";
import { observer } from "mobx-react";
import * as firebase from "firebase";
import * as GoogleSignIn from "expo-google-sign-in";

const AccountModal = observer(props => {
  const { colors } = useTheme();

  const { displayName, email, photoURL } = firebase.auth().currentUser
    ? firebase.auth().currentUser
    : {
        displayName: "user not logged in",
        email: "",
        photoURL:
          "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.tripadvisor.com%2FRestaurant_Review-g297710-d13975356-Reviews-Bruh_Coffee-Malang_East_Java_Java.html&psig=AOvVaw2dbGzekmIZ43EMfx_YDv4J&ust=1627838417308000&source=images&cd=vfe&ved=0CAgQjRxqFwoTCLDqsOvojfICFQAAAAAdAAAAABAJ"
      };

  const closeButton = p => (
    <IconButton {...p} icon='close' size={25} onPress={props.onDismiss} />
  );

  return (
    <Modal
      animationType='fade'
      transparent
      onRequestClose={() => {
        Alert.alert("Modal has been closed.");
      }}
      {...props}
    >
      <TouchableOpacity style={styles.backdropView} onPressIn={props.onDismiss}>
        <TouchableWithoutFeedback>
          <Card style={styles.cardContainer}>
            <Card.Title title='My Account' right={closeButton} />
            <Card.Content style={styles.infoWrapper}>
              <Avatar.Image size={50} source={{ uri: photoURL }} />
              <View style={styles.textInfoWrapper}>
                <Text style={styles.displayNameText}>{displayName}</Text>
                <Caption style={styles.displayEmailText}>{email}</Caption>
              </View>
            </Card.Content>
            <Card.Actions style={styles.actionsWrapper}>
              <Button
                onPress={() => {
                  firebase.auth().signOut().catch(console.log);
                  if (Platform.OS === "android") GoogleSignIn.signOutAsync();
                }}
                color={colors.red}
              >
                Log Out
              </Button>
            </Card.Actions>
          </Card>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  backdropView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)"
  },
  cardContainer: {
    width: 290,
    // height: 200,
    // alignSelf: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    // justifyContent: "center",
    // alignItems: "center",
    backgroundColor: "white",
    borderRadius: 5,
    elevation: 2
  },
  displayNameText: {
    width: 160,
    fontWeight: "600",
    fontSize: 16,
    marginRight: 20
  },
  displayEmailText: {
    width: 160,
    fontSize: 12
  },
  infoWrapper: {
    marginVertical: 0,
    marginHorizontal: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
    // flex: 1
  },
  textInfoWrapper: {
    flexDirection: "column",
    paddingHorizontal: 10
  },
  actionsWrapper: {
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center"
  }
});

export default AccountModal;
