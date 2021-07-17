import axios from "axios";
import endpoints from "../presets/endpoints.json";
import * as firebase from "firebase";

// takes start and end points as objects with longitude and latitude
// and params as an array of strings
// returns the same start and end point, and an array of waypoints
// where each entry is an object with a longitude and latitude
const getRoute = async (start, end, params) => {
  // set up query
  const queryObject = {
    points: { start, end },
    safetyParams: params
  };

  const token = await firebase.auth().currentUser.getIdToken();
  const headers = {
    Authorization: `Bearer ${token}`
  };

  // make query
  const res = await axios
    .post(endpoints.routeGeneration, queryObject, { headers })
    .catch(error => {
      console.log(error.response.data);
    });

  // extract and returned route data
  const route = res.data.route;
  return route;
};

export { getRoute };
