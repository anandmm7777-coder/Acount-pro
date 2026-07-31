// =======================================
// Finance Pro
// notifications.js
// =======================================


import { auth, db } from "./firebase.js";


import {

onAuthStateChanged

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


import {

collection,
query,
orderBy,
onSnapshot,
doc,
updateDoc,
deleteDoc

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";





let currentUser=null;



const list =

document.getElementById(
"notificationList"
);







// ===============================
// Auth
// ===============================


onAuthStateChanged(auth,(user)=>{


if(!user){

location.href="login.html";

return;

}



currentUser=user;


loadNotifications();


});









// ===============================
// Load Notifications
// ===============================


function loadNotifications(){



const q=query(


collection(

db,

"users",

currentUser.uid,

"notifications"

),



orderBy(

"createdAt",

"desc"

)



);







onSnapshot(q,(snapshot)=>{



list.innerHTML="";





if(snapshot.empty){


list.innerHTML=`

<div class="notification-card">

<h3>

No Notifications

</h3>

</div>

`;


return;


}







snapshot.forEach((item)=>{



const data=item.data();



const id=item.id;







let icon="🔔";




if(data.type==="income")

icon="💰";



if(data.type==="expense")

icon="💸";



if(data.type==="saving")

icon="🐷";







list.innerHTML += `



<div class="notification-card 
${data.read ? "" : "unread"}">


<h3>

${icon}

${data.title}

</h3>



<p>

${data.message}

</p>



<small>

${new Date(data.createdAt)
.toLocaleString()}

</small>





<div class="notification-actions">



<button

onclick="markRead('${id}')">

Mark Read

</button>





<button

class="delete"

onclick="deleteNotification('${id}')">

Delete

</button>



</div>



</div>



`;



});



});



}









// ===============================
// Mark Read
// ===============================


window.markRead=async(id)=>{


await updateDoc(

doc(

db,

"users",

currentUser.uid,

"notifications",

id

),

{


read:true


}

);


};









// ===============================
// Delete
// ===============================


window.deleteNotification=async(id)=>{


await deleteDoc(

doc(

db,

"users",

currentUser.uid,

"notifications",

id

)

);


};
