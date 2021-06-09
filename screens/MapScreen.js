import React, { useState, useEffect } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import MapView from "react-native-maps";
import * as Location from "expo-location";

const MapScreen = props => {
  const [location, setLocation] = useState(null);
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421
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
    })();
  }, []);

  // if location is obtained, use it
  useEffect(() => {
    if (location) {
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.1,
        longitudeDelta: 0.05
      });
    }
  }, [location]);

  return (
    <MapView
      showsUserLocation={true}
      region={region}
      style={styles.mapView}
    ></MapView>
  );
};

const styles = StyleSheet.create({
  mapView: {
    alignSelf: "stretch",
    height: "100%"
  }
});

export default MapScreen;
