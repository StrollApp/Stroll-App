import React, { useState, useEffect, useRef } from "react";
import {
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { observer } from "mobx-react";

import SettingsModal from "../modals/SettingsModal";
import SearchResultsContainer from "../components/SearchResultsContainer";
import BottomSheetContainer from "../components/BottomSheetContainer";
import userStateStore from "../store/UserStateStore";

import locationConfigs from "../presets/locationConfigs.json";

const MapScreen = observer(props => {
  const [location, setLocation] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [region, setRegion] = useState({
    latitude: locationConfigs.berkeley.lat,
    longitude: locationConfigs.berkeley.long,
    latitudeDelta: 0.1,
    longitudeDelta: 0.05
  });
  const bottomSheetRef = useRef(null);
  const searchResultsRef = useRef(null);

  const clearDestinationQuery = () => {
    // console.log("clear");
    // console.log(searchResultsRef);
    // console.log(searchResultsRef.current);
    // console.log(searchResultsRef.current.clear);
    // searchResultsRef.current.clear();
    userStateStore.clearDestinationData();
    userStateStore.setDestinationStatus(
      userStateStore.destinationStatusOptions.ABSENT
    );
  };

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
      // setRegion({
      //   latitude: location.coords.latitude,
      //   longitude: location.coords.longitude,
      //   latitudeDelta: 0.1,
      //   longitudeDelta: 0.05
      // });
    })();
  }, []);

  // update region if a destination is selected
  useEffect(() => {
    if (userStateStore.destinationData) {
      let coordinates = userStateStore.destinationData.coordinates;
      setRegion({
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1
      });
      bottomSheetRef.current.snapTo(0);
    } else {
      bottomSheetRef.current.close();
    }
  }, [userStateStore.destinationData]);

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <MapView
          showsUserLocation={true}
          showsCompass={false}
          initialRegion={{
            latitude: locationConfigs.berkeley.lat,
            longitude: locationConfigs.berkeley.long,
            latitudeDelta: 40,
            longitudeDelta: 80
          }}
          region={region}
          style={styles.mapView}
        >
          {userStateStore.destinationData && (
            <Marker
              coordinate={{
                latitude: userStateStore.destinationData.coordinates.latitude,
                longitude: userStateStore.destinationData.coordinates.longitude
              }}
            ></Marker>
          )}
        </MapView>
      </TouchableWithoutFeedback>
      <SearchResultsContainer
        searchResultsRef={searchResultsRef}
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
      <BottomSheetContainer
        sheetRef={bottomSheetRef}
        onDismiss={clearDestinationQuery}
      />
    </View>
  );
});

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
