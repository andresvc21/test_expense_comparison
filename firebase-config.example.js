// Firebase Configuration for Life Cost Calculator
// Copy this file to firebase-config.js and fill in your Firebase project values
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.firebasestorage.app",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

// Initialize Firebase (this connects your app to your Firebase project)
firebase.initializeApp(firebaseConfig);

// Create a reference to Firestore (the database)
// This "db" variable is used in app.js to read and write wage data
const db = firebase.firestore();
