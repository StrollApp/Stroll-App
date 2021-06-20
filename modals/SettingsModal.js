import React, { useState, useEffect } from "react";
import {
  Keyboard,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  TouchableHighlight,
  Modal,
  View
} from "react-native";
import {
  Button,
  Colors,
  Card,
  IconButton,
  Searchbar,
  Surface,
  Title,
  Paragraph
} from "react-native-paper";

const SettingsModal = props => {
  return (
    <Modal
      animationType='fade'
      transparent
      onRequestClose={() => {
        Alert.alert("Modal has been closed.");
      }}
      {...props}
    >
      <TouchableOpacity
        style={styles.backdropView}
        onPressIn={() => {
          props.onDismiss();
        }}
      >
        <TouchableWithoutFeedback>
          <Card style={styles.settingsContainer}>
            <Card.Content styles={styles.centeredElementsWrapper}>
              <Title>Avoid</Title>
            </Card.Content>
            <Card.Actions styles={styles.centeredElementsWrapper}>
              <Button>Ok</Button>
            </Card.Actions>
          </Card>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
};

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
  settingsContainer: {
    width: "70%",
    height: 300,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 5,
    elevation: 2
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  centeredElementsWrapper: {
    alignItems: "center",
    justifyContent: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});

export default SettingsModal;
