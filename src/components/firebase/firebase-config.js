import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDqPlQffyid8k0-KpgZ65xEsHdzbKhXq0k",
  authDomain: "shotsview-2024.firebaseapp.com",
  projectId: "shotsview-2024",
  storageBucket: "shotsview-2024.appspot.com",
  messagingSenderId: "332291540467",
  appId: "1:332291540467:web:e630d2f53958486490fe86",
  measurementId: "G-9ZCRY1G236",
  databaseURL:
    "https://shotsview-2024-default-rtdb.europe-west1.firebasedatabase.app/",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const fireStorage = getStorage(app);
export const realTimeDatabase = getDatabase(app);
