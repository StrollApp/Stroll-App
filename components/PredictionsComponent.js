import React from "react";
import { Text, StyleSheet, View, TouchableOpacity } from "react-native";



const Predictions = ({predictions, onChoosePrediction, loading, noResults}) => {

  let inBerkeley = predictions.filter(prediction => prediction.description.includes("Berkeley, CA, USA"));
  let outsideBerkeley = predictions.filter(prediction => !prediction.description.includes("Berkeley, CA, USA"));

  return (
    <View style={styles.optionList}>
       {noResults ?
        <View style={styles.status}>
          <Text>No results</Text>
        </View>
       : null}

        {inBerkeley.map((prediction, i) => {
          return (
            <TouchableOpacity onPress={() => {onChoosePrediction(prediction)}} key={i}>
              <View style={styles.predictionText}>
                <Text>{prediction.description}</Text>
              </View>
            </TouchableOpacity>
          )
        })}
        {inBerkeley.length < 2 ? outsideBerkeley.map((prediction, i) => {
          return (
            <TouchableOpacity onPress={() => {onChoosePrediction(prediction)}} key={i}>
              <View style={{backgroundColor: "#ededed", ...styles.predictionText}}>
                <Text style={{fontStyle: "italic", fontSize: 10}}>Outside berkeley</Text>
                <Text>{prediction.description}</Text>
              </View>
            </TouchableOpacity>
          )
        }) : null}
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