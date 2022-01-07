import React from "react";
import { Colors, IconButton, Surface } from "react-native-paper";
import { StyleSheet, TextInput } from "react-native";
import Constants from "expo-constants";

const SearchbarComponent = ({
  inputValue,
  handleNewInput,
  onSubmitEditing,
  onSettingsPress,
  onAccountPress,
  resetQuery
}) => {
  const CloseButton = p => (
    <IconButton
      {...p}
      icon='close'
      color={Colors.grey800}
      size={23}
      onPress={resetQuery}
    />
  );

  return (
    <Surface style={styles.searchbarContainer}>
      <IconButton icon='magnify' color={Colors.grey800} size={23}></IconButton>
      <TextInput
        key={1}
        onChangeText={handleNewInput}
        placeholder="let's go somewhere!"
        style={styles.searchBar}
        value={inputValue}
        onSubmitEditing={onSubmitEditing}
      />
      {inputValue !== "" && <CloseButton />}
      <IconButton
        icon='cog-outline'
        color={Colors.grey800}
        size={23}
        onPress={onSettingsPress}
      />
      {false &&
      <IconButton
        icon='account-outline'
        color={Colors.grey800}
        size={23}
        onPress={onAccountPress}
      />
      }
    </Surface>
  );
};

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
  }
});

export default SearchbarComponent;
