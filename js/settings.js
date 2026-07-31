// =======================================
// Finance Pro
// settings.js
// =======================================


import { auth, db } from "./firebase.js";


import {

onAuthStateChanged,
sendPasswordResetEmail,
deleteUser

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


import {

doc,
getDoc,
setDoc,
deleteDoc

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";




// Elements


const darkMode =
document.getElementById("darkMode");


const currency =
document.getElementById("currency");


const notification =
document.getElementById("notification");


const changePassword =
document.getElementById("changePassword");


const deleteAccount =
document.getElementById("deleteAccount");



let currentUser = null;





// =======================================
// Auth Check
// =======================================


onAuthStateChanged(auth,async(user)=>{


if(!user){

location.href="login.html";

return;

}


currentUser=user;


loadSettings();


});





// =======================================
// Load Settings
// =======================================


async function loadSettings(){


const ref =
doc(db,"users",currentUser.uid,"settings","userSettings");


const snap =
await getDoc(ref);



if(snap.exists()){


const data =
snap.data();



darkMode.checked =
data.darkMode || false;



currency.value =
data.currency || "INR";



notification.checked =
data.notification || false;



if(data.darkMode){

document.body.classList.add("dark");

}


}


}





// =======================================
// Save Settings
// =======================================


async function saveSettings(){


await setDoc(

doc(
db,
"users",
currentUser.uid,
"settings",
"userSettings"
),

{


darkMode:
darkMode.checked,


currency:
currency.value,


notification:
notification.checked


}


);


}




// Dark Mode


darkMode.addEventListener(
"change",
()=>{


if(darkMode.checked){


document.body.classList.add("dark");


}

else{


document.body.classList.remove("dark");


}


saveSettings();


});





// Currency Change


currency.addEventListener(
"change",
()=>{


saveSettings();


});





// Notification


notification.addEventListener(
"change",
()=>{


saveSettings();


});







// =======================================
// Change Password
// =======================================


changePassword.onclick=async()=>{


try{


await sendPasswordResetEmail(

auth,

currentUser.email

);



alert(
"Password reset link sent"
);



}

catch(error){


alert(error.message);


}


};






// =======================================
// Delete Account
// =======================================


deleteAccount.onclick=async()=>{


const confirmDelete =
confirm(
"Are you sure? Account will be deleted."
);



if(!confirmDelete) return;



try{


await deleteDoc(

doc(db,"users",currentUser.uid)

);



await deleteUser(currentUser);



alert(
"Account Deleted"
);



location.href="signup.html";



}

catch(error){


alert(error.message);


}


};
