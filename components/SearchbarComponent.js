import React from "react";
import { Colors, IconButton, Surface, Searchbar } from "react-native-paper";
import { StyleSheet, TextInput } from "react-native";
import { useEffect } from "react/cjs/react.production.min";

const SearchbarComponent = ({inputValue, handleNewInput, onSubmitEditing, onSettingsPress, onAccountPress}) => {

  return (
    <Surface style={styles.searchbarContainer}>
      <Searchbar key={1} onChangeText={handleNewInput}
        placeholder="let's go somewhere!"
        style={styles.searchBar}
        iconColor={Colors.grey800}
        value={inputValue}
        onSubmitEditing={onSubmitEditing}
      />
      <IconButton
        icon='cog-outline'
        color={Colors.grey800}
        size={23}
        onPress={onSettingsPress}
      />
      <IconButton
        icon='account-outline'
        color={Colors.grey800}
        size={23}
        onPress={onAccountPress}
      />
    </Surface>
  )
}


const styles = StyleSheet.create({
  searchbarContainer: {
    height: 60,
    width: "95%",
    flexDirection: "row",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 15,
    elevation: 0
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
  }
});

export default SearchbarComponent;