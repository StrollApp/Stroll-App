import React from "react";
import { Text, StyleSheet, View, TouchableWithoutFeedback } from "react-native";



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

const styles = StyleSheet.create({
  optionList: {
    width: "95%",
    borderRadius: 5,
    marginTop: 1,
    backgroundColor: "white",
  },
  predictionText: {
    padding: 15,
    alignItems: "flex-start",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f3f3",
  }
});

export default Predictions;