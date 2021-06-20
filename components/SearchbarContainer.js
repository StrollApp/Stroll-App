import React, { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import { Colors, IconButton, Searchbar, Surface } from "react-native-paper";

const SearchbarContainer = props => {
  return (
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
        onPress={props.onSettingsPress}
      />
    </Surface>
  );
};

const styles = StyleSheet.create({
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

export default SearchbarContainer;
