import React from "react";
import { Surface, Divider } from "react-native-paper";
import { Text, StyleSheet, View, TouchableOpacity } from "react-native";

const Predictions = ({ predictions, onChoosePrediction }) => {
  return (
    <Surface style={styles.optionList}>
      {predictions.map((prediction, i) => {
        return (
          <TouchableOpacity
            onPress={() => {
              onChoosePrediction(prediction);
            }}
            key={i}
          >
            <View
              style={
                i === 0 ? styles.firstPredictionText : styles.predictionText
              }
            >
              <Text>{prediction.description}</Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </Surface>
  );
};

const styles = StyleSheet.create({
  optionList: {
    width: "95%",
    borderRadius: 15,
    marginTop: 1,
    elevation: 1,
    backgroundColor: "white"
  },
  predictionText: {
    padding: 15,
    alignItems: "flex-start",
    borderTopWidth: 1,
    borderTopColor: "#f3f3f3"
  },
  firstPredictionText: {
    padding: 15,
    alignItems: "flex-start"
  },
  status: {
    padding: 15,
    paddingBottom: 5,
    paddingTop: 5,
    alignItems: "flex-start",
    backgroundColor: "#ededed"
  }
});

export default Predictions;
