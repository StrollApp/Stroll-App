import React from "react";
import { Heatmap } from "react-native-maps";
import { StyleSheet, Platform } from "react-native";

const DataHeatmap = ({ data }) => {
  if (!data) return null;

  const dataArr = data.dataArray;
  if (!dataArr || dataArr.length === 0) return null;

  if (Platform.OS === "android") {
    return (
      <Heatmap
        key={dataArr.length}
        points={dataArr}
        opacity={1}
        radius={dataArr.length > 5000 ? 15 : 50}
      />
    );
  }

  return (
    <Heatmap
      key={dataArr.length}
      points={dataArr}
      opacity={0.7}
      radius={50}
      gradient={{
        colors: ["#79BC6A", "#BBCF4C", "#EEC20B", "#F29305", "#E50000"],
        startPoints: [0.00001, 30 / 2500, 50 / 2500, 70 / 2500, 110 / 2500],
        colorMapSize: dataArr.length
      }}
    />
  );
};

const styles = StyleSheet.create({});

export default DataHeatmap;
