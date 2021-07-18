import React, { useState, useEffect, useRef } from "react";
import {
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View
} from "react-native";
import { useTheme } from "react-native-paper";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import * as Location from "expo-location";
import { observer } from "mobx-react";

import SettingsModal from "../modals/SettingsModal";
import AccountModal from "../modals/AccountModal";
import SearchResultsContainer from "../components/SearchResultsContainer";
import BottomSheetContainer from "../components/BottomSheetContainer";
import userStateStore from "../store/UserStateStore";
import { storeSafetyPreferences } from "../store/AsyncStore";

import locationConfigs from "../presets/locationConfigs.json";
import config from "../keys/config.json";

const MapScreen = observer(props => {
  const [location, setLocation] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const mapRef = useRef(null);
  const bottomSheetRef = useRef(null);
  const searchResultsRef = useRef(null);
  const { colors } = useTheme();

  const clearDestinationQuery = () => {
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
    })();
  }, []);

  // update region if a destination is selected
  useEffect(() => {
    if (userStateStore.destinationData) {
      let coordinates = userStateStore.destinationData.coordinates;
      mapRef.current.animateToRegion(
        {
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02
        },
        1.5
      );
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
            latitudeDelta: 0.1,
            longitudeDelta: 0.05
          }}
          style={styles.mapView}
          ref={mapRef}
        >
          {userStateStore.destinationData && (
            <Marker
              pinColor={colors.primary}
              coordinate={{
                latitude: userStateStore.destinationData.coordinates.latitude,
                longitude: userStateStore.destinationData.coordinates.longitude
              }}
            ></Marker>
          )}
          {userStateStore.destinationStatus ===
            userStateStore.destinationStatusOptions.ROUTED && (
            <MapViewDirections
              origin={location.coords}
              destination={userStateStore.destinationData.coordinates}
              strokeColor={colors.primary}
              strokeWidth={5}
              mode='WALKING'
              apikey={config.key}
            />
          )}
        </MapView>
      </TouchableWithoutFeedback>
      <SearchResultsContainer
        searchResultsRef={searchResultsRef}
        onSettingsPress={() => {
          Keyboard.dismiss();
          setShowSettings(true);
        }}
        onAccountPress={() => {
          Keyboard.dismiss();
          setShowAccount(true);
        }}
      />
      <SettingsModal
        visible={showSettings}
        onDismiss={() => {
          setShowSettings(false);
          storeSafetyPreferences(userStateStore.safteyPreferences).catch(
            console.log
          );
        }}
      />
      <AccountModal
        visible={showAccount}
        onDismiss={() => {
          setShowAccount(false);
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
