// UserStateStore stores information about the user state in a given session
// the state store includes:
//  - safety preferences
//  - destination routing status
//  - authenticated user object
import { observable, computed, action, makeObservable } from "mobx";
import defaultSettings from "../presets/defaultSettings.json";

class UserStateStore {
  safteyPreferences = { ...defaultSettings };
  destinationStatus = "absent";
  userProfile = null;

  constructor() {
    makeObservable(this, {
      safteyPreferences: observable,
      destinationStatus: observable,
      userProfile: observable,
      setSafteyPreferences: action,
      useDefaultSafteyPreferences: action,
      getSafteyPreferences: computed,
      setDestinationStatus: action,
      getDestinationStatus: computed,
      setProfile: action,
      clearProfile: action,
      userInitialized: computed
    });
  }

  setSafteyPreferences(pref) {
    this.safteyPreferences = pref;
  }

  useDefaultSafteyPreferences() {
    this.safteyPreferences = { ...defaultSettings };
  }

  get getSafteyPreferences() {
    return this.safteyPreferences;
  }

  setDestinationStatus(status) {
    this.destinationStatus = status;
  }

  get getDestinationStatus() {
    return this.destinationStatus;
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
