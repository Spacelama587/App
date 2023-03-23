import {initializeApp} from "firebase/app";
import {getFirestore} from "firebase/firestore";
import {getStorage} from "firebase/storage";
import{getAuth} from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDhXhgeUhIFFQaTDf4yToeVr_dBd7KrgzQ",
    authDomain: "blog-51e54.firebaseapp.com",
    projectId: "blog-51e54",
    storageBucket: "blog-51e54.appspot.com",
    messagingSenderId: "736633044626",
    appId: "1:736633044626:web:978cd86d01ecb6c5b3304b",
    measurementId: "G-YJ23LPK895"
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const storage = getStorage(app);

  export {auth, db, storage}