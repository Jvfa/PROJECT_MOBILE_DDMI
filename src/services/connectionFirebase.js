
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/database";

let firebaseConfig = {
  apiKey: "AIzaSyD2Uae452b_ayxlj4er8W3TywSgy3DzclQ",
  authDomain: "appprimeiro-504b8.firebaseapp.com",
  projectId: "appprimeiro-504b8",
  storageBucket: "appprimeiro-504b8.firebasestorage.app",
  messagingSenderId: "780413081160",
  appId: "1:780413081160:web:ce401a8da804b7c2262a7d",
  measurementId: "G-N0ST4Y97MH"
};

// Initialize Firebase
if (!firebase.apps.length) {
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
}
export default firebase;