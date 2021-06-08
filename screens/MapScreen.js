import React, { useState, useEffect } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import MapView from "react-native-maps";

const MapScreen = props => {
  return (
    <MapView
      initialRegion={{
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      }}
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
