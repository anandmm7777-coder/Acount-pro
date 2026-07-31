// ========================================
// Finance Pro
// auth.js
// ========================================

import { auth, db } from "./firebase.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ========================================
// Google Provider
// ========================================

const provider = new GoogleAuthProvider();


// ========================================
// SIGN UP
// ========================================

const signupForm = document.getElementById("signupForm");

if (signupForm) {

  signupForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const name = document.getElementById("name").value.trim();

    const email = document.getElementById("email").value.trim();

    const password = document.getElementById("password").value;

    const confirm = document.getElementById("confirmPassword").value;

    if (password !== confirm) {
      alert("Passwords do not match.");
      return;
    }

    try {

      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateProfile(result.user, {
        displayName: name
      });

      await setDoc(doc(db, "users", result.user.uid), {

        uid: result.user.uid,

        name: name,

        email: email,

        totalIncome: 0,

        totalExpense: 0,

        totalSavings: 0,

        createdAt: serverTimestamp()

      });

      alert("Account Created Successfully");

      location.href = "dashboard.html";

    } catch (error) {

      alert(error.message);

    }

  });

}


// ========================================
// LOGIN
// ========================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

  loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email = document.getElementById("email").value.trim();

    const password = document.getElementById("password").value;

    try {

      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      location.href = "dashboard.html";

    } catch (error) {

      alert(error.message);

    }

  });

}


// ========================================
// GOOGLE LOGIN
// ========================================

const googleBtn = document.getElementById("googleLogin");

if (googleBtn) {

  googleBtn.addEventListener("click", async () => {

    try {

      const result = await signInWithPopup(auth, provider);

      const ref = doc(db, "users", result.user.uid);

      const snap = await getDoc(ref);

      if (!snap.exists()) {

        await setDoc(ref, {

          uid: result.user.uid,

          name: result.user.displayName,

          email: result.user.email,

          photo: result.user.photoURL,

          totalIncome: 0,

          totalExpense: 0,

          totalSavings: 0,

          createdAt: serverTimestamp()

        });

      }

      location.href = "dashboard.html";

    } catch (error) {

      alert(error.message);

    }

  });

}


// ========================================
// FORGOT PASSWORD
// ========================================

const resetForm = document.getElementById("resetForm");

if (resetForm) {

  resetForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email = document.getElementById("email").value.trim();

    try {

      await sendPasswordResetEmail(auth, email);

      alert("Password reset email sent.");

      location.href = "login.html";

    } catch (error) {

      alert(error.message);

    }

  });

}


// ========================================
// LOGOUT
// ========================================

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

  logoutBtn.addEventListener("click", async () => {

    await signOut(auth);

    location.href = "login.html";

  });

}


// ========================================
// AUTH CHECK
// ========================================

onAuthStateChanged(auth, (user) => {

  if (!user) {

    if (
      location.pathname.includes("dashboard") ||
      location.pathname.includes("income") ||
      location.pathname.includes("expense") ||
      location.pathname.includes("savings") ||
      location.pathname.includes("reports") ||
      location.pathname.includes("profile") ||
      location.pathname.includes("settings")
    ) {

      location.href = "login.html";

    }

  }

});
