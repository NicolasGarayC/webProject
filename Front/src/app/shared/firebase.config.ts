// firebase.config.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

export const firebaseConfig = {
    apiKey: "AIzaSyANqnnqdq546BgLQXgzoICyitI3G69qwm0",
    authDomain: "webproj-6ccd8.firebaseapp.com",
    projectId: "webproj-6ccd8",
    storageBucket: "webproj-6ccd8.appspot.com",
    messagingSenderId: "664211464690",
    appId: "1:664211464690:web:95dbe9c8f64cb093a34b6b",
    measurementId: "G-J1GLXTCWS3"
  };

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
