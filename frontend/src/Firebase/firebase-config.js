import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getAuth } from "@firebase/auth";
import { getStorage } from '@firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDrPqZkt0XViM5fc0ngCgeGmwJ9g6_ulw4",
  authDomain: "trial-ce9da.firebaseapp.com",
  databaseURL: "https://trial-ce9da-default-rtdb.firebaseio.com",
  projectId: "trial-ce9da",
  storageBucket: "trial-ce9da.appspot.com",
  messagingSenderId: "445507113419",
  appId: "1:445507113419:web:491fc014d47496191da64e"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

export { app, auth, firestore,storage };