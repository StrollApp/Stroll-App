import * as firebase from "firebase";
import userStateStore from "../store/UserStateStore";
import { removeAllStorageEntries } from "../store/AsyncStore";

export function signOut() {
  firebase
    .auth()
    .signOut()
    .then(() => {
      userStateStore.resetAllSessionParams();
      removeAllStorageEntries();
    })
    .catch(console.log);
}
