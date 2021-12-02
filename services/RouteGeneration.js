import axios from "axios";
import * as firebase from "firebase";
import Constants from "expo-constants";

// takes start and end points as objects with longitude and latitude
// and params as an array of strings
// returns the same start and end point, and an array of waypoints
// where each entry is an object with a longitude and latitude
export async function getRoute(start, end, params) {
  // set up query
  const queryObject = {
    points: { start, end },
    safetyParams: params
  };

  const token = Constants.manifest.extra.requireAuth
    ? await firebase.auth().currentUser.getIdToken()
    : "notoken";
  const headers = {
    Authorization: `Bearer ${token}`
  };

  // make query
  const res = await axios
    .post(`${Constants.manifest.extra.apiBaseUrl}/generate-route`, queryObject, {
      headers
    })
    .catch(error => {
      console.log(error.response.data);
    });

  // extract and returned route data
  const route = res.data.route;
  return route;
}
