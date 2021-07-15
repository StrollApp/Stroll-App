import axios from "axios";

const getRoute = async (start, end, params) => {
  // set up query
  const queryObject = { points: { start, end }, safetyParams: params };
  const res = await axios.post(
    "https://dtwy0utgca.execute-api.us-west-1.amazonaws.com/Prod/generate-route", 
    queryObject
  );

  // extract and returned route data
  const route = res.data.route;
  return route;
};

export { getRoute };
