// UserStateStore stores information about the user state in a given session
// the state store includes:
//  - safety preferences
//  - destination routing status
//  - destination data
//  - heatmap preference
//  - authenticated user object
import { observable, computed, action, makeObservable, toJS } from "mobx";
import defaultSettings from "../presets/defaultSettings.json";
import destStatusOptions from "../presets/destStatusOptions.json";
import { getRoute } from "../services/RouteGeneration";
import { getHeatmapData } from "../services/HeatmapDataFetch";

class UserStateStore {
  safteyPreferences = { ...defaultSettings };
  destinationStatus = destStatusOptions.ABSENT;
  destinationData = null;
  destinationStatusOptions = { ...destStatusOptions };
  heatmapType = "CRIME";
  routeObject = null;

  previousRouteQuery = "";

  constructor() {
    makeObservable(this, {
      safteyPreferences: observable,
      destinationStatus: observable,
      destinationData: observable,
      heatmapType: observable,
      routeObject: observable,

      setSafteyPreferences: action,
      useDefaultSafteyPreferences: action,
      setDestinationStatus: action,
      setDestinationData: action,
      setRouteObject: action,
      clearRouteObject: action,
      clearDestinationData: action,
      clearQueuedRouteRequest: action,
      setHeatmapType: action,
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

  setRouteObject(obj) {
    this.routeObject = obj;
  }

  clearRouteObject() {
    this.routeObject = null;
  }

  clearQueuedRouteRequest() {
    this.previousRouteQuery = "";
  }

  setHeatmapType(type) {
    this.heatmapType = type;
  }

  resetAllSessionParams() {
    this.useDefaultSafteyPreferences();
    this.setDestinationStatus(destStatusOptions.ABSENT);
    this.clearDestinationData();
  }

  // mutates state objects based on given query
  // returns whether a specific call to this fuction is
  // the most recent call
  async generateRouteObjFromQuery(start, end, params) {
    try {
      const query = `${start}, ${end}, ${params}`;
      this.previousRouteQuery = query;

      const route = await getRoute(start, end, params);

      if (query === this.previousRouteQuery) {
        this.setRouteObject(route);
        return true;
      }
    } catch (error) {
      console.log("error while trying to get route");
      console.log(error);
    }
    return false;
  }
}

let userStateStore = new UserStateStore();

export default userStateStore;
