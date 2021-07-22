import React, { useState, useEffect, useRef } from "react";
import { Alert, Keyboard, Linking, StyleSheet, View } from "react-native";
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
import { getRoute } from "../services/RouteGeneration";
import { openInGoogleMaps } from "../helpers/googleMapHelper";

import locationConfigs from "../presets/locationConfigs.json";
import config from "../keys/config.json";

const MapScreen = observer(props => {
  const [location, setLocation] = useState(null);
  const [inBerkeley, setInBerkeley] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [routeObject, setRouteObject] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const mapRef = useRef(null);

  const bottomSheetRef = useRef(null);
  const searchResultsRef = useRef(null);
  const { colors } = useTheme();

  const dismissSearch = () => {
    Keyboard.dismiss();
    setPredictions([]);
    if (
      userStateStore.destinationStatus !=
      userStateStore.destinationStatusOptions.ABSENT
    ) {
      setInputValue(userStateStore.destinationData.name);
    }
  };

  const closeDestinationCard = () => {
    setRouteObject(null);
    setInputValue("");
    bottomSheetRef.current.close();
    userStateStore.clearDestinationData();
    userStateStore.setDestinationStatus(
      userStateStore.destinationStatusOptions.ABSENT
    );
  };

  const generateAndStoreRoute = async () => {
    // make sure user is in Berkeley
    if (!inBerkeley) {
      Alert.alert(
        "Notice",
        "Stroll is only available in Berkeley for this release. You can sign up below to stay updated when Stroll comes to your city!",
        [
          {
            text: "Keep Me Posted",
            onPress: () => {
              Linking.openURL("https://getstroll.app/");
            }
          },
          { text: "Ok" }
        ]
      );
      return;
    }

    // query route from backend
    const safetyaPreferences = Object.keys(
      userStateStore.safteyPreferences
    ).filter(key => userStateStore.safteyPreferences[key]);
    const route = await getRoute(
      {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      },
      userStateStore.destinationData.coordinates,
      safetyaPreferences
    );
    console.log(route);
    setRouteObject(route);

    // update user state
    userStateStore.setDestinationStatus(
      userStateStore.destinationStatusOptions.ROUTED
    );
  };

  const openRouteInGoogleMaps = async () => {
    openInGoogleMaps(routeObject.start, routeObject.waypoints, routeObject.end);
  };

  // ask for user permission and get location upon acceptance
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);

      // if user is outside of Berkeley, provide alert
      let locInf = (await Location.reverseGeocodeAsync(loc.coords))[0];
      setInBerkeley(locInf == "Berkeley");
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
    }
  }, [userStateStore.destinationData]);

  return (
    <View style={styles.container}>
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
        onTouchStart={dismissSearch}
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
            origin={routeObject.start}
            destination={routeObject.end}
            waypoints={routeObject.waypoints}
            strokeColor={colors.primary}
            strokeWidth={5}
            mode='WALKING'
            apikey={config.key}
          />
        )}
      </MapView>
      <SearchResultsContainer
        searchResultsRef={searchResultsRef}
        onSettingsPress={() => {
          dismissSearch();
          setShowSettings(true);
        }}
        onAccountPress={() => {
          dismissSearch();
          setShowAccount(true);
        }}
        predictions={predictions}
        setPredictions={setPredictions}
        inputValue={inputValue}
        setInputValue={setInputValue}
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
        onDismiss={closeDestinationCard}
        onGenerateWalk={generateAndStoreRoute}
        onOpenRoute={openRouteInGoogleMaps}
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
