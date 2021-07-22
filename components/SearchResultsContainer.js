import React, { useState, useRef } from "react";
import { Keyboard, StyleSheet, View } from "react-native";

import config from "../keys/config.json";
import locationConfigs from "../presets/locationConfigs.json";
import userStateStore from "../store/UserStateStore";

import Predictions from "./PredictionsComponent";
import SearchbarComponent from './SearchbarComponent';

import axios from "axios";

const SearchResultsContainer = ({onAccountPress, onSettingsPress, predictions, setPredictions, inputValue, setInputValue, showNoResult}) => {

  const [loading, setLoading] = useState(false);

  const onChoosePrediction = (prediction) => {

    axios.get("https://maps.googleapis.com/maps/api/place/details/json", {
      params: {
        key: config.key,
        place_id: prediction.place_id
      }
    }).then(res => {
      
      let details = res.data.result;

      Keyboard.dismiss();

      setTimeout(() => { //Wait for keyboard to close

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
        
      }, 700);

      setInputValue(details.name);
      setPredictions([]);
    }).catch(err => {
      console.error(err);
    });
  }

  const handleNewInput = (newInput) => {

    let queryBody = {
      input: newInput,
      key: config.key,
      language: "en",
      components: "country:us",
      radius: locationConfigs.berkeley.radius,
      location: `${locationConfigs.berkeley.lat},${locationConfigs.berkeley.long}`,
      strictbounds: true
    }

    setLoading(true);

    axios.get("https://maps.googleapis.com/maps/api/place/autocomplete/json", {params: queryBody})
      .then(res => {
        let predictions = res.data.predictions.filter(pred => pred.description.endsWith("CA, USA")); //Inside california

        setPredictions(predictions);
      })
      .catch(err => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      })
    
    setInputValue(newInput);
  }

  const onSubmitEditing = () => {
    if (predictions.length != 0) {
      onChoosePrediction(predictions[0]);
    }
  }

  return (
    <View style={styles.floatingContainer}>
      <SearchbarComponent inputValue={inputValue} handleNewInput={handleNewInput} onSubmitEditing={onSubmitEditing} onSettingsPress={onSettingsPress} onAccountPress={onAccountPress}/>
      <Predictions noResults={showNoResult && !loading && inputValue != "" && predictions.length == 0} predictions={predictions} onChoosePrediction={onChoosePrediction} />
    </View>
  );
};

const styles = StyleSheet.create({
  floatingContainer: {
    position: "absolute",
    top: 50,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SearchResultsContainer;
