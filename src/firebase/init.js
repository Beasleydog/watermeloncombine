// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBjr-29uDPmIRdUH8MUeyZw8UBN05aP6Xc",
    authDomain: "ballcombine.firebaseapp.com",
    projectId: "ballcombine",
    storageBucket: "ballcombine.appspot.com",
    messagingSenderId: "580117265366",
    appId: "1:580117265366:web:9c4ec1afb59ed6b9c88277",
    measurementId: "G-9Z22W2NK37",
    databaseURL: "https://ballcombine-default-rtdb.firebaseio.com/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
export default database;