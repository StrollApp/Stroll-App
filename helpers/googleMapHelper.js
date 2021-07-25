import * as Linking from "expo-linking";

// open Google maps such that it routes the user from
// the start to end points through the selected waypoints
export function openInGoogleMaps(start, waypoints, end) {
  const routeURL = getRouteURL(start, waypoints, end);
  console.log(routeURL);
  Linking.openURL(routeURL);
}

// create Google maps url, when opened, routes the user from
// the start to end points through the selected waypoints
export function getRouteURL(start, waypoints, end) {
  var routeURL = "https://www.google.com/maps/dir/";
  const points = [start, ...waypoints, end];
  points.forEach(loc => {
    routeURL += `${loc.latitude},${loc.longitude}/`;
  });
  routeURL += "data=!4m2!4m1!3e2";
  return routeURL;
}
