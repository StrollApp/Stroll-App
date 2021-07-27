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
  destinationStatus = destStatusOptions.ABSENT;
  destinationData = null;
  destinationStatusOptions = { ...destStatusOptions };

  constructor() {
    makeObservable(this, {
      safteyPreferences: observable,
      destinationStatus: observable,
      destinationData: observable,
      setSafteyPreferences: action,
      useDefaultSafteyPreferences: action,
      setDestinationStatus: action,
      setDestinationData: action,
      clearDestinationData: action
    });
  }

  setSafteyPreferences(pref) {
    this.safteyPreferences = pref;
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

  resetAllSessionParams() {
    this.useDefaultSafteyPreferences();
    this.setDestinationStatus(destStatusOptions.ABSENT);
    this.clearDestinationData();
  }
}

let userStateStore = new UserStateStore();

export default userStateStore;
