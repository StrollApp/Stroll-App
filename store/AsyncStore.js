import AsyncStorage from "@react-native-async-storage/async-storage";

export async function storeSafetyPreferences(profile) {
  await AsyncStorage.setItem("safetyPreferences", JSON.stringify(profile));
}

export async function getSafetyPreferences() {
  const jsonValue = await AsyncStorage.getItem("safetyPreferences");
  return jsonValue != null ? JSON.parse(jsonValue) : null;
}

export async function removeSafetyPreferences() {
  await AsyncStorage.removeItem("safetyPreferences");
}
