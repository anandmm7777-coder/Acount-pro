// ========================================
// Finance Pro
// Firebase Configuration
// ========================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";


// ========================================
// Firebase Config
// Replace with your own Firebase config
// ========================================

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBHd1jmUCjtk4mGFzEyhvybPij5o6H-iPQ",
  authDomain: "acount-e76e7.firebaseapp.com",
  databaseURL: "https://acount-e76e7-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "acount-e76e7",
  storageBucket: "acount-e76e7.firebasestorage.app",
  messagingSenderId: "407594875276",
  appId: "1:407594875276:web:b13f7f2f1a608f46c7bea9",
  measurementId: "G-QGZZJEWHZG"
};

// ========================================
// Initialize Firebase
// ========================================

const app = initializeApp(firebaseConfig);


// ========================================
// Firebase Services
// ========================================

const auth = getAuth(app);

const db = getFirestore(app);

const storage = getStorage(app);


// ========================================
// Export
// ========================================

export {

    app,

    auth,

    db,

    storage

};