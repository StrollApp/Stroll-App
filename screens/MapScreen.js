import React, { useState, useEffect, useRef } from "react";
import { Keyboard, StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";
import MapView, { Marker, Heatmap } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import * as Location from "expo-location";
import { observer } from "mobx-react";

import SettingsModal from "../modals/SettingsModal";
import AccountModal from "../modals/AccountModal";
import SearchResultsContainer from "../components/SearchResultsContainer";
import BottomSheetContainer from "../components/BottomSheetContainer";
import DataHeatmap from "../components/DataHeatmap";
import userStateStore from "../store/UserStateStore";
import { storeSafetyPreferences } from "../store/AsyncStore";
import { Platform } from "react-native";
import { openInGoogleMaps } from "../helpers/googleMapHelper";
import { routeBlocking, userNotFound } from "../components/AlertCallbacks";

import locationConfigs from "../presets/locationConfigs.json";
import config from "../keys/config.json";
import { getHeatmapData } from "../services/HeatmapDataFetch";

const MapScreen = observer(props => {
  const [location, setLocation] = useState(null);
  const [trackingPermitted, setTrackingPermitted] = useState(false);
  const [inBerkeley, setInBerkeley] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [predictions, setPredictions] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [heatmapData, setHeatmapData] = useState(null);
  const mapRef = useRef(null);

  const bottomSheetRef = useRef(null);
  const searchResultsRef = useRef(null);
  const { colors } = useTheme();

  // callback for closing searchbar
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

  // callback for closing destination card and clearing routing data
  const clearSearchResult = () => {
    userStateStore.clearQueuedRouteRequest();
    userStateStore.clearRouteObject();
    setInputValue("");
    setPredictions([]);
    setTimeout(
      () => {
        userStateStore.clearDestinationData();
        userStateStore.setDestinationStatus(
          userStateStore.destinationStatusOptions.ABSENT
        );
        bottomSheetRef.current.close();
      },
      Platform.OS === "android" ? 700 : 0
    );
  };

  const closeDestinationCard = () => {
    Keyboard.dismiss();
    clearSearchResult();
  };

  const clearSearchField = () => {
    if (Platform.OS === "android") Keyboard.dismiss();
    clearSearchResult();
  };

  // generate a route to destination and store in state
  const generateAndStoreRoute = async () => {
    // make sure user location is provided

    if (!location) {
      userNotFound();
      return;
    }

    try {
      if (!inBerkeley) {
        routeBlocking();
        return;
      }

      // query route from backend
      const safetyaPreferences = Object.keys(
        userStateStore.safteyPreferences
      ).filter(key => userStateStore.safteyPreferences[key]);
      const valid = await userStateStore.generateRouteObjFromQuery(
        {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        },
        userStateStore.destinationData.coordinates,
        safetyaPreferences
      );

      if (valid) {
        // update user state
        userStateStore.setDestinationStatus(
          userStateStore.destinationStatusOptions.ROUTED
        );
      }
    } catch (err) {
      console.log("encountered error while attempting to create route");
      console.log(err);
    }
  };

  // open route in state variable in Google Maps
  const openRouteInGoogleMaps = async () => {
    var waypoints = userStateStore.routeObject.waypoints.slice();

    if (waypoints.length > 23) waypoints.splice(0, 1);
    if (waypoints.length > 23) waypoints.splice(waypoints.length - 1, 1);
    while (waypoints.length > 23) {
      const random = Math.floor(Math.random() * waypoints.length);
      waypoints.splice(random, 1);
    }

    openInGoogleMaps(
      userStateStore.routeObject.start,
      waypoints,
      userStateStore.routeObject.end
    );
  };

  // fetch the user location
  const fetchUserLocation = async () => {
    if (!trackingPermitted) return;

    try {
      // set location state
      let loc = await Location.getCurrentPositionAsync({ accuracy: 3 });
      setLocation(loc);

      // if user is outside of Berkeley, provide alert
      let locInf = (await Location.reverseGeocodeAsync(loc.coords))[0];
      setInBerkeley(locInf.city == "Berkeley");
    } catch (error) {
      console.log("error while retrieving location");
      console.log(error);
    }
  };

  // ask for user permission and get location upon acceptance
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      setTrackingPermitted(true);

      let loc = await Location.getCurrentPositionAsync({ accuracy: 3 });
      setLocation(loc);

      // if user is outside of Berkeley, provide alert
      let locInf = (await Location.reverseGeocodeAsync(loc.coords))[0];
      const inBounds = locInf.city == "Berkeley";
      setInBerkeley(inBounds);

      // warn user if outside of Berkeley
      if (!inBounds) {
        routeBlocking();
      }
    })();
  }, []);

  // update location on interval
  useEffect(() => {
    // set recurring action for every 7 seconds
    const interval = setInterval(fetchUserLocation, 7000);
    return () => clearInterval(interval);
  });

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

  // update heatmap when user changes heatmap settings
  useEffect(() => {
    getHeatmapData(userStateStore.heatmapType)
      .then(data => {
        setHeatmapData(data);
      })
      .catch(err => {
        console.log("error while updating heatmap data");
        console.log(err);
      });
  }, [userStateStore.heatmapType]);

  return (
    <View style={styles.container}>
      <MapView
        showsUserLocation={true}
        showsCompass={false}
        showsMyLocationButton={false}
        initialRegion={{
          latitude: locationConfigs.berkeley.lat,
          longitude: locationConfigs.berkeley.long,
          latitudeDelta: 0.1,
          longitudeDelta: 0.05
        }}
        style={styles.mapView}
        onTouchStart={dismissSearch}
        ref={mapRef}
        provider='google'
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
        {userStateStore.routeObject !== null &&
          userStateStore.destinationStatus ===
            userStateStore.destinationStatusOptions.ROUTED &&
          (() => {
            var segments = [];
            const points = [
              userStateStore.routeObject.start,
              ...userStateStore.routeObject.waypoints,
              userStateStore.routeObject.end
            ].slice();
            for (var i = 0; i < points.length; i += 23) {
              const chunk = points.slice().slice(i, i + 24);
              const waypoints = chunk.slice().slice(1, chunk.length - 1);
              segments.push(
                <MapViewDirections
                  key={i}
                  origin={chunk[0]}
                  destination={chunk[chunk.length - 1]}
                  waypoints={waypoints}
                  strokeColor={colors.primary}
                  strokeWidth={5}
                  mode='WALKING'
                  apikey={config.key}
                />
              );
            }
            return segments;
          })()}
        <DataHeatmap data={heatmapData} />
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
        resetQuery={clearSearchField}
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
