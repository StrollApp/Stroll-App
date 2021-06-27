import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Modal,
  View
} from "react-native";
import { Button, Card, IconButton, Switch } from "react-native-paper";
import { observer } from "mobx-react";

import userStateStore from "../store/UserStateStore";
import settingsDescription from "../presets/settingsDescription.json";

const SettingsModal = observer(props => {
  const closeButton = p => (
    <IconButton {...p} icon='close' size={25} onPress={props.onDismiss} />
  );

  // toggles value for param name named selection
  const togglesafetySelection = selection => {
    const res = { ...userStateStore.safteyPreferences };
    res[selection] = !res[selection];
    userStateStore.setSafteyPreferences(res);
  };

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
          <Card style={styles.settingsContainer}>
            <Card.Title
              title='Safety Settings'
              subtitle='Prioritize a route with...'
              right={closeButton}
            />
            <Card.Content style={styles.centeredElementsWrapper}>
              <View>
                {Object.entries(userStateStore.safteyPreferences).map(
                  ([key, val]) => {
                    return (
                      <View style={styles.optionWrapper} key={key}>
                        <Text>{settingsDescription[key]}</Text>
                        <Switch
                          value={val}
                          style={styles.optionSwitch}
                          onValueChange={() => {
                            togglesafetySelection(key);
                          }}
                        />
                      </View>
                    );
                  }
                )}
              </View>
            </Card.Content>
            <Card.Actions style={styles.centeredElementsWrapper}>
              <Button onPress={props.onDismiss}>Ok</Button>
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
  settingsContainer: {
    // width: 320,
    height: 360,
    // alignSelf: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    // justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 5,
    elevation: 2
  },
  centeredElementsWrapper: {
    alignItems: "center",
    justifyContent: "center"
  },
  optionWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 6
    // flex: 1
  },
  optionSwitch: {
    marginLeft: 15
  }
});

export default SettingsModal;
