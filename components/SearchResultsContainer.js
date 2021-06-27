import React, { useState } from "react";
import { StyleSheet, TextInput } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { Colors, IconButton, Searchbar, Surface } from "react-native-paper";

import config from "../keys/config.json";

const SearchResultsContainer = props => {
  // define search bar
  const SearchbarContainer = p => {
    return (
      <Surface style={styles.searchbarContainer}>
        <IconButton icon='magnify' color={Colors.grey800} size={23} />
        <TextInput
          {...props}
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
      enablePoweredByContainer={false}
      fetchDetails={true}
      GooglePlacesSearchQuery={{
        rankby: "distance"
      }}
      onPress={(data, details = null) => {
        // 'details' is provided when fetchDetails = true
        console.log(data, details);
      }}
      textInputProps={{
        InputComp: SearchbarContainer
      }}
      query={{
        key: config.key,
        language: "en",
        components: "country:us",
        types: "establishment",
        radius: 30000
      }}
      styles={{
        container: styles.container,
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
