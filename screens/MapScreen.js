import React, { useState, useEffect } from "react";
import {
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View
} from "react-native";
import MapView from "react-native-maps";
import * as Location from "expo-location";

import SettingsModal from "../modals/SettingsModal";
import SearchResultsContainer from "../components/SearchResultsContainer";

const MapScreen = props => {
  const [location, setLocation] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showSearch, setShowSearch] = useState(true);
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -95.4324,
    latitudeDelta: 40,
    longitudeDelta: 80
  });

  // ask for user permission and get location upon acceptance
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.1,
        longitudeDelta: 0.05
      });
    })();
  }, []);

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <MapView
          showsUserLocation={true}
          showsCompass={false}
          initialRegion={{
            latitude: 37.78825,
            longitude: -95.4324,
            latitudeDelta: 40,
            longitudeDelta: 80
          }}
          region={region}
          style={styles.mapView}
        ></MapView>
      </TouchableWithoutFeedback>
      <SearchResultsContainer
        onSettingsPress={() => {
          Keyboard.dismiss();
          setShowSettings(true);
        }}
      />
      <SettingsModal
        visible={showSettings}
        onDismiss={() => {
          setShowSettings(false);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: "stretch",
    height: "100%"
  },
  mapView: {
    alignSelf: "stretch",
    height: "100%"
  }
});

export default MapScreen;
