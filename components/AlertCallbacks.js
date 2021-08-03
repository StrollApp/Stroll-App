import { Alert } from "react-native";
import * as Linking from "expo-linking";

export const routeWarning = () => {
  Alert.alert(
    "Heads up!",
    "You're outside of Berkeley! Stroll can still create a route, but only parts inside Berkeley will account for safety.",
    [
      { text: "Ok" }
    ]
  );
};

export const userNotFound = () => {
  Alert.alert(
    "User Location Not Found",
    "Stroll cannot find your current location, please make sure location permissions are granted.",
    [{ text: "Ok" }]
  );
};
