// UserStateStore stores information about the user state in a given session
// the state store includes:
//  - safety preferences
//  - destination routing status
//  - destination data
//  - authenticated user object
import { observable, computed, action, makeObservable } from "mobx";
import defaultSettings from "../presets/defaultSettings.json";
import destStatusOptions from "../presets/destStatusOptions.json";

class UserStateStore {
  safteyPreferences = { ...defaultSettings };
  destinationStatus = "absent";
  destinationData = null;
  userProfile = null;
  destinationStatusOptions = { ...destStatusOptions };

  constructor() {
    makeObservable(this, {
      safteyPreferences: observable,
      destinationStatus: observable,
      destinationData: observable,
      userProfile: observable,
      setSafteyPreferences: action,
      useDefaultSafteyPreferences: action,
      setDestinationStatus: action,
      setDestinationData: action,
      clearDestinationData: action,
      setProfile: action,
      clearProfile: action,
      userInitialized: computed
    });
  }

  setSafteyPreferences(pref) {
    this.safteyPreferences = pref;
    console.log(this.safteyPreferences);
  }

  useDefaultSafteyPreferences() {
    this.safteyPreferences = { ...defaultSettings };
  }

  setDestinationStatus(status) {
    this.destinationStatus = status;
  }

  setDestinationData(dat) {
    this.destinationData = dat;
  }

  clearDestinationData() {
    this.destinationData = null;
  }

  setProfile(profile) {
    this.userProfile = profile;
  }

  clearProfile() {
    this.setProfile(null);
  }

  get userInitialized() {
    return !!this.userProfile;
  }
}

let userStateStore = new UserStateStore();

export default userStateStore;
