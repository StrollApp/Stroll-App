import { Alert } from "react-native";
import * as Linking from "expo-linking";

export const blockRouting = () => {
  Alert.alert(
    "Notice",
    "Stroll can only route users in Berkeley for this release. Sign up below to stay updated on when Stroll comes to your city!",
    [
      {
        text: "Keep Me Posted",
        onPress: () => {
          Linking.openURL("https://getstroll.app/");
        }
      },
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
