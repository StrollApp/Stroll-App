import React, { useState } from "react";
import {
  StyleSheet,
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
  RadioButton,
  Switch,
  Text
} from "react-native-paper";
import { observer } from "mobx-react";

import userStateStore from "../store/UserStateStore";
import settingsDescription from "../presets/settingsDescription.json";
import defaultSettings from "../presets/defaultSettings.json";

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
            <Card.Title title='Safety Settings' right={closeButton} />
            <Card.Content style={styles.centeredElementsWrapper}>
              <Divider />
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>
                  Prioritize a route with...
                </Text>
                {Object.entries(userStateStore.safteyPreferences)
                  .filter(([key, _]) => key in defaultSettings)
                  .map(([key, val]) => {
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
                  })}
              </View>
              <Divider />
              <View>
                <Text style={styles.sectionTitle}>Show heatmap for...</Text>
                <RadioButton.Group
                  style={styles.optionWrapper}
                  onValueChange={v => userStateStore.setHeatmapType(v)}
                  value={userStateStore.heatmapType}
                >
                  <RadioButton.Item
                    style={styles.radioOptionContainer}
                    labelStyle={styles.radioOptionText}
                    label='Crime'
                    value='CRIME'
                    mode='android'
                  />
                  <RadioButton.Item
                    style={styles.radioOptionContainer}
                    labelStyle={styles.radioOptionText}
                    label='Street Lights'
                    value='STREET_LIGHT'
                    mode='android'
                  />
                </RadioButton.Group>
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
    width: 300,
    // height: 230,
    // alignSelf: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: "stretch",
    justifyContent: "space-between",
    backgroundColor: "white",
    borderRadius: 5,
    elevation: 2
  },
  centeredElementsWrapper: {
    alignItems: "center",
    justifyContent: "center"
  },
  optionWrapper: {
    width: 240,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 30,
    marginVertical: 6
  },
  optionSwitch: {
    marginLeft: 15
  },
  sectionTitle: {
    width: 240,
    fontSize: 12,
    color: "grey",
    fontWeight: "500"
  },
  sectionContainer: {
    marginBottom: 20
  },
  radioOptionContainer: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    height: 30,
    marginVertical: 6
  },
  radioOptionText: {
    fontSize: 14,
    marginLeft: 0
  }
});

export default SettingsModal;
