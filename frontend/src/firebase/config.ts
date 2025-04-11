import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";
import 'firebase/storage'


const firebaseConfig = {
    apiKey: import.meta.env.VITE_APIKEY,
    authDomain: import.meta.env.VITE_AUTHDOMAIN,
    projectId: import.meta.env.VITE_PROJECTID,
    storageBucket: 'job-club-5f5bb.appspot.com',
    messagingSenderId: import.meta.env.VITE_MESSAGINGSENDERID,
    appId:import.meta.env.VITE_APPID,
    measurementId:import.meta.env.VITE_MEASUREMENTID
  };


export const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default auth

