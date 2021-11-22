import React from "react";
import { Heatmap } from "react-native-maps";
import { StyleSheet } from "react-native";

const DataHeatmap = ({ data }) => {
  if (!data) return null;

  const dataArr = data.dataArray;
  if (!dataArr || dataArr.length === 0) return null;

  const cutoffs = [0.00001, 30 / 2500, 50 / 2500, 70 / 2500, 110 / 2500];

  return (
    <Heatmap
      points={dataArr}
      opacity={0.7}
      radius={60}
      gradient={{
        colors: ["#79BC6A", "#BBCF4C", "#EEC20B", "#F29305", "#E50000"],
        startPoints: cutoffs,
        colorMapSize: 512
      }}
    />
  );
};

const styles = StyleSheet.create({});

export default DataHeatmap;
