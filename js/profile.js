// =======================================
// Finance Pro
// profile.js
// =======================================


import { auth, db } from "./firebase.js";


import {

onAuthStateChanged,
signOut,
sendPasswordResetEmail

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


import {

doc,
getDoc,
updateDoc

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



// Elements

const userName =
document.getElementById("userName");


const userEmail =
document.getElementById("userEmail");


const userPhoto =
document.getElementById("userPhoto");


const profileForm =
document.getElementById("profileForm");


const nameInput =
document.getElementById("name");


const logoutBtn =
document.getElementById("logoutBtn");


const changePassword =
document.getElementById("changePassword");



let currentUser = null;



// =======================================
// Auth Check
// =======================================


onAuthStateChanged(auth, async(user)=>{


if(!user){

location.href="login.html";

return;

}



currentUser = user;



loadProfile(user);



});




// =======================================
// Load Profile
// =======================================


async function loadProfile(user){


try{


const userRef =
doc(db,"users",user.uid);



const snap =
await getDoc(userRef);



if(snap.exists()){


const data =
snap.data();



userName.textContent =
data.name || "User";



nameInput.value =
data.name || "";



if(data.photo){


userPhoto.src =
data.photo;


}



}



userEmail.textContent =
user.email;



}

catch(error){


console.log(error);


}


}





// =======================================
// Update Profile
// =======================================


profileForm.addEventListener(
"submit",
async(e)=>{


e.preventDefault();



const newName =
nameInput.value.trim();



if(!newName) return;



try{


await updateDoc(

doc(
db,
"users",
currentUser.uid
),

{

name:newName

}

);



userName.textContent =
newName;



alert(
"Profile Updated Successfully"
);



}

catch(error){


alert(error.message);


}



});






// =======================================
// Logout
// =======================================


logoutBtn.onclick = async()=>{


try{


await signOut(auth);


location.href="login.html";


}

catch(error){


alert(error.message);


}


};






// =======================================
// Change Password
// =======================================


changePassword.onclick = async()=>{


try{


await sendPasswordResetEmail(

auth,

currentUser.email

);



alert(

"Password reset link sent to your email"

);



}

catch(error){


alert(error.message);


}


};
