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
import { observer } from "mobx-react";
import * as firebase from "firebase";

const AccountModal = observer(props => {
  const { colors } = useTheme();

  const { displayName, email, photoURL } = firebase.auth().currentUser;

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
                <Title>{displayName}</Title>
                <Caption>{email}</Caption>
              </View>
            </Card.Content>
            <Card.Actions style={styles.actionsWrapper}>
              <Button
                onPress={() => {
                  firebase
                    .auth()
                    .signOut()
                    .then(() => {
                      userStateStore.resetAllSessionParams();
                      removeAllStorageEntries();
                    })
                    .catch(console.log);
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
    width: 270,
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
  infoWrapper: {
    marginVertical: 5,
    marginHorizontal: 5,
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
