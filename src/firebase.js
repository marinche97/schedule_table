import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import {
  getDatabase,
  ref,
  set,
  push,
  onValue,
  remove,
} from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAvEvshuj_Jp8AUT_YqLTiD_TE06jKqpwA",
  authDomain: "raspored-vjezbi.firebaseapp.com",
  databaseURL:
    "https://raspored-vjezbi-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "raspored-vjezbi",
  storageBucket: "raspored-vjezbi.firebasestorage.app",
  messagingSenderId: "586338261808",
  appId: "1:586338261808:web:07875b35b27bb55eefc6f5",
  measurementId: "G-8EZXSX1WT2",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
// const analytics = getAnalytics(app);
const scheduleRef = ref(db, "schedule");

// export const database = getDatabase(app);
export { db, ref, scheduleRef, set, push, onValue, remove };
