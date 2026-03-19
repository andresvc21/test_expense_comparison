// Firebase Configuration for Life Cost Calculator
const firebaseConfig = {
  apiKey: "AIzaSyDVh18cAS9XOMk4h9NnYcxyNwK_giG0Ky4",
  authDomain: "test-expense-comparison.firebaseapp.com",
  projectId: "test-expense-comparison",
  storageBucket: "test-expense-comparison.firebasestorage.app",
  messagingSenderId: "588367504875",
  appId: "1:588367504875:web:227d4b2e345015541a25ae",
  measurementId: "G-4EQDWYBF0H"
};

// Initialize Firebase (this connects your app to your Firebase project)
firebase.initializeApp(firebaseConfig);

// Create a reference to Firestore (the database)
// This "db" variable is used in app.js to read and write wage data
const db = firebase.firestore();
