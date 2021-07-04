import React, { useState } from "react";
import { StyleSheet, TextInput, Text, View } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { Colors, IconButton, Surface } from "react-native-paper";

import config from "../keys/config.json";
import locationConfigs from "../presets/locationConfigs.json";
import userStateStore from "../store/UserStateStore";

const SearchResultsContainer = props => {
  // define search bar
  const SearchbarContainer = p => {
    return (
      <Surface style={styles.searchbarContainer}>
        <IconButton icon='magnify' color={Colors.grey800} size={23} />
        <TextInput
          {...p}
          placeholder="let's go somewhere!"
          style={styles.searchBar}
        />
        <IconButton
          icon='cog-outline'
          color={Colors.grey800}
          size={23}
          onPress={props.onSettingsPress}
        />
      </Surface>
    );
  };

  return (
    <GooglePlacesAutocomplete
      ref={props.searchResultsRef}
      isRowScrollable={false}
      enablePoweredByContainer={false}
      fetchDetails={true}
      GooglePlacesSearchQuery={{
        rankby: "distance"
      }}
      onPress={(data, details = null) => {
        // 'details' is provided when fetchDetails = true
        userStateStore.setDestinationData({
          name: details.name,
          address: details.formatted_address,
          phoneNumber: details.formatted_phone_number,
          coordinates: {
            latitude: details.geometry.location.lat,
            longitude: details.geometry.location.lng
          }
        });
        userStateStore.setDestinationStatus(
          userStateStore.destinationStatusOptions.FOUND
        );
      }}
      textInputProps={{
        InputComp: SearchbarContainer
      }}
      query={{
        key: config.key,
        language: "en",
        components: "country:us",
        radius: locationConfigs.berkeley.radius,
        location: `${locationConfigs.berkeley.lat},${locationConfigs.berkeley.long}`
      }}
      renderRow={(data, index) => {
        return <Text>{data.description}</Text>;
      }}
      styles={{
        container: styles.container,
        textInput: styles.searchBar,
        listView: styles.listView
      }}
    />
  );
};

const styles = StyleSheet.create({
  searchbarContainer: {
    height: 60,
    width: "100%",
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
    elevation: 0,
    backgroundColor: "white",
    fontSize: 18,
    marginLeft: 5
  },
  settingsButton: {
    alignSelf: "stretch",
    width: 60
  },
  container: {
    flex: 0,
    position: "absolute",
    width: "95%",
    alignSelf: "center",
    zIndex: 1
  },
  listView: {
    backgroundColor: "white",
    borderRadius: 15,
    alignSelf: "center",
    width: "100%",
    marginTop: 120
  }
});

export default SearchResultsContainer;
