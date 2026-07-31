// =======================================
// Finance Pro
// Admin Dashboard
// Part 1
// =======================================

import { auth, db } from "../../js/firebase.js";

import {
onAuthStateChanged,
signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
collection,
getDocs,
getDoc,
doc,
deleteDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// =======================================
// Elements
// =======================================

const totalUsers =
document.getElementById("totalUsers");

const totalIncome =
document.getElementById("totalIncome");

const totalExpense =
document.getElementById("totalExpense");

const totalSavings =
document.getElementById("totalSavings");

const totalGoals =
document.getElementById("totalGoals");

const userList =
document.getElementById("userList");

const searchUser =
document.getElementById("searchUser");

const refreshBtn =
document.getElementById("refreshBtn");

const logoutBtn =
document.getElementById("logoutBtn");


// Modal Elements

const userModal =
document.getElementById("userModal");

const closeModal =
document.getElementById("closeModal");

const modalPhoto =
document.getElementById("modalPhoto");

const modalName =
document.getElementById("modalName");

const modalEmail =
document.getElementById("modalEmail");

const modalUid =
document.getElementById("modalUid");

const modalIncome =
document.getElementById("modalIncome");

const modalExpense =
document.getElementById("modalExpense");

const modalSavings =
document.getElementById("modalSavings");

const modalBudgets =
document.getElementById("modalBudgets");

const modalGoals =
document.getElementById("modalGoals");

const modalNotifications =
document.getElementById("modalNotifications");


// =======================================
// Variables
// =======================================

let adminUser = null;

let allUsers = [];


// =======================================
// Admin Authentication
// =======================================

onAuthStateChanged(auth, async(user)=>{

if(!user){

location.href="admin-login.html";

return;

}

try{

const adminSnap =
await getDoc(
doc(db,"admins",user.uid)
);

if(!adminSnap.exists()){

alert("Access Denied");

await signOut(auth);

location.href="admin-login.html";

return;

}

adminUser = user;

// Load Dashboard
loadUsers();

}catch(error){

console.log(error);

alert(error.message);

}

});
// =======================================
// Load All Users
// =======================================

async function loadUsers(){

try{

userList.innerHTML="Loading Users...";

const snapshot =
await getDocs(
collection(db,"users")
);

allUsers=[];

let users=0;
let income=0;
let expense=0;
let savings=0;
let goals=0;

snapshot.forEach((docSnap)=>{

const data=docSnap.data();

users++;

income+=data.totalIncome||0;

expense+=data.totalExpense||0;

savings+=data.totalSavings||0;

allUsers.push({

uid:docSnap.id,

...data

});

});


// =======================
// Count Goals
// =======================

for(const user of allUsers){

try{

const goalSnap=
await getDocs(

collection(
db,
"users",
user.uid,
"goals"
)

);

goals+=goalSnap.size;

}

catch(e){

console.log(e);

}

}


// =======================
// Dashboard Stats
// =======================

totalUsers.textContent=
users;

totalIncome.textContent=
money(income);

totalExpense.textContent=
money(expense);

totalSavings.textContent=
money(savings);

totalGoals.textContent=
goals;


// =======================
// Render User Cards
// =======================

renderUsers(allUsers);

}

catch(error){

console.log(error);

userList.innerHTML=`

<div class="admin-card">

<h3>

Failed to Load Users

</h3>

<p>

${error.message}

</p>

</div>

`;

}

}
// =======================================
// Render Users
// =======================================

function renderUsers(users){

userList.innerHTML="";

if(users.length===0){

userList.innerHTML=`

<div class="admin-card">

<h3>No Users Found</h3>

</div>

`;

return;

}

users.forEach((user)=>{

userList.innerHTML+=`

<div class="admin-card user-card">

<div class="user-header">

<img
class="user-photo"
src="${user.photo || "../../assets/profile.png"}"
alt="Profile">

<div class="user-details">

<h3>${user.name || "Unknown User"}</h3>

<p>${user.email || "No Email"}</p>

<small>UID : ${user.uid}</small>

</div>

</div>


<div class="user-stats">

<div>

<strong>Income</strong>

<p>${money(user.totalIncome || 0)}</p>

</div>

<div>

<strong>Expense</strong>

<p>${money(user.totalExpense || 0)}</p>

</div>

<div>

<strong>Savings</strong>

<p>${money(user.totalSavings || 0)}</p>

</div>

</div>


<div class="user-footer">

<button
class="view-btn"
onclick="viewUser('${user.uid}')">

View

</button>

<button
class="delete-btn"
onclick="deleteUser('${user.uid}')">

Delete

</button>

</div>

</div>

`;

});

}
// =======================================
// Search Users
// =======================================

if(searchUser){

searchUser.addEventListener("input",()=>{

const value=
searchUser.value
.toLowerCase()
.trim();

const filtered=
allUsers.filter((user)=>{

const name=
(user.name || "")
.toLowerCase();

const email=
(user.email || "")
.toLowerCase();

return(
name.includes(value) ||
email.includes(value)
);

});

renderUsers(filtered);

});

}


// =======================================
// Refresh Dashboard
// =======================================

if(refreshBtn){

refreshBtn.onclick=()=>{

loadUsers();

};

}


// =======================================
// Logout
// =======================================

if(logoutBtn){

logoutBtn.onclick=async()=>{

const ok=
confirm("Logout Admin?");

if(!ok) return;

try{

await signOut(auth);

location.href=
"admin-login.html";

}

catch(error){

alert(error.message);

}

};

}


// =======================================
// Money Format
// =======================================

function money(value){

return new Intl.NumberFormat(

"en-IN",

{

style:"currency",

currency:"INR",

maximumFractionDigits:0

}

).format(value);

}
// =======================================
// View User Details
// =======================================

window.viewUser = async(uid)=>{

try{

const userSnap =
await getDoc(
doc(db,"users",uid)
);

if(!userSnap.exists()){

alert("User Not Found");

return;

}

const user =
userSnap.data();

modalPhoto.src =
user.photo || "../../assets/profile.png";

modalName.textContent =
user.name || "Unknown User";

modalEmail.textContent =
user.email || "No Email";

modalUid.textContent =
"UID : " + uid;

modalIncome.textContent =
money(user.totalIncome || 0);

modalExpense.textContent =
money(user.totalExpense || 0);

modalSavings.textContent =
money(user.totalSavings || 0);


// =======================
// Budgets Count
// =======================

const budgetSnap =
await getDocs(
collection(
db,
"users",
uid,
"budgets"
)
);

modalBudgets.textContent =
budgetSnap.size;


// =======================
// Goals Count
// =======================

const goalSnap =
await getDocs(
collection(
db,
"users",
uid,
"goals"
)
);

modalGoals.textContent =
goalSnap.size;


// =======================
// Notifications Count
// =======================

const notificationSnap =
await getDocs(
collection(
db,
"users",
uid,
"notifications"
)
);

modalNotifications.textContent =
notificationSnap.size;


// =======================
// Show Modal
// =======================

userModal.classList.add("show");

}

catch(error){

console.log(error);

alert(error.message);

}

};


// =======================================
// Close Modal
// =======================================

if(closeModal){

closeModal.onclick=()=>{

userModal.classList.remove("show");

};

}


// =======================================
// Click Outside Close
// =======================================

window.addEventListener("click",(e)=>{

if(e.target===userModal){

userModal.classList.remove("show");

}

});
// =======================================
// Delete User
// =======================================

window.deleteUser = async(uid)=>{

const ok = confirm(
"Delete this user?\n\nOnly the user document will be deleted."
);

if(!ok) return;

try{

await deleteDoc(

doc(
db,
"users",
uid
)

);

alert("User Deleted Successfully");

loadUsers();

}
catch(error){

console.log(error);

alert(error.message);

}

};


// =======================================
// ESC Key Close Modal
// =======================================

window.addEventListener("keydown",(e)=>{

if(e.key==="Escape"){

userModal.classList.remove("show");

}

});


// =======================================
// Auto Refresh Every 30 Seconds
// =======================================

setInterval(()=>{

if(adminUser){

loadUsers();

}

},30000);


// =======================================
// Console Message
// =======================================

console.log(

"%cFinance Pro Admin Dashboard Loaded",

"color:#22c55e;font-size:16px;font-weight:bold;"

);
