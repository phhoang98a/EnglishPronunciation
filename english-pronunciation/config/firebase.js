// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCybN-KIQprUflzEftLE4geWyUSmsZ12A0",
  authDomain: "engpronun-d85fd.firebaseapp.com",
  projectId: "engpronun-d85fd",
  storageBucket: "engpronun-d85fd.appspot.com",
  messagingSenderId: "913551324707",
  appId: "1:913551324707:web:169708c216d7f937a42396",
  measurementId: "G-6556ZDS6N3"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);


const storage = getStorage(app)

export { storage }