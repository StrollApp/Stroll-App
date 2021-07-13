import React, { useState } from "react";
import { StyleSheet, TextInput, Text, View, TouchableWithoutFeedback } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { Colors, IconButton, Surface } from "react-native-paper";

import config from "../keys/config.json";
import locationConfigs from "../presets/locationConfigs.json";
import userStateStore from "../store/UserStateStore";

import axios from "axios";

const SearchResultsContainer = props => {

  const Predictions = ({predictions, onChoosePrediction}) => {

    return (
      <View style={styles.optionList}>
          {predictions.map((prediction, i) => {
            return (
              <TouchableWithoutFeedback onPress={() => {onChoosePrediction(prediction)}} key={i}>
                <View style={styles.predictionText}>
                  <Text>{prediction.description}</Text>
                </View>
              </TouchableWithoutFeedback>
            )
          })}
      </View>
    )
  }

  // define search bar
  const SearchbarContainer = p => {

    [predictions, setPredictions] = useState([]);
  
    function onChoosePrediction(prediction) {
  
      axios.get("https://maps.googleapis.com/maps/api/place/details/json", {
        params: {
          key: config.key,
          place_id: prediction.place_id
        }
      }).then(res => {
        let details = res.data.result;
  
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
      }).catch(err => {
        console.error(err);
      });
    }
  
    function handleNewInput(newInput) {
  
      let queryBody = {
        input: newInput,
        key: config.key,
        language: "en",
        components: "country:us",
        radius: locationConfigs.berkeley.radius,
        location: `${locationConfigs.berkeley.lat},${locationConfigs.berkeley.long}`
      }
  
      axios.get("https://maps.googleapis.com/maps/api/place/autocomplete/json", {params: queryBody})
        .then(res => {
          let predictions = res.data.predictions;

          console.log(predictions.length);
  
          setPredictions(predictions);
        })
        .catch(err => {
          console.error(err);
        })
      
        return newInput;
    }

    return (
      <View style={styles.floatingContainer}>
        <Surface style={styles.searchbarContainer}>
          <IconButton icon='magnify' color={Colors.grey800} size={23}/>
          <TextInput key={1} onChangeText={handleNewInput}
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
          <IconButton
            icon='account-outline'
            color={Colors.grey800}
            size={23}
            onPress={props.onAccountPress}
          />
        </Surface>
        <Predictions predictions={predictions} onChoosePrediction={onChoosePrediction}></Predictions>
      </View>
    );
  };

  return <SearchbarContainer ref={props.searchResultsRef}></SearchbarContainer>
};

const styles = StyleSheet.create({
  floatingContainer: {
    position: "absolute",
    top: 50,
    width: "100%",
  },
  searchbarContainer: {
    height: 60,
    width: "100%",
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
  },
  optionList: {
    width: "100%",
    borderRadius: 5,
    marginTop: 1,
    backgroundColor: "white",
  },
  predictionText: {
    padding: 15,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f3f3",
  }
});

export default SearchResultsContainer;
