// =======================================
// Finance Pro
// Archive System
// =======================================

import { auth, db } from "./firebase.js";

import {
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
collection,
getDocs,
deleteDoc,
doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const archiveList = document.getElementById("archiveList");

let currentUser = null;

// ===============================
// Auth
// ===============================

onAuthStateChanged(auth,(user)=>{

if(!user){

location.href="login.html";
return;

}

currentUser=user;

loadArchives();

});

// ===============================
// Load Archives
// ===============================

async function loadArchives(){

archiveList.innerHTML=`

<div class="archive-card empty-card">

<i class="fa-solid fa-spinner fa-spin"></i>

<h3>Loading...</h3>

<p>Please wait</p>

</div>

`;

try{

const snap=await getDocs(

collection(
db,
"users",
currentUser.uid,
"archives"
)

);

if(snap.empty){

archiveList.innerHTML=`

<div class="archive-card empty-card">

<i class="fa-solid fa-box-open"></i>

<h3>No Archive Found</h3>

<p>Create your first archive from Dashboard.</p>

</div>

`;

return;

}

archiveList.innerHTML="";

const archives=[];

snap.forEach((item)=>{

archives.push({

id:item.id,

...item.data()

});

});

// Latest first
archives.reverse();

archives.forEach((data)=>{

const date=data.createdAt
? data.createdAt.toDate().toLocaleString("en-IN")
: "No Date";

archiveList.innerHTML+=`

<div class="archive-card">

<h3>

📦 ${data.name || "Untitled Archive"}

</h3>

<p>

<i class="fa-solid fa-calendar-days"></i>

${date}

</p>

<div class="archive-actions">

<button

class="btn openBtn"

onclick="openArchive('${data.id}')">

<i class="fa-solid fa-folder-open"></i>

Open

</button>

<button

class="btn deleteBtn"

onclick="deleteArchive('${data.id}')">

<i class="fa-solid fa-trash"></i>

Delete

</button>

</div>

</div>

`;

});

}

catch(error){

console.log(error);

archiveList.innerHTML=`

<div class="archive-card empty-card">

<i class="fa-solid fa-circle-exclamation"></i>

<h3>Something Went Wrong</h3>

<p>${error.message}</p>

</div>

`;

}

}

// ===============================
// Open Archive
// ===============================

window.openArchive=function(id){

location.href="archive-detail.html?id="+id;

};

// ===============================
// Delete Archive
// ===============================

window.deleteArchive=async function(id){

const ok=confirm("Delete this archive permanently?");

if(!ok) return;

try{

await deleteDoc(

doc(
db,
"users",
currentUser.uid,
"archives",
id
)

);

await loadArchives();

alert("Archive Deleted Successfully");

}

catch(error){

console.log(error);

alert(error.message);

}

};
