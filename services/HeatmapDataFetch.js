import axios from "axios";
import endpoints from "../presets/endpoints.json";
import * as firebase from "firebase";
import Constants from "expo-constants";

// takes type of heatmap being queried, valid types are documented
// here (under the /get-heat-map (POST request) section):
// https://www.notion.so/Backend-API-Documentations-7e62b73ee81648c8b48524690cabe38a
//
// returns an object of the shape
// array of data points in the format outlined in the same notion doc above
export async function getHeatmapData(type) {
  // set up query
  const queryObject = {
    type
  };

  const token = Constants.manifest.extra.requireAuth
    ? await firebase.auth().currentUser.getIdToken()
    : "notoken";
  const headers = {
    Authorization: `Bearer ${token}`
  };

  // make query
  const res = await axios
    .post(endpoints.heatmapDataFetch, queryObject, { headers })
    .catch(error => {
      console.log(error.response.data);
    });

  // return the query result data
  return res.data;
}
