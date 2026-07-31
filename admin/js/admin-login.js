// =======================================
// Finance Pro
// Admin Login
// Email + Google Login
// =======================================

import { auth, db } from "../../js/firebase.js";

import {
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    doc,
    getDoc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ==========================
// Elements
// ==========================

const emailInput = document.getElementById("adminEmail");
const passwordInput = document.getElementById("adminPassword");

const loginBtn = document.getElementById("loginBtn");
const googleBtn = document.getElementById("googleLogin");

const message = document.getElementById("message");


// ==========================
// Save Admin Profile
// ==========================

async function saveAdmin(user){

    const adminRef = doc(db,"admins",user.uid);

    const snap = await getDoc(adminRef);

    if(!snap.exists()){

        await setDoc(adminRef,{

            uid:user.uid,

            name:user.displayName || "Admin",

            email:user.email,

            photo:user.photoURL || "",

            provider:user.providerData[0]?.providerId || "password",

            role:"admin",

            createdAt:serverTimestamp(),

            lastLogin:serverTimestamp()

        });

    }

    else{

        await setDoc(adminRef,{

            lastLogin:serverTimestamp(),

            name:user.displayName || snap.data().name,

            photo:user.photoURL || snap.data().photo

        },{merge:true});

    }

}


// ==========================
// Email Login
// ==========================

loginBtn.onclick = async()=>{

    const email = emailInput.value.trim();

    const password = passwordInput.value.trim();

    if(email==="" || password===""){

        message.innerHTML="Enter Email & Password";

        return;

    }

    try{

        const result = await signInWithEmailAndPassword(

            auth,
            email,
            password

        );

        await saveAdmin(result.user);

        message.innerHTML="Login Successful";

        setTimeout(()=>{

            location.href="admin-dashboard.html";

        },1000);

    }

    catch(error){

        console.log(error);

        message.innerHTML=error.message;

    }

};


// ==========================
// Google Login
// ==========================

googleBtn.onclick = async()=>{

    try{

        const provider = new GoogleAuthProvider();

        const result = await signInWithPopup(

            auth,
            provider

        );

        await saveAdmin(result.user);

        message.innerHTML="Google Login Successful";

        setTimeout(()=>{

            location.href="admin-dashboard.html";

        },1000);

    }

    catch(error){

        console.log(error);

        message.innerHTML=error.message;

    }

};
