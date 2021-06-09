import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/firestore";
import "firebase/functions";
import "firebase/storage";
import "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyB98irc3h6bPLYC2neY9fcWJRgaFY8_qbU",
    authDomain: "overbooked-in.firebaseapp.com",
    projectId: "overbooked-in",
    storageBucket: "overbooked-in.appspot.com",
    messagingSenderId: "376098439791",
    appId: "1:376098439791:web:11cecedab58b472d24439a",
    measurementId: "G-E85VYQV431"
};
try {
  firebase.initializeApp(firebaseConfig);
} catch(err){
  if (!/already exists/.test(err.message)) {
    console.error('Firebase initialization error', err.stack)}
}

if (typeof window !== "undefined") {
    firebase.analytics();
}

const fire = firebase;


export const db = fire.firestore()
export const storageRef = fire.storage().ref()
export const auth = fire.auth()
// export const functions = firebase.functions().useFunctionsEmulator("http://localhost:5001/theonlyindianstore/asia-south1/uploadVimeoVideo")
// export const functions = firebase.app().functions("asia-south1")
// if (process.env.NODE_ENV == 'development') {
//     functions.useFunctionsEmulator("http://localhost:5001")
// } 
// export const uploadVimeoVideoFunction = functions.httpsCallable("uploadVimeoVideo")

// export const requestPaymentChecksumSignature = functions.httpsCallable("payment-requestChecksum")

export default fire;
