import React, { useState, useEffect } from "react";
import {
  Keyboard,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View
} from "react-native";
import {
  Button,
  Colors,
  IconButton,
  Searchbar,
  Surface
} from "react-native-paper";
import MapView from "react-native-maps";
import * as Location from "expo-location";

const MapScreen = props => {
  const [location, setLocation] = useState(null);
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
      <Surface style={styles.searchbarContainer}>
        <Searchbar
          placeholder='Search here'
          style={styles.searchBar}
          iconColor={Colors.grey900}
        ></Searchbar>
        <IconButton
          icon='cog-outline'
          color={Colors.grey900}
          size={20}
          onPress={() => console.log("Pressed")}
        />
      </Surface>
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
  },
  searchbarContainer: {
    height: 60,
    width: "92%",
    flexDirection: "row",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    position: "absolute",
    top: 50,
    borderRadius: 15,
    elevation: 2
  },
  searchBar: {
    flex: 1,
    width: "95%",
    alignSelf: "stretch",
    borderRadius: 15,
    elevation: 0
  },
  settingsButton: {
    alignSelf: "stretch",
    width: 60
  }
});

export default MapScreen;
